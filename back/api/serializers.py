from django.db import models, transaction
from django.db.models import F, Sum
from decimal import Decimal
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.db.models import Sum
from django.utils import timezone
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from datetime import datetime

from .models import (
    User,
    Employee,
    Application,
    LegalEntity,
    WorkObjectsGroup,
    WorkObject,
    WorkMaterial,
    WorkTask,
    WorkTaskGroup,
    WorkMaterialGroup,
    ApplicationWorkTask,
    ApplicationWorkMaterial,
    Document,
    SawatzkyEmployee,
    ApplicationPerformer,
    Report,
    Comments,
    Log, GeneralJournal, ApplicationJournal
)


'''Employee'''
class EmployeeSerializer(ModelSerializer):
    # Сериализатор модели расширяющей профиль пользователя
    class Meta:
        model = Employee
        fields = '__all__'


'''User'''
class UserSerializer(ModelSerializer):
    # Сериализатор модели пользователя для отображения данных о нем
    def get_employee(self, obj):
        try:
            employee = Employee.objects.get(user=obj)
            return EmployeeSerializer(employee).data
        except Employee.DoesNotExist:
            try:
                sawatzky_employee = SawatzkyEmployee.objects.get(user=obj)
                return SawatzkyEmployeeWithWorkObjectSerializer(sawatzky_employee).data
            except SawatzkyEmployee.DoesNotExist:
                return None

    class Meta:
        model = User
        fields = ['id', 'fio', 'phoneNumber']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        employee_data = self.get_employee(instance)
        if employee_data:
            if 'position' in employee_data:
                data['sawatzkyEmployee'] = employee_data
            else:
                data['employee'] = employee_data
        return data


'''UserWithoutEmployee'''
class UserSerializerWithoutEmployee(ModelSerializer):
    # Сериализатор модели пользователя без поля Employee
    class Meta:
        model = User
        fields = ['id', 'fio', 'phoneNumber', 'username']


'''UserFIO'''
class UserFIOSerializer(ModelSerializer):
    # Сериализатор модели пользователя
    class Meta:
        model = User
        fields = ['fio']


'''UserFIOandPhonenumber'''
class UserFIOandPhonenumberSerializer(ModelSerializer):
    # Сериализатор модели пользователя
    class Meta:
        model = User
        fields = ['fio', 'phoneNumber']


'''UserRegistration'''
class UserRegistrationSerializer(serializers.ModelSerializer):
    # Сериализатор для регистрации пользователя
    fio = serializers.CharField()
    phoneNumber = serializers.CharField()
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'fio', 'phoneNumber']



'''ChangePassword'''
class UserChangePasswordSerializer(serializers.ModelSerializer):
    # Сериализатор для смены пароля пользователя
    new_password = serializers.CharField(required=True)
    old_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['old_password', 'new_password']


'''EmployeeWithUserUP'''
class EmployeeWithUserUPSerializer(serializers.ModelSerializer):
    # Сериализатор для сотрудника с расширенным полем юзера, password + username
    user = UserRegistrationSerializer(write_only=True)

    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeListSerializer(serializers.ModelSerializer):
    # Сериализатор для сотрудника с расширенным полем юзера, password + username
    user = UserRegistrationSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'


'''WorkMaterial'''
class WorkMaterialSerializer(ModelSerializer):
    # Сериализатор модели WorkMaterial
    class Meta:
        model = WorkMaterial
        fields = '__all__'


class WorkMaterialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkMaterial
        fields = ['id', 'name', 'price', 'count', 'status']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.price = validated_data.get('price', instance.price)
        instance.count = validated_data.get('count', instance.count)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance



'''WorkMaterialGroupWithWorkMaterial'''
class WorkMaterialGroupWithWorkMaterialSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп услуг с расширенным полем workTask
    materials = WorkMaterialSerializer(read_only=True, many=True)

    class Meta:
        model = WorkMaterialGroup
        fields = '__all__'


'''WorkTask'''
class WorkTaskSerializer(ModelSerializer):
    # Сериализатор модели WorkTask
    class Meta:
        model = WorkTask
        fields = '__all__'


class WorkTaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkTask
        fields = ['id', 'name', 'price', 'time', 'status']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.price = validated_data.get('price', instance.price)
        instance.time = validated_data.get('time', instance.time)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance


'''WorkTaskGroupWithWorkTask'''
class WorkTaskGroupWithWorkTaskSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп услуг с расширенным полем workTask
    tasks = WorkTaskSerializer(read_only=True, many=True)

    class Meta:
        model = WorkTaskGroup
        fields = '__all__'


'''WorkTaskGroupWithoutWorkTask'''

class WorkTaskGroupWithoutWorkTaskSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп услуг
    class Meta:
        model = WorkTaskGroup
        fields = ['id', 'name']


'''WorkObject'''
class WorkObjectSerializer(ModelSerializer):
    # Сериализатор модели WorkObject
    class Meta:
        model = WorkObject
        fields = '__all__'


class WorkObjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkObject
        fields = ['id', 'name', 'code', 'contractNumber', 'address']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.code = validated_data.get('code', instance.code)
        instance.contractNumber = validated_data.get('contractNumber', instance.contractNumber)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance


'''WorkObjectsGroup'''
class WorkObjectsGroupSerializer(ModelSerializer):
    # Сериализатор модели WorkObjectsGroup
    class Meta:
        model = WorkObjectsGroup
        fields = ['id', 'name']


class WorkObjectsGroupWithoutworkObjectsSerializer(ModelSerializer):
    # Сериализатор модели WorkObjectsGroup не расширенный
    class Meta:
        model = WorkObjectsGroup
        fields = '__all__'


'''WorkMaterialGroup'''
class WorkMaterialGroupSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп материалов
    class Meta:
        model = WorkMaterialGroup
        fields = ['id', 'name']


'''LegalEntity'''
class LegalEntitySerializer(ModelSerializer):
    # Сериализатор модели LegalEntity
    class Meta:
        model = LegalEntity
        fields = ['id', 'name', 'head', 'legalAddress', 'actualAddress', 'phone',
                  'mail', 'INN', 'settlementAccount', 'correspondentAccount',
                  'bank', 'bik', 'sawatzky', 'status', 'workObject', 'workObjectsGroup']

class LegalEntityReportsSerializer(ModelSerializer):
    # Сериализатор модели LegalEntity для вывода списка отчетов
    class Meta:
        model = LegalEntity
        fields = ['name']

class LegalEntityReqReportsSerializer(ModelSerializer):
    # Сериализатор модели LegalEntity для детейла отчетов
    class Meta:
        model = LegalEntity
        fields = ['mail', 'INN', 'settlementAccount', 'correspondentAccount',
                  'bank', 'bik']

class ClientLESerializer(ModelSerializer):
    # Сериализатор модели LegalEntity
    class Meta:
        model = LegalEntity
        fields = ['id', 'workTaskGroups', 'workMaterialGroups', 'workObject',
                  'workObjectsGroup', 'prepayment', 'sawatzky', 'status']


class LegalEntityOrClientLESerializer(ModelSerializer):

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
        if 'context' in kwargs and 'request' in kwargs['context']:
            sawatzky_value = kwargs['context']['request'].data.get('sawatzky')

            if sawatzky_value:
                true_required_fields = [
                    'name', 'head', 'legalAddress', 'actualAddress', 'phone', 'mail', 'INN',
                    'settlementAccount', 'correspondentAccount', 'bank', 'bik', 'workObjectsGroup',
                    'workObject'
                ]
                for field_name in true_required_fields:
                    self.fields[field_name].required = True

            if sawatzky_value is not None and not sawatzky_value:
                non_required_fields = [
                    'name', 'head', 'legalAddress', 'actualAddress', 'phone', 'mail', 'INN',
                    'settlementAccount', 'correspondentAccount', 'bank', 'bik',
                ]
                for field_name in non_required_fields:
                    self.fields[field_name].required = False

            if sawatzky_value is not None and not sawatzky_value:
                required_fields = [
                    'workObjectsGroup', 'workObject', 'workTaskGroups',
                    'workMaterialGroups', 'sawatzky'
                ]
                for field_name in required_fields:
                    self.fields[field_name].required = True
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['workObject'] = instance.workObject.id if instance.workObject else None
        representation['workObjectsGroup'] = instance.workObjectsGroup.id if instance.workObjectsGroup else None

        if instance.sawatzky:
            return LegalEntitySerializer(instance, context=self.context).data
        else:
            return ClientLESerializer(instance, context=self.context).data

    class Meta:
        model = LegalEntity
        fields = '__all__'


class LegalEntityDetailSerializer(ModelSerializer):
    # Сериализатор модели LegalEntity для DetailView
    workTaskGroups = WorkTaskGroupWithWorkTaskSerializer(read_only=True, many=True)
    workMaterialGroups = WorkMaterialGroupWithWorkMaterialSerializer(read_only=True, many=True)
    workObject = WorkObjectSerializer(read_only=True, many=False)


    class Meta:
        model = LegalEntity
        fields = '__all__'


class LegalEntityListSerializer(ModelSerializer):
    # Сериализатор модели LegalEntity для DetailView
    workTaskGroups = WorkTaskGroupWithoutWorkTaskSerializer(read_only=True, many=True)
    workMaterialGroups = WorkMaterialGroupSerializer(read_only=True, many=True)
    workObjectsGroup = WorkObjectsGroupSerializer(read_only=True, many=False)
    workObject = WorkObjectSerializer(read_only=True, many=False)

    class Meta:
        model = LegalEntity
        fields = '__all__'


class EmployeeDetailSerializer(serializers.ModelSerializer):
    # Сериализатор для сотрудника с расширенным полем юзера, password + username
    user = UserRegistrationSerializer(write_only=True)
    legalEntity = LegalEntitySerializer(read_only=True, many=False)
    class Meta:
        model = Employee
        fields = '__all__'


'''ApplicationWorkTask'''
class ApplicationWorkTaskSerializer(ModelSerializer):
     # Сериализатор промежуточной таблицы с actualTime
    workTask = WorkTaskSerializer(read_only=True, many=False)

    class Meta:
        model = ApplicationWorkTask
        fields = ['actualTime', 'workTask']


'''ApplicationWorkMaterial'''
class ApplicationWorkMaterialSerializer(ModelSerializer):
    # Сериализатор промежуточной таблицы с actualCount
    workMaterial = WorkMaterialSerializer(read_only=True, many=False)

    class Meta:
        model = ApplicationWorkMaterial
        fields = ['actualCount', 'workMaterial']


class SawatzkyEmployeeSerializer(ModelSerializer):
    # Сериализатор для создания пользователя Sawatzky
    user = UserRegistrationSerializer(read_only=True, many=False)

    class Meta:
        model = SawatzkyEmployee
        fields = '__all__'
        

'''ApplicationPerformer'''
class ApplicationPerformerSerializer(ModelSerializer):
    # Сериализатор промежуточной таблицы ApplicationPerformer для добавления исполнителя к заявке
    performer = SawatzkyEmployeeSerializer(read_only=True, many=False)

    class Meta:
        model = ApplicationPerformer
        fields = ['performer', 'priority', 'status', 'dateSent', 'dateAccepted', 'dateDeclined']

    def save(self, *args, **kwargs):
        if self.validated_data.get('status') == 'accepted' and not self.instance.dateAccepted:
            self.instance.dateAccepted = timezone.now()
        elif self.validated_data.get('status') == 'declined' and not self.instance.dateDeclined:
            self.instance.dateDeclined = timezone.now()

        super().save(*args, **kwargs)

'''Act'''
class ActSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'name', 'createdAt', 'file']


'''Document'''
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'name', 'createdAt', 'file']


'''Documents'''
class DocumentsSerializer(ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


'''EmployeeWithUser'''
class EmployeeWithUserSerializer(serializers.ModelSerializer):
    # Сериализатор для сотрудника с расширенным полем юзера
    user = UserSerializerWithoutEmployee(read_only=True, many=False)
    legalEntity = LegalEntityDetailSerializer(read_only=True, many=False)

    class Meta:
        model = Employee
        fields = '__all__'


'''EmployeeWithPowerOfAttorney'''
class EmployeeWithPowerOfAttorney(serializers.ModelSerializer):
    # Сериализатор для обновления модели Employee
    user = UserFIOandPhonenumberSerializer()

    class Meta:
        model = Employee
        fields = ['powerOfAttorney', 'legalEntity', 'role', 'group', 'status', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            user_serializer = UserFIOandPhonenumberSerializer(user_instance, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        return super().update(instance, validated_data)


'''Log'''
class LogSerializer(serializers.ModelSerializer):
    changer = serializers.CharField(source='changer.fio', read_only=True)
    role = serializers.SerializerMethodField()
    class Meta:
        model = Log
        fields = '__all__'

    def get_role(self, obj):
        if hasattr(obj.changer, 'employee'):
            employee = obj.changer.employee
            return employee.role
        elif hasattr(obj.changer, 'sawatzky_employee'):
            sawatzky_employee = obj.changer.sawatzky_employee
            return sawatzky_employee.role
        else:
            return None


'''CommentsList'''
class CommentsListSerializer(ModelSerializer):
    # Сериализатор для вывода списка комментариев
    creator = serializers.CharField(source='creator.fio', read_only=True)
    class Meta:
        model = Comments
        fields = ['id', 'creator', 'created_at', 'description']


'''CommentsList'''
class CommentsListSerializer(ModelSerializer):
    # Сериализатор для вывода списка комментариев
    creator = serializers.CharField(source='creator.fio', read_only=True)
    class Meta:
        model = Comments
        fields = ['id', 'creator', 'created_at', 'description']


'''Extended Application'''
class ApplicationWithCreatorSerializer(ModelSerializer):
    # Сериализаатор для вывода списка заявок расширенный полями
    creator = EmployeeWithUserSerializer(read_only=True, many=False)
    workTasks = ApplicationWorkTaskSerializer(source='applicationworktask_set', read_only=True, many=True)
    workMaterials = ApplicationWorkMaterialSerializer(source='applicationworkmaterial_set', read_only=True, many=True)
    performers = ApplicationPerformerSerializer(source='applicationperformer_set', read_only=True, many=True)
    documents = DocumentsSerializer(many=True)

    comments = CommentsListSerializer(read_only=True, many=True)
    sawatzkyComments = CommentsListSerializer(read_only=True, many=True)
    logs = LogSerializer(many=True, read_only=True)

    acts = serializers.SerializerMethodField()
    paymentSlips = serializers.SerializerMethodField()
    confirmations = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context['request'].user
        if not hasattr(user, 'sawatzky_employee'):
            self.fields.pop('sawatzkyComments')

    def get_acts(self, obj):
        acts_queryset = obj.documents.filter(docType='act').order_by('-createdAt')
        acts_serializer = ActSerializer(acts_queryset, many=True)
        return acts_serializer.data

    def get_paymentSlips(self, obj):
        payment_slips_queryset = obj.documents.filter(docType='paymentSlip').order_by('-createdAt')
        payment_slips_serializer = DocumentSerializer(payment_slips_queryset, many=True)
        return payment_slips_serializer.data

    def get_other(self, obj):
        other_queryset = obj.documents.filter(docType='other').order_by('-createdAt')
        other_serializer = DocumentSerializer(other_queryset, many=True)
        return other_serializer.data

    def get_confirmations(self, obj):
        other_queryset = obj.documents.filter(docType='confirmation').order_by('-createdAt')
        other_serializer = DocumentSerializer(other_queryset, many=True)
        return other_serializer.data

    def to_representation(self, instance):
        sorted_logs = instance.logs.order_by('-changeDate')
        sorted_logs_data = LogSerializer(sorted_logs, many=True).data

        sorted_documents = instance.documents.order_by('-createdAt')
        sorted_documents_data = DocumentsSerializer(sorted_documents, many=True).data

        representation = super().to_representation(instance)
        representation['logs'] = sorted_logs_data
        representation['documents'] = sorted_documents_data

        return representation


'''Application'''
class ApplicationSerializer(ModelSerializer):
    # Сериализаатор для создания/удаления/обновления заявки
    workTasks = ApplicationWorkTaskSerializer(read_only=True, many=True)
    workMaterials = ApplicationWorkMaterialSerializer(read_only=True, many=True)

    class Meta:
        model = Application
        many=False
        fields = '__all__'


class ApplicationDispatcherSerializer(ModelSerializer):
    """Сериализатор для создания/удаления/обновления заявки диспетчером"""
    workTasks = ApplicationWorkTaskSerializer(read_only=True, many=True)
    workMaterials = ApplicationWorkMaterialSerializer(read_only=True, many=True)

    class Meta:
        model = Application
        many = False
        fields = '__all__'


class ApplicationListSerializer(serializers.ModelSerializer):
    workObject = serializers.SerializerMethodField()
    class Meta:
        model = Application
        fields = ['id', 'title', 'workObject', 'startWorkDate', 'endWorkDate', 'totalSum']

    def get_workObject(self, obj):
        if obj.creator and obj.creator.legalEntity.workObject:
            return WorkObjectSerializer(obj.creator.legalEntity.workObject).data
        return None


'''WorkObjectsGroupWithWorkObject'''
class WorkObjectsGroupWithWorkObjectSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп рабочих объектов с расширенным полем workObjects
    workObjects = WorkObjectSerializer(read_only=True, many=True)

    class Meta:
        model = WorkObjectsGroup
        fields = '__all__'


'''WorkObjectsGroupUpdate'''
class WorkObjectsGroupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkObjectsGroup
        fields = ['name', 'workObjects']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.workObjects.set(validated_data.get('workObjects', instance.workObjects.all()))
        instance.save()
        return instance


'''WorkTaskGroupUpdate'''
class WorkTaskGroupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkTaskGroup
        fields = ['name', 'tasks']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.tasks.set(validated_data.get('tasks', instance.tasks.all()))
        instance.save()
        return instance


'''WorkMaterialGroupUpdate'''
class WorkMaterialGroupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkMaterialGroup
        fields = ['name', 'materials']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.materials.set(validated_data.get('materials', instance.materials.all()))
        instance.save()
        return instance


'''LegalEntityUpdate'''
class LegalEntityUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalEntity
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.head = validated_data.get('head', instance.head)
        instance.legalAddress = validated_data.get('legalAddress', instance.legalAddress)
        instance.actualAddress = validated_data.get('actualAddress', instance.actualAddress)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.mail = validated_data.get('mail', instance.mail)
        instance.INN = validated_data.get('INN', instance.INN)
        instance.settlementAccount = validated_data.get('settlementAccount', instance.settlementAccount)
        instance.correspondentAccount = validated_data.get('correspondentAccount', instance.correspondentAccount)
        instance.bank = validated_data.get('bank', instance.bank)
        instance.bik = validated_data.get('bik', instance.bik)

        if 'sawatzky' in validated_data:
            instance.sawatzky = validated_data['sawatzky']

        instance.status = validated_data.get('status', instance.status)
        instance.prepayment = validated_data.get('prepayment', instance.prepayment)
        instance.workObjectsGroup = validated_data.get('workObjectsGroup', instance.workObjectsGroup)
        instance.workObject = validated_data.get('workObject', instance.workObject)

        if instance.sawatzky:
            instance.workTaskGroups.clear()
            instance.workMaterialGroups.clear()
        else:
            instance.workTaskGroups.set(validated_data.get('workTaskGroups', instance.workTaskGroups.all()))
            instance.workMaterialGroups.set(validated_data.get('workMaterialGroups', instance.workMaterialGroups.all()))

        instance.save()
        return instance


'''WorkTaskGroup'''
class WorkTaskGroupSerializer(ModelSerializer):
    # Сериализатор для вывода списка групп услуг
    class Meta:
        model = WorkTaskGroup
        fields = '__all__'


'''UpdateWorkMaterial'''
class UpdateWorkMaterialSerializer(ModelSerializer):
    class Meta:
        model = ApplicationWorkMaterial
        fields = ['actualCount', 'workMaterial']

    def update(self, instance, validated_data):
        instance.actualCount = validated_data.get('actualCount', instance.actualCount)
        instance.workMaterial = validated_data.get('workMaterial', instance.workMaterial)
        instance.save()
        return instance


'''UpdateWorkTask'''
class UpdateWorkTaskSerializer(ModelSerializer):
    class Meta:
        model = ApplicationWorkTask
        fields = ['actualTime', 'workTask']

    def update(self, instance, validated_data):
        instance.actualTime = validated_data.get('actualTime', instance.actualTime)
        instance.workTask = validated_data.get('workTask', instance.workTask)
        instance.save()
        return instance


'''UpdateEmployee'''
class UpdatePerformerSerializer(ModelSerializer):
    class Meta:
        model = ApplicationPerformer
        fields = ['performer', 'priority', 'status']

    def update(self, instance, validated_data):
        print("Update method is called!")
        instance.performer = validated_data.get('performer', instance.performer)
        instance.priority = validated_data.get('priority', instance.performer)
        instance.save()
        return instance


'''ApplicationWithWorkTasksWorkMaterialsUpdate'''
class ApplicationWithWorkTasksWorkMaterialsUpdateSerializer(ModelSerializer):
    # Сериализатор для обновления заявок с расширенными полями workTasks, workMaterials
    workTasks = UpdateWorkTaskSerializer(source='applicationworktask_set', many=True)
    workMaterials = UpdateWorkMaterialSerializer(source='applicationworkmaterial_set', many=True)
    performers = UpdatePerformerSerializer(source='applicationperformer_set', many=True)

    class Meta:
        model = Application
        fields = ['workTasks', 'workMaterials', 'step', 'status', 'performers',
                  'title', 'subject', 'description', 'creator', 'startWorkDate', 'endWorkDate']

    def update(self, instance, validated_data):

        logs_created = []
        # Обработка обновления Employee
        performers_data = validated_data.pop('applicationperformer_set', None)
        if performers_data is not None:
            current_performers = ApplicationPerformer.objects.filter(application=instance)
            for current_performer in current_performers:
                if not any(item['performer'] == current_performer.performer for item in performers_data):
                    current_performer.delete()
            for performer_data in performers_data:
                performer_instance, created = ApplicationPerformer.objects.get_or_create(
                    application=instance,
                    performer=performer_data['performer']
                )
                performer_instance.priority = performer_data.get('priority', performer_instance.priority)
                performer_instance.status = performer_data.get('status', performer_instance.status)

                if performer_instance.status == 'accepted' and not performer_instance.dateAccepted:
                    performer_instance.dateAccepted = timezone.now()
                elif performer_instance.status == 'declined' and not performer_instance.dateDeclined:
                    performer_instance.dateDeclined = timezone.now()
                performer_instance.save()
                if len(performers_data) > 0:
                    changeText = "Добавлены исполнители"
                    Log.objects.create(application=instance, changer=self.context['request'].user,
                                       whatChange=changeText, changeDate=timezone.now())

        # Обработка обновления workTasks
        work_task_data = validated_data.get('applicationworktask_set')
        if work_task_data is not None:
            current_work_tasks = ApplicationWorkTask.objects.filter(application=instance)
            for current_work_task in current_work_tasks:
                if not any(item['workTask'] == current_work_task.workTask for item in work_task_data):
                    current_work_task.delete()
            for item in work_task_data:
                work_task_instance, created = ApplicationWorkTask.objects.get_or_create(
                    application=instance, workTask=item['workTask']
                )
                work_task_instance.actualTime = item['actualTime']
                work_task_instance.save()

            if len(work_task_data) > 0:
                changeText = "Добавлены работы"
                Log.objects.create(application=instance, changer=self.context['request'].user,
                                   whatChange=changeText, changeDate=timezone.now())
        else:
            pass

        # Обработка обновления workMaterials
        work_material_data = validated_data.get('applicationworkmaterial_set')
        if work_material_data is not None:
            current_work_materials = ApplicationWorkMaterial.objects.filter(application=instance)
            for current_work_material in current_work_materials:
                if not any(item['workMaterial'] == current_work_material.workMaterial for item in work_material_data):
                    current_work_material.delete()
            for item in work_material_data:
                work_material_instance, created = ApplicationWorkMaterial.objects.get_or_create(
                    application=instance, workMaterial=item['workMaterial']
                )
                work_material_instance.actualCount = item['actualCount']
                work_material_instance.save()

            if len(work_material_data) > 0:
                changeText = "Добавлены рабочие материалы"
                Log.objects.create(application=instance, changer=self.context['request'].user,
                                   whatChange=changeText, changeDate=timezone.now())
        else:
            pass

        total_sum_work_tasks = instance.applicationworktask_set.aggregate(total=Sum('actualTime'))['total'] or 0
        total_sum_work_task_price = instance.applicationworktask_set.aggregate(total_price=Sum('workTask__price'))[
                                        'total_price'] or 0
        total_sum_work = (total_sum_work_tasks/60) * total_sum_work_task_price
        # print(total_sum_work_tasks)
        # print(total_sum_work_task_price)

        total_sum_work_materials = instance.applicationworkmaterial_set.aggregate(total=Sum('actualCount'))[
                                       'total'] or 0
        total_sum_work_material_price = instance.applicationworkmaterial_set.aggregate(total_price=Sum('workMaterial__price'))['total_price'] or 0
        total_sum_materials = total_sum_work_materials * total_sum_work_material_price
        # print(total_sum_work_materials)
        # print(total_sum_work_material_price)

        total_sum = round(total_sum_work) + round(total_sum_materials)
        percent = total_sum * 0.2
        total_sum_percent = total_sum + percent

        instance.totalSum = total_sum
        instance.percent = percent
        instance.totalSumWithPercent = total_sum_percent
        instance.save()

        legal_entity = instance.creator.legalEntity
        total_invoiced_sum = Application.objects.filter(creator__legalEntity=legal_entity).aggregate(
            total_invoiced_sum=Sum('totalSum')
        )['total_invoiced_sum'] or 0
        legal_entity.totalInvoicedSum = total_invoiced_sum
        legal_entity.save()

        prepayment = instance.creator.legalEntity.prepayment

        step = validated_data.get('step')
        print(f"Debug: Step received: {step}")  # Добавим отладочное сообщение для отслеживания значения step
        if step is not None:
            instance.step = step
            if prepayment:
                if(step == 1):
                    instance.status = 'processed'
                if(step == 2):
                    instance.status = 'coordination'
                if step == 3:
                    instance.status = 'paymentCoordination'
                if(step == 4):
                    instance.status = 'inWork'
                if(step == 5):
                    instance.status = 'coordination'
                if(step == 6):
                    instance.status = 'waitingFinish'
                if(step == 7):
                    instance.status = 'finished'
                    instance.actualWorkDate = timezone.now().date()
                if(step == 8):
                    instance.status = 'rejected'

                step_comments = {
                    1: "Новая заявка",
                    2: "Отправлено  на согласование заказчику",
                    3: "Переведено в ожидание оплаты",
                    4: "Подтверждена оплата, заявка передана в работу",
                    5: "Заявка на согласовании у заказчика после выполнения работ",
                    6: "Подтверждение выполнения",
                    7: "Заявка завершена",
                    8: "Заявка отклонена"
                }

            if not prepayment:
                if (step == 1):
                    instance.status = 'processed'
                if (step == 2):
                    instance.status = 'coordination'
                if step == 3:
                    instance.status = 'inWork'
                if (step == 4):
                    instance.status = 'coordination'
                if (step == 5):
                    instance.status = 'waitingFinish'
                if (step == 6):
                    instance.status = 'finished'
                    instance.actualWorkDate = timezone.now().date()
                if (step == 8):
                    instance.status = 'rejected'
                
                step_comments = {
                    1: "Новая заявка",
                    2: "Отправлено  на согласование заказчику",
                    3: "Заявка передана в работу",
                    4: "Заявка на согласовании у заказчика после выполнения работ",
                    5: "Подтверждение выполнения",
                    6: "Заявка завершена",
                    8: "Заявка отклонена"

                }

            logs_created.append(Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=step_comments.get(step, f"Неизвестный шаг: {step}"), changeDate=timezone.now()))


            status = validated_data.get('status')
            if status is not None and instance.status != status:
                instance.status = status
                changeText = f"Статус изменен на {status}"
                Log.objects.create(application=instance, changer=self.context['request'].user,
                                whatChange=changeText, changeDate=timezone.now())

            print(f"Debug: Status received: {status}")  # Добавим отладочное сообщение для отслеживания значения status
            if status is not None and instance.status != status:
                instance.status = status
                changeText = f"Status changed to {status}"
                Log.objects.create(application=instance, changer=self.context['request'].user,
                                whatChange=changeText, changeDate=timezone.now())
                
        else:
            pass
        instance.save()

        user = self.context['request'].user
        if hasattr(user, 'sawatzky_employee'):
            sawatzky_employee = user.sawatzky_employee
            if performers_data is not None:
                for performer_data in performers_data:
                    performer_instance = performer_data['performer']
                    performer_fio = performer_instance.user.fio
                    old_status = performer_instance.status
                    new_status = performer_data.get('status')

                    change_text = None
                    if sawatzky_employee.role == 'performer':
                        if old_status != new_status:
                            if new_status == 'accepted':
                                change_text = f"Принял заявку в работу."
                            elif new_status == 'notAccepted':
                                change_text = f"Не принял заявку в работу."
                            elif new_status == 'declined':
                                change_text = f"Отказался от выполнения заявки."
                            elif new_status == 'completed':
                                change_text = f"Завершил выполнение заявки."

                            logs_created.append(
                                Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=change_text, changeDate=timezone.now()))

                    if change_text is None:
                        existing_log = Log.objects.filter(application=instance, changer=self.context['request'].user,
                                                          whatChange=f"Добавлен исполнитель: {performer_fio}")
                        if not existing_log.exists():
                            logs_created.append(
                                Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=f"Добавлен исполнитель: {performer_fio}",
                                                   changeDate=timezone.now()))
        else:
            print("Ошибка: performers_data равно None")

        if work_task_data:
            changeText = "Добавлены работы"
            logs_created.append(Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=changeText, changeDate=timezone.now()))
        if work_material_data:
            changeText = "Добавлены рабочие материалы"
            logs_created.append(Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=changeText, changeDate=timezone.now()))

        # обновление полей создания заявки
        instance.title = validated_data.get('title', instance.title)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.description = validated_data.get('description', instance.description)
        instance.startWorkDate = validated_data.get('startWorkDate', instance.startWorkDate)
        instance.endWorkDate = validated_data.get('endWorkDate', instance.endWorkDate)
        instance.save()

        fields_changed = any(field in validated_data for field in
                             ['title', 'subject', 'description', 'startWorkDate', 'endWorkDate'])

        if fields_changed:
            changeText = "Заявка редактирована"
            logs_created.append(Log.objects.create(application=instance, changer=self.context['request'].user,
                                                   whatChange=changeText, changeDate=timezone.now()))

        instance.logs.add(*logs_created)
        return instance


'''SawatzkyEmployee'''
class SawatzkyEmployeeWithUserSerializer(serializers.ModelSerializer):
    # Сериализатор для сотрудника Sawatzky с расширенным полем юзера
    user = UserSerializerWithoutEmployee(read_only=True, many=False)

    class Meta:
        model = SawatzkyEmployee
        fields = '__all__'


class SawatzkyEmployeeWithWorkObjectSerializer(ModelSerializer):
    # Сериализатор для детейла с расширенными полями
    fio = UserFIOSerializer(read_only=True, many=False)

    class Meta:
        model = SawatzkyEmployee
        fields = '__all__'


class SawatzkyEmployeeWithoutworkingObjectsSerializer(ModelSerializer):
    # Сериализатор для вывода списка с расширенными полями
    workObject = WorkObjectSerializer(read_only=True, many=False)
    workObjectGroup = WorkObjectsGroupSerializer(read_only=True, many=False)
    user = UserSerializerWithoutEmployee(read_only=True, many=False)

    class Meta:
        model = SawatzkyEmployee
        fields = '__all__'


class SawatzkyEmployeeUpdateSerializer(serializers.ModelSerializer):
    # Сериализатор для обновления модели SawatzkyEmployee
    user = UserFIOandPhonenumberSerializer()

    class Meta:
        model = SawatzkyEmployee
        fields = ['position', 'workObjectGroup', 'workObject', 'workingObjects', 'status', 'role', 'group', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            user_serializer = UserFIOandPhonenumberSerializer(user_instance, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        return super().update(instance, validated_data)


'''Report'''
class FIOinReportsSerializer(ModelSerializer):
    # Дополнительный ериализатор для ФИО создателя отчетов
    creator_fio = serializers.CharField(source='user.fio', read_only=True)

    class Meta:
        model = SawatzkyEmployee
        fields = ['creator_fio']


class ApplicationStatusSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']


class ReportListSerializer(ModelSerializer):
    # Сериализатор для вывода списка отчетов
    creator = FIOinReportsSerializer(read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'periodStart', 'periodEnd', 'creator']


class ReportCreateSerializer(ModelSerializer):
    # Сериализатор для создания отчета
    application_status = serializers.ChoiceField(choices=Application.STATUSES, required=False)
    class Meta:
        model = Report
        fields = ['periodStart', 'periodEnd', 'workObjectsGroup', 'workObject', 'legalEntity', 'application_status']

    def create(self, validated_data):
        user = self.context['request'].user

        if hasattr(user, 'sawatzky_employee'):
            sawatzky_employee = user.sawatzky_employee
            validated_data['creator'] = sawatzky_employee
            super().create(validated_data).application_status = validated_data.pop('application_status', None)
            return super().create(validated_data)
        else:
            raise serializers.ValidationError("Только сотрудники Sawatzky могут создавать отчеты")



class FoundedApplicationDetailSerializer(ModelSerializer):
    #сериализатор связанных заявок
    creator = EmployeeDetailSerializer()

    class Meta:
        model = Application
        fields = '__all__'


class ReportDetailSerializer(ModelSerializer):
    # Сериализатор для детейла отчета
    legalEntity = LegalEntityReportsSerializer(read_only=True)
    legalEntityInn = serializers.CharField(source='legalEntity.INN', read_only=True)
    settlementAccount = serializers.CharField(source='legalEntity.settlementAccount', read_only=True)
    correspondentAccount = serializers.CharField(source='legalEntity.correspondentAccount', read_only=True)
    bank = serializers.CharField(source='legalEntity.bank', read_only=True)
    legalEntityBik = serializers.CharField(source='legalEntity.bik', read_only=True)
    foundedApllications = FoundedApplicationDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'foundedApllications', 'priority', 'description', 'status', 'createdAt',
                  'legalEntity', 'legalEntityBik', 'legalEntityInn', 'settlementAccount', 'correspondentAccount',
                  'bank', 'legalEntityBik']


'''Comments'''
class CommentsCreateSerializer(ModelSerializer):
    # Сериализатор для создания комментария
    class Meta:
        model = Comments
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['creator'] = user

        return super().create(validated_data)


'''GeneralJournal'''
class GeneralJournalCreateSerializer(ModelSerializer):
    # Сериализатор для создания генерального журнала
    class Meta:
        model = GeneralJournal
        fields = ['id', 'paymentDocumentNumber', 'legalEntity', 'receiptDate', 'totalAmount']


class LegalEntityGeneralJournalSerializer(ModelSerializer):
    # Сериализатор модели LegalEntity для вывода генеральных журналов
    class Meta:
        model = LegalEntity
        fields = '__all__'


class ApplicationJournalSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(source='application.id')
    title = serializers.CharField(source='application.title')
    totalSum = serializers.DecimalField(max_digits=15, decimal_places=2, source='application.totalSum')
    totalPayment = serializers.DecimalField(max_digits=15, decimal_places=2)
    totalDebt = serializers.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        model = ApplicationJournal
        fields = ['application_id', 'title', 'totalSum', 'totalPayment', 'totalDebt']


class GeneralJournalListSerializer(ModelSerializer):
    """Сериализатор для вывода списка генерального журнала"""
    # legalEntity = serializers.CharField(source='legalEntity.name', read_only=True)
    legalEntity = LegalEntityGeneralJournalSerializer()
    application = serializers.SerializerMethodField()
    class Meta:
        model = GeneralJournal
        fields = ['id', 'paymentDocumentNumber', 'legalEntity', 'receiptDate', 'totalAmount', 'amountByInvoices', 'status', 'application']

    def get_application(self, obj):
        application_journals = ApplicationJournal.objects.filter(general_journal=obj)
        return ApplicationJournalSerializer(application_journals, many=True).data


class ApplicationGeneralJournalSerializer(serializers.ModelSerializer):
    legalEntity = serializers.CharField(source='creator.legalEntity.name')
    class Meta:
        model = Application
        fields = ['id', 'title', 'legalEntity', 'createdAt', 'totalSum']


class GeneralJournalDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детейла записи журнала"""
    applications = serializers.SerializerMethodField()
    totalDebt = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    totalPayment = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)

    class Meta:
        model = GeneralJournal
        fields = ['paymentDocumentNumber', 'legalEntity', 'receiptDate', 'totalAmount', 'amountByInvoices', 'applications', 'totalDebt', 'totalPayment']

    def get_applications(self, obj):
        applications = Application.objects.filter(generaljournal=obj)
        return ApplicationSerializer(applications, many=True).data


class GeneralJournalUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления записи журнала"""

    class Meta:
        model = GeneralJournal
        fields = '__all__'

    def update(self, instance, validated_data):
        # Обновляем экземпляр через вызов super метода
        instance = super().update(instance, validated_data)

        # Производим вычисления (сумма по счетам = суммарной стоимости долгов по всем заявкам контрагента)
        application = instance.application
        if application:
            totalSum = float(application.totalSum or 0)
            totalPayment = float(instance.totalPayment or 0)
            totalDebt = totalSum - totalPayment
            amountByInvoices = totalDebt

            instance.totalDebt = totalDebt
            instance.amountByInvoices = amountByInvoices

        # Сохраняем изменения
        instance.save()
        return instance


class ApplicationUpdatejournalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    class Meta:
        model = Application
        fields = ['id', 'totalPayment']


class GeneralJournalUpdateAPLSerializer(serializers.ModelSerializer):
    application = ApplicationUpdatejournalSerializer(many=True, read_only=False)

    class Meta:
        model = GeneralJournal
        fields = [
            'application'
        ]

    def update(self, instance, validated_data):
        applications_data = validated_data.pop('application', [])

        for app_data in applications_data:
            application_id = app_data.get('id')
            additional_payment = Decimal(app_data.get('totalPayment'))

            try:
                application = Application.objects.get(id=application_id)

                if application.creator and application.creator.legalEntity != instance.legalEntity:
                    raise serializers.ValidationError(
                        f"Заявка с id {application_id} не связана с юридическим лицом из общего журнала"
                    )

                with transaction.atomic():
                    # Обновление записи в промежуточной таблице
                    app_journal, created = ApplicationJournal.objects.get_or_create(
                        application=application,
                        general_journal=instance
                    )

                    total_sum = Decimal(application.totalSum)
                    current_payment = Decimal(app_journal.totalPayment)
                    current_debt = total_sum - current_payment

                    if additional_payment > current_debt:
                        raise serializers.ValidationError(
                            f"Сумма платежа {additional_payment} превышает текущий долг {current_debt} для заявки {application_id}"
                        )

                    # Обновление записи в промежуточной таблице
                    app_journal.totalPayment = current_payment + additional_payment
                    app_journal.save()

                    # Вычисление totalDebt для данной заявки
                    total_payment_across_journals = ApplicationJournal.objects.filter(
                        application=application
                    ).aggregate(total_payment=Sum('totalPayment'))['total_payment'] or Decimal('0.0')

                    # Вычисление totalDebt для данной заявки
                    total_debt = total_sum - total_payment_across_journals

                    # Проверка, чтобы totalPayment не превышал totalDebt по всем журналам
                    if total_payment_across_journals > total_sum:
                        raise serializers.ValidationError(
                            f"Сумма платежа {additional_payment} превышает суммарный долг {total_debt} для заявки {application_id}"
                        )

                    # Обновление totalDebt для данной заявки во всех журналах
                    ApplicationJournal.objects.filter(application=application).update(
                        totalDebt=total_debt
                    )

            except Application.DoesNotExist:
                raise serializers.ValidationError(f"Заявка с id {application_id} не существует")

        # После обновления всех заявок для текущего журнала, обновляем amountByInvoices
        updated_amount_by_invoices = ApplicationJournal.objects.filter(general_journal=instance).aggregate(
            total_amount=Sum('totalDebt')
        )['total_amount'] or Decimal('0.0')
        instance.amountByInvoices = updated_amount_by_invoices
        instance.save()

        # Обновление totalPayment для текущего instance
        total_payment = ApplicationJournal.objects.filter(general_journal=instance).aggregate(
            total_payment=Sum('totalPayment')
        )['total_payment'] or Decimal('0.0')
        instance.totalPayment = total_payment
        instance.save()

        return instance


class GeneralJournalApplicationsByLegalEntitySerializer(serializers.ModelSerializer):
    legalEntity = serializers.CharField(source='creator.legalEntity.name')
    class Meta:
        model = Application
        fields = ['id', 'title', 'legalEntity', 'createdAt', 'totalSum', 'totalDebt', 'totalPayment']
