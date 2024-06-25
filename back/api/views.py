from django.db.models import Q
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
import json
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework import generics
from rest_framework.serializers import ValidationError
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .consumers import ApplicationConsumer

from .utils import send_notification_email, generate_pdf

from django_filters.rest_framework import DjangoFilterBackend
from .filters import (
    ApplicationFilter,
    WorkTaskFilter,
    WorkMaterialFilter,
    LegalEntityFilter,
    SawatzkyEmployeeFilter, filter_founded_applications, ReportFilter,
    GeneralJournalFilter,
)


from .serializers import (
    UserSerializer,
    ApplicationWithCreatorSerializer,
    ApplicationWorkMaterialSerializer,
    ApplicationSerializer,
    ApplicationDispatcherSerializer,
    LegalEntitySerializer,
    WorkObjectsGroupSerializer,
    WorkObjectsGroupWithWorkObjectSerializer,
    WorkMaterialSerializer,
    WorkTaskSerializer,
    WorkTaskGroupSerializer,
    WorkTaskGroupWithWorkTaskSerializer,
    WorkMaterialGroupSerializer,
    WorkMaterialGroupWithWorkMaterialSerializer,
    WorkObjectSerializer,
    EmployeeWithUserSerializer,
    EmployeeSerializer,
    EmployeeWithUserUPSerializer,
    UserRegistrationSerializer,
    ApplicationWithWorkTasksWorkMaterialsUpdateSerializer,
    LegalEntityDetailSerializer,
    DocumentsSerializer,
    SawatzkyEmployeeSerializer,
    SawatzkyEmployeeWithWorkObjectSerializer,
    SawatzkyEmployeeWithoutworkingObjectsSerializer,
    SawatzkyEmployeeWithUserSerializer,
    LegalEntityOrClientLESerializer,
    LegalEntityListSerializer,
    EmployeeListSerializer,
    EmployeeDetailSerializer,
    UserChangePasswordSerializer,
    ReportCreateSerializer,
    ReportDetailSerializer,
    ReportListSerializer,
    EmployeeWithPowerOfAttorney,
    CommentsCreateSerializer,
    CommentsListSerializer,
    SawatzkyEmployeeUpdateSerializer,
    WorkObjectsGroupUpdateSerializer,
    WorkTaskGroupUpdateSerializer,
    WorkMaterialGroupUpdateSerializer,
    LegalEntityUpdateSerializer,
    WorkTaskUpdateSerializer,
    WorkMaterialUpdateSerializer,
    WorkObjectUpdateSerializer, ApplicationListSerializer, GeneralJournalCreateSerializer, GeneralJournalListSerializer,
    GeneralJournalDetailSerializer,
    GeneralJournalUpdateSerializer,
    GeneralJournalUpdateAPLSerializer, GeneralJournalApplicationsByLegalEntitySerializer
)

from .models import (
    User,
    Employee,
    Application,
    LegalEntity,
    WorkObjectsGroup,
    WorkMaterial,
    WorkTask,
    WorkTaskGroup,
    WorkMaterialGroup,
    WorkObject,
    Document,
    SawatzkyEmployee,
    Report,
    Comments,
    Log, GeneralJournal
)


"""User"""
class AuthUserView(generics.RetrieveAPIView):
    # представление для аутентификации пользователя
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):

        try:
            user = self.get_object()
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)


class UserChangePasswordView(generics.UpdateAPIView):
    # Представление для смены пароля пользователя
    serializer_class = UserChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'message': 'Старый пароль введен неверно'}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({'message': 'Новый пароль совпадает со старым'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Пароль успешно изменен'}, status=status.HTTP_200_OK)


class UserDetailView(generics.RetrieveDestroyAPIView):
    # представление для пользователей, которые получаются по ID
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        user = User.objects.get(id=user_id)

        try:
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')

        try:
            user = self.get_queryset().get(id=user_id)
            user.delete()
            return Response({'message': 'Пользователь успешно удален'}, status=status.HTTP_204_NO_CONTENT)

        except User.DoesNotExist:
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)


"""Application"""
channel_layer = get_channel_layer()
class ApplicationCreateView(generics.CreateAPIView):
    # представление на создание заявки
    serializer_class = ApplicationSerializer
    queryset = Application.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        instance = serializer.save()
        work_object = instance.creator.legalEntity.workObject.id
        channel_layer = get_channel_layer()
        channel_name = f"sawatzky_dispatcher_{work_object}"
        try:
            data = {
                'action': 'create_application',
                'application_data': serializer.data,
            }
            async_to_sync(channel_layer.group_send)(
                channel_name,
                {
                    'type': 'send_application_notification',
                    'application_data': json.dumps(data['application_data'])
                }
            )
        except json.JSONDecodeError:
            pass


class ApplicationDispatcherCreateView(generics.CreateAPIView):
    """представление на создание заявки диспетчером"""
    serializer_class = ApplicationDispatcherSerializer
    queryset = Application.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        instance = serializer.save()
        work_object = instance.creator.legalEntity.workObject.id
        channel_layer = get_channel_layer()
        channel_name = f"sawatzky_dispatcher_{work_object}"
        try:
            data = {
                'action': 'create_application',
                'application_data': serializer.data,
            }
            async_to_sync(channel_layer.group_send)(
                channel_name,
                {
                    'type': 'send_application_notification',
                    'application_data': json.dumps(data['application_data'])
                }
            )
        except json.JSONDecodeError:
            pass


class ApplicationUpdateView(generics.UpdateAPIView):
    # представление на обновление заявки
    serializer_class = ApplicationWithWorkTasksWorkMaterialsUpdateSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            applications = Application.objects.filter(id=pk)
            return applications

        except (KeyError, Application.DoesNotExist):
            return Response({'message': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)


    def perform_update(self, serializer):
        instance = serializer.save()
        work_object = instance.creator.legalEntity.workObject.id

        assigned_performers = instance.performers.all()
        performer_ids = [performer.id for performer in assigned_performers]

        user_id = instance.creator.user.id

        channel_layer = get_channel_layer()
        try:
            data = {
                'action': 'assign_performer',
                'assignment_data': serializer.data,
                'performer_ids': performer_ids,
            }
            channel_name_performer = f"sawatzky_performer_{work_object}"
            if performer_ids:
                # print(f"Отправка уведомлений исполнителю: {performer_ids}")
                async_to_sync(channel_layer.group_send)(
                    channel_name_performer,
                    {
                        'type': 'send_assignment_notification_to_performers',
                        'performer_ids': performer_ids,
                        'assignment_data': json.dumps(data['assignment_data']),
                    }
                )


            status_data = {
                'status': instance.status,
                'additional_info': 'Дополнительная информация о статусе',
            }
            channel_name_dispatchers = f"sawatzky_dispatcher_{work_object}"
            async_to_sync(channel_layer.group_send)(
                channel_name_dispatchers,
                {
                    'type': 'send_status_change_notification',
                    'status_data': json.dumps(status_data),
                }
            )


            status_data = {
                'status': instance.status,
                'additional_info': 'Дополнительная информация о статусе',
            }
            channel_name_initiator = f"sawatzky_initiator_{user_id}"
            async_to_sync(channel_layer.group_send)(
                channel_name_initiator,
                {
                    'type': 'send_status_change_notification',
                    'status_data': json.dumps(status_data),
                }
            )

        except json.JSONDecodeError:
            pass


class ApplicationListView(generics.ListAPIView):
    # представление на создание и вывод списка заявок
    serializer_class = ApplicationWithCreatorSerializer
    queryset = Application.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ApplicationFilter

    def get_queryset(self):
        try:
            queryset = super().get_queryset()
            user = self.request.user

            if hasattr(user, 'employee'):
                employee = self.request.user.employee

                queryset = queryset.filter(creator__legalEntity__workObject=employee.legalEntity.workObject)
            elif hasattr(user, 'sawatzky_employee'):
                employee = user.sawatzky_employee
                working_objects = user.sawatzky_employee.workingObjects.all()
                if employee.role == 'performer':
                    # for application in queryset:
                    #     for performer in application.performers.all():
                    #         for field in performer._meta.get_fields():
                    #             print(field)
                    queryset = queryset.filter(performers=employee)
                else: 
                    queryset = queryset.filter(creator__legalEntity__workObject__in=working_objects)

            else:
                return queryset
            return queryset
        except Exception as e:
            print(e)
            return Application.objects.none()


class ApplicationDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление списка заявок по id создателя
    serializer_class = ApplicationWithCreatorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            applications = Application.objects.filter(id=pk).order_by('-createdAt')
            return applications

        except (KeyError, Application.DoesNotExist):
            return Response({'message': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)


class UpdateApplicationStatusAPIView(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            applications = Application.objects.filter(id=pk)
            return applications

        except (KeyError, Application.DoesNotExist):
            return Response({'message': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if not hasattr(request.user, 'employee'):
            return Response({'message': 'Пользователь не ассоциирован с сотрудником'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.employee.legalEntity != instance.creator.legalEntity:
            return Response({'message': 'У вас нет прав для изменения статуса этой заявки'}, status=status.HTTP_403_FORBIDDEN)

        instance.status = 'rejected'
        instance.save()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ApplicationListByLegalEntityView(generics.ListAPIView):
    serializer_class = ApplicationListSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        pk = self.kwargs.get('pk', None)
        if pk is not None:
            return Application.objects.filter(creator__legalEntity__id=pk)
        return Application.objects.none()



"""LegalEntity"""
class LegalEntityCreateView(generics.CreateAPIView):
    # представление на создание Юр. лица
    queryset = LegalEntity.objects.all()
    serializer_class = LegalEntityOrClientLESerializer
    # permission_classes = [permissions.IsAuthenticated]

class LegalEntityListView(generics.ListAPIView):
    # представление на создание и вывод списка Юр. лиц
    queryset = LegalEntity.objects.all()
    serializer_class = LegalEntityListSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = LegalEntityFilter


class LegalEntityDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление Юр. лица по id
    serializer_class = LegalEntityDetailSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            legalEntity = LegalEntity.objects.filter(id=pk)
            return legalEntity

        except (KeyError, LegalEntity.DoesNotExist):
            return Response({'message': 'Юр. лицо не найдено'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        """Запрет на удаление Юр лиц, если пользователь не администратор"""
        user = self.request.user
        try:
            sawatzky_employee = user.sawatzky_employee
        except SawatzkyEmployee.DoesNotExist:
            raise PermissionDenied("У вас нет прав на удаление этого объекта.")

        if sawatzky_employee.role != 'admin':
            raise PermissionDenied("У вас нет прав на удаление этого объекта.")

        # Получаем объект, который нужно удалить
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class LegalEntityUpdateView(generics.UpdateAPIView):
    # представление на обновление группы объектов
    serializer_class = LegalEntityUpdateSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            legalEntity = LegalEntity.objects.filter(id=pk)
            return legalEntity

        except (KeyError, LegalEntity.DoesNotExist):
            return Response({'message': 'Юр. лицо заказчика не найдено'}, status=status.HTTP_404_NOT_FOUND)



"""WorkObjectsGroup"""
class WorkObjectsGroupCreateView(generics.CreateAPIView):
    # представление на создание групп рабочих объектов
    queryset = WorkObjectsGroup.objects.all()
    serializer_class = WorkObjectsGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkObjectsGroupListView(generics.ListAPIView):
    # представление на создание и вывод списка групп рабочих объектов
    queryset = WorkObjectsGroup.objects.all()
    serializer_class = WorkObjectsGroupWithWorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkObjectsGroupDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление списка групп рабочих объектов по id
    serializer_class = WorkObjectsGroupWithWorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workObjectsGroups = WorkObjectsGroup.objects.filter(id=pk)
            return workObjectsGroups

        except (KeyError, WorkObjectsGroup.DoesNotExist):
            return Response({'message': 'Группа рабочих обьектов не найдена'}, status=status.HTTP_404_NOT_FOUND)


class WorkObjectsGroupUpdateView(generics.UpdateAPIView):
    # представление на обновление группы объектов
    serializer_class = WorkObjectsGroupUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workObjectsGroup = WorkObjectsGroup.objects.filter(id=pk)
            return workObjectsGroup

        except (KeyError, WorkObjectsGroup.DoesNotExist):
            return Response({'message': 'Рабочая группа не найдена'}, status=status.HTTP_404_NOT_FOUND)


"""WorkMaterial"""
class WorkMaterialCreateView(generics.CreateAPIView):
    # представление на создание рабочих материалов для проведения работ
    queryset = WorkMaterial.objects.all()
    serializer_class = WorkMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            group = WorkMaterialGroup.objects.get(id=request.data['workMaterialGroup'])
            newWorkMaterialSerializer = self.get_serializer(data=request.data)
            newWorkMaterial = newWorkMaterialSerializer.is_valid(raise_exception=True)
            newWorkMaterial = newWorkMaterialSerializer.save()
            group.materials.add(newWorkMaterial)
            group.save()
            return Response(newWorkMaterialSerializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as error:
            return Response(error.detail, status=error.status_code)


class WorkMaterialListView(generics.ListAPIView):
    # представление на создание и вывод списка рабочих материалов для проведения работ
    queryset = WorkMaterial.objects.all()
    serializer_class = WorkMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = WorkMaterialFilter

class WorkMaterialDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление рабочих материалов для проведения работ по id
    serializer_class = WorkMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workMaterial = WorkMaterial.objects.filter(id=pk)
            return workMaterial

        except (KeyError, WorkMaterial.DoesNotExist):
            return Response({'message': 'Рабочие материалы для проведения работ не найдены'}, status=status.HTTP_404_NOT_FOUND)


class WorkMaterialUpdateView(generics.UpdateAPIView):
    # представление на обновление материалов
    serializer_class = WorkMaterialUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workMaterial = WorkMaterial.objects.filter(id=pk)
            return workMaterial

        except (KeyError, WorkMaterial.DoesNotExist):
            return Response({'message': 'Материалы не найдены'}, status=status.HTTP_404_NOT_FOUND)


"""WorkTask"""
class WorkTaskCreateView(generics.CreateAPIView):
    # представление на создание работ проводимых на объекте
    queryset = WorkTask.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkTaskSerializer

    def post(self, request, *args, **kwargs):

        try:
            group = WorkTaskGroup.objects.get(id=request.data['workTaskGroup'])
            newWorkTaskSerializer = self.get_serializer(data=request.data)
            newWorkTask = newWorkTaskSerializer.is_valid(raise_exception=True)
            newWorkTask = newWorkTaskSerializer.save()
            group.tasks.add(newWorkTask)
            group.save()
            return Response(newWorkTaskSerializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as error:
            return Response(error.detail, status=error.status_code)


class WorkTaskListView(generics.ListAPIView):
    # представление на создание и вывод списка работ проводимых на объекте
    queryset = WorkTask.objects.all()
    serializer_class = WorkTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = WorkTaskFilter

class WorkTaskDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление работ проводимых на объекте по id
    serializer_class = WorkTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workTask = WorkTask.objects.filter(id=pk)
            return workTask

        except (KeyError, WorkTask.DoesNotExist):
            return Response({'message': 'Работы проводимые на объекте не найдены'}, status=status.HTTP_404_NOT_FOUND)


class WorkTaskUpdateView(generics.UpdateAPIView):
    # представление на обновление услуг
    serializer_class = WorkTaskUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workTask = WorkTask.objects.filter(id=pk)
            return workTask

        except (KeyError, WorkTask.DoesNotExist):
            return Response({'message': 'Услуга не найдена'}, status=status.HTTP_404_NOT_FOUND)


"""WorkTaskGroup"""
class WorkTaskGroupCreateView(generics.CreateAPIView):
    # представление на создание групп услуг
    queryset = WorkTaskGroup.objects.all()
    serializer_class = WorkTaskGroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class WorkTaskGroupListView(generics.ListAPIView):
    # представление на создание и вывод списка групп услуг
    queryset = WorkTaskGroup.objects.all()
    serializer_class = WorkTaskGroupWithWorkTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkTaskGroupDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление групп услуг по id
    serializer_class = WorkTaskGroupWithWorkTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workTaskGroup = WorkTaskGroup.objects.filter(id=pk)
            return workTaskGroup

        except (KeyError, WorkTask.DoesNotExist):
            return Response({'message': 'Группы услуг не найдены'}, status=status.HTTP_404_NOT_FOUND)


class WorkTaskGroupUpdateView(generics.UpdateAPIView):
    # представление на обновление группы услуг
    serializer_class = WorkTaskGroupUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workTaskGroup = WorkTaskGroup.objects.filter(id=pk)
            return workTaskGroup

        except (KeyError, WorkTaskGroup.DoesNotExist):
            return Response({'message': 'Группа услуг не найдена'}, status=status.HTTP_404_NOT_FOUND)



"""WorkMaterialGroup"""
class WorkMaterialGroupCreateView(generics.CreateAPIView):
    # представление на создание групп услуг
    queryset = WorkMaterialGroup.objects.all()
    serializer_class = WorkMaterialGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkMaterialGroupListView(generics.ListAPIView):
    # представление на создание и вывод списка групп услуг
    queryset = WorkMaterialGroup.objects.all()
    serializer_class = WorkMaterialGroupWithWorkMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkMaterialGroupDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление групп услуг по id
    serializer_class = WorkMaterialGroupWithWorkMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workMaterialGroup = WorkMaterialGroup.objects.filter(id=pk)
            return workMaterialGroup

        except (KeyError, WorkMaterial.DoesNotExist):
            return Response({'message': 'Группы услуг не найдены'}, status=status.HTTP_404_NOT_FOUND)


class WorkMaterialGroupUpdateView(generics.UpdateAPIView):
    # представление на обновление группы рабочих материалов
    serializer_class = WorkMaterialGroupUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workMaterialGroup = WorkMaterialGroup.objects.filter(id=pk)
            return workMaterialGroup

        except (KeyError, WorkMaterialGroup.DoesNotExist):
            return Response({'message': 'Группа рабочих материалов не найдена'}, status=status.HTTP_404_NOT_FOUND)


"""WorkObject"""
class WorkObjectCreateView(generics.CreateAPIView):
    # представление на создание рабочего объекта
    queryset = WorkObject.objects.all()
    serializer_class = WorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            group = WorkObjectsGroup.objects.get(id=request.data['workObjectGroup'])
            newWorkObjectSerializer = self.get_serializer(data=request.data)
            newWorkObject = newWorkObjectSerializer.is_valid(raise_exception=True)
            newWorkObject = newWorkObjectSerializer.save()
            group.workObjects.add(newWorkObject)
            group.save()
            return Response(newWorkObjectSerializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as error:
            return Response(error.detail, status=error.status_code)

class WorkObjectListView(generics.ListAPIView):
    # представление на создание и вывод списка рабочих объектов
    queryset = WorkObject.objects.all()
    serializer_class = WorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkObjectDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление рабочих объектов по id
    serializer_class = WorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workObject = WorkObject.objects.filter(id=pk)
            return workObject

        except (KeyError, WorkObject.DoesNotExist):
            return Response({'message': 'Рабочий объект не найден'}, status=status.HTTP_404_NOT_FOUND)


class WorkObjectUpdateView(generics.UpdateAPIView):
    # представление на обновление рабочих объектов
    serializer_class = WorkObjectUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            workObject = WorkObject.objects.filter(id=pk)
            return workObject

        except (KeyError, WorkObject.DoesNotExist):
            return Response({'message': 'Рабочий объект не найден'}, status=status.HTTP_404_NOT_FOUND)



"""Employee"""
class EmployeeListView(generics.ListAPIView):
    # представление на создание и вывод списка пользователей
    serializer_class = EmployeeWithUserSerializer
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            if(hasattr(self.request.user, 'employee')):
                queryset = Employee.objects.filter(legalEntity=self.request.user.employee.legalEntity.id)
            else:
                queryset = Employee.objects.all()
            return queryset
        except Exception as e:
            print(e)
            return Response({'message': 'Ошибка получения списка работников'}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeUpdateView(generics.UpdateAPIView):
    # представление на обновление профиля пользователя
    serializer_class = EmployeeWithPowerOfAttorney
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            employee = Employee.objects.filter(id=pk)
            return employee

        except (KeyError, Employee.DoesNotExist):
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)


class EmployeeDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление пользователей по id
    serializer_class = EmployeeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            employee = Employee.objects.filter(id=pk)
            return employee

        except (KeyError, Employee.DoesNotExist):
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)


class EmployeeCreateView(generics.CreateAPIView):
    # представление на создание расширения модели пользователя, после регистрации user
    queryset = Employee.objects.all()
    serializer_class = EmployeeWithUserUPSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            #Валидация
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            #Обработка данных
            user_data = request.data.pop('user')
            legalEntityId = request.data.pop('legalEntity')
            legalEntity = LegalEntity.objects.get(id=legalEntityId)

            if User.objects.filter(username=user_data['username']).exists():
                return Response({'message': 'Пользователь с таким именем уже существует'},
                                status=status.HTTP_400_BAD_REQUEST)

            #Создание и сохранение объектов
            user = User.objects.create_user(**user_data)
            employee = Employee.objects.create(user=user, legalEntity=legalEntity, **request.data)
            employee.save()
            employee_serializer = EmployeeWithUserSerializer(instance=employee)

            return Response(employee_serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as error:
            return Response(error.detail, status=error.status_code)


"""Document"""
class DocumentsCreateView(generics.CreateAPIView):
    # представление на создание документов
    serializer_class = DocumentsSerializer
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class DocumentsDetailView(generics.RetrieveDestroyAPIView):
    # представление на вывод списка рабочих объектов
    serializer_class = DocumentsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            doc = Document.objects.filter(id=pk)
            return doc

        except (KeyError, Document.DoesNotExist):
            return Response({'message': 'Документ не найден'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            document_name = instance.name

            application = instance.application_documents.all().first()

            self.perform_destroy(instance)

            delLog = Log.objects.create(
                changer=request.user,
                application=application,
                whatChange=f"Удален документ: '{document_name}'",
                changeDate=timezone.now()
            )



            application.logs.add(delLog)
            application.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DocumentToApplicationCreateView(generics.CreateAPIView):
    # представление на создание документа с привязкой к заявке
    serializer_class = DocumentsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Document.objects.all()

    def create(self, request, *args, **kwargs):
        try:

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            document = serializer.save()

            application_pk = self.kwargs.get('pk')
            application = Application.objects.get(pk=application_pk)

            application.documents.add(document)
            application.save()


            log = Log.objects.create(
                changer=request.user,
                application=application,
                whatChange=f"Добавлен новый документ: '{document.name}'",
                changeDate=timezone.now()
            )

            logs = application.logs.all().order_by('-changeDate')

            logs_list = list(logs)

            logs_list.insert(0, log)

            application.logs.set(logs_list)
            application.save()

            if application.creator.user.email:
                send_notification_email(application.creator.user.email, application.title, document.name)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Application.DoesNotExist:
            return Response({'message': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)



"""SawatzkyEmployee"""
class SawatzkyEmployeeCreateView(generics.CreateAPIView):
    # представление на создание расширенной модели пользователя Sawatzky, после регистрации user
    serializer_class = SawatzkyEmployeeSerializer
    queryset = SawatzkyEmployee.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user_data = request.data.pop('user')
            work_object_group_id = request.data.pop('workObjectGroup')
            work_object_group = WorkObjectsGroup.objects.get(id=work_object_group_id)
            work_object_id = request.data.pop('workObject')
            work_object = WorkObject.objects.get(id=work_object_id)

            if User.objects.filter(username=user_data['username']).exists():
                return Response({'message': 'Пользователь Sawatzky с таким именем уже существует'},
                                status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(**user_data)
            working_objects_data = request.data.pop('workingObjects', [])
            sawatzky_employee = SawatzkyEmployee.objects.create(user=user, workObjectGroup=work_object_group,
                                                                workObject=work_object, **request.data)

            sawatzky_employee.workingObjects.set(working_objects_data)

            sawatzky_employee.save()
            sawatzky_employee_serializer = SawatzkyEmployeeWithUserSerializer(instance=sawatzky_employee)

            return Response(sawatzky_employee_serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as error:
            return Response(error.detail, status=error.status_code)


class SawatzkyEmployeeListView(generics.ListAPIView):
    # представление на создание и вывод списка пользователей Sawatzky
    serializer_class = SawatzkyEmployeeWithoutworkingObjectsSerializer
    queryset = SawatzkyEmployee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SawatzkyEmployeeFilter

    def get_queryset(self):
        try:
            queryset = SawatzkyEmployee.objects.all()
            return queryset
        except Exception as e:
            print(e)
            return Response({'message': 'Ошибка получения списка работников'}, status=status.HTTP_400_BAD_REQUEST)


class SawatzkyEmployeeDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление пользователей Sawatzky по id
    serializer_class = SawatzkyEmployeeWithWorkObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            sawatzkyEmployee = SawatzkyEmployee.objects.filter(id=pk)
            return sawatzkyEmployee

        except (KeyError, SawatzkyEmployee.DoesNotExist):
            return Response({'message': 'Пользователь Sawatzky не найден'}, status=status.HTTP_404_NOT_FOUND)


class SawatzkyEmployeeUpdateView(generics.UpdateAPIView):
    # представление на обновление профиля пользователя саватски
    serializer_class = SawatzkyEmployeeUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            sawatzkyEmployee = SawatzkyEmployee.objects.filter(id=pk)
            return sawatzkyEmployee

        except (KeyError, SawatzkyEmployee.DoesNotExist):
            return Response({'message': 'Пользователь сававтски не найден'}, status=status.HTTP_404_NOT_FOUND)


"""Report"""
class ReportCreateView(generics.CreateAPIView):
    # представление на создание отчетов
    queryset = Report.objects.all()
    serializer_class = ReportCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Получение legalEntity из запроса или установка значения по умолчанию
        # applications = Application.objects.filter(creator__legalEntity=serializer.validated_data.get('legalEntity', instance.legalEntity.id))
        legal_entity = serializer.validated_data.get('legalEntity', instance.legalEntity.id if instance.legalEntity else None)
        applications = Application.objects.filter(creator__legalEntity=legal_entity)

        application_status = serializer.validated_data.get('application_status')

        if application_status:
            applications = applications.filter(status=application_status)

        instance.foundedApllications.set(applications)
        instance.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ReportListView(generics.ListAPIView):
    # представление на вывод списка отчетов
    queryset = Report.objects.all()
    serializer_class = ReportListSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление отчетов по id
    serializer_class = ReportDetailSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ReportFilter

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            report = Report.objects.filter(id=pk)

            report_instance = report.first()
            filter_founded_applications(report_instance)

            return report

        except (KeyError, Report.DoesNotExist):
            return Response({'message': 'Отчет не найден'}, status=status.HTTP_404_NOT_FOUND)


def report_download(request, pk):
    report = get_object_or_404(Report, pk=pk)
    return generate_pdf(report)


"""Comments"""
class CommentsToApplicationCreateView(generics.CreateAPIView):
    # представление на создание комментария с привязкой к заявке
    serializer_class = CommentsCreateSerializer
    queryset = Comments.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:

            application_pk = self.kwargs.get('pk')
            application = Application.objects.get(pk=application_pk)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            comment = serializer.save()

            is_sawatzky_employee = self.request.data['isSawatzky']

            if is_sawatzky_employee:
                application.sawatzkyComments.add(comment)
            else:
                application.comments.add(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Comments.DoesNotExist:
            return Response({'message': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)


class CommentsListView(generics.ListAPIView):
    # представление на вывод списка комментариев
    queryset = Comments.objects.all()
    serializer_class = CommentsListSerializer
    permission_classes = [permissions.IsAuthenticated]


"""GeneralJournal"""
class GeneralJournalCreateView(generics.CreateAPIView):
    # представление на создание комментария с привязкой к заявке
    serializer_class = GeneralJournalCreateSerializer
    queryset = GeneralJournal.objects.all()
    # permission_classes = [permissions.IsAuthenticated]


class GeneralJournalListView(generics.ListAPIView):
    # представление на вывод списка счетов
    queryset = GeneralJournal.objects.all()
    serializer_class = GeneralJournalListSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = GeneralJournalFilter


class GeneralJournalDetailView(generics.RetrieveDestroyAPIView):
    # представление на получение, обновление, удаление журналов по id
    serializer_class = GeneralJournalDetailSerializer
    # permission_classes = [permissions.IsAuthenticated]
    # filter_backends = (DjangoFilterBackend,)
    # filterset_class = ReportFilter

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            generalJournal = GeneralJournal.objects.filter(id=pk)
            return generalJournal

        except (KeyError, GeneralJournal.DoesNotExist):
            return Response({'message': 'Генеральный журнал не найден'}, status=status.HTTP_404_NOT_FOUND)


class GeneralJournalUpdateView(generics.UpdateAPIView):
    """Представление на обновление записи журнала по id"""
    serializer_class = GeneralJournalUpdateSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            generalJournal = GeneralJournal.objects.filter(id=pk)
            return generalJournal

        except (KeyError, GeneralJournal.DoesNotExist):
            return Response({'message': 'Генеральный журнал не найден'}, status=status.HTTP_404_NOT_FOUND)



class GeneralJournalUpdateAPLView(generics.UpdateAPIView):
    """Представление на обновление связанных заявок журнала по id"""
    serializer_class = GeneralJournalUpdateAPLSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        try:
            pk = self.kwargs['pk']
            generalJournal = GeneralJournal.objects.filter(id=pk)
            return generalJournal

        except (KeyError, GeneralJournal.DoesNotExist):
            return Response({'message': 'Генеральный журнал не найден'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()


class GeneralJournalApplicationsByLegalEntityView(generics.ListAPIView):
    serializer_class = GeneralJournalApplicationsByLegalEntitySerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        legal_entity_id = self.kwargs['legal_entity_id']
        return Application.objects.filter(creator__legalEntity_id=legal_entity_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)