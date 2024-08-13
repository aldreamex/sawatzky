import json
from channels.generic.websocket import AsyncWebsocketConsumer, JsonWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from django.contrib.auth.models import AnonymousUser
from .models import Application
from .serializers import (
    ApplicationWithCreatorSerializer,
    UserSerializer
    )

class ApplicationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope['user']
        if isinstance(user, AnonymousUser):
            await self.close(code=1000)
        else:
            try:
                await self.accept()
                user_data = await  self.get_auth_user(user)
                if 'employee' in user_data:
                    initiator = user_data['employee']
                    await self.add_initiator_to_groups(initiator)

                if 'sawatzkyEmployee' in user_data:
                    employee = user_data['sawatzkyEmployee'] 
                    await self.add_sawatzky_to_groups(employee)
                    try:
                        is_dispatcher, _ = await self.get_sawatzky_employee_role(employee)
                        if is_dispatcher:
                            await self.send_new_applications()
                    except Exception as e:
                        pass

            except Exception as e:
                print(e)
                await self.close(code=3000)

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'create_application':
                application_data = data.get('application_data')
                work_object = application_data.get('work_object')
                dispatchers_group_name = f"sawatzky_dispatcher_{work_object}"
                await self.channel_layer.group_send(
                    dispatchers_group_name,
                    {
                        'type': 'send_application_notification',
                        'application_data': application_data
                    }
                )

            elif action == 'assign_performer':
                performer_ids = data.get('performer_ids', [])
                assignment_data = data.get('assignment_data')
                await self.send_assignment_notification_to_performers(assignment_data, performer_ids)

            elif action == 'change_application_status':
                status_data = data.get('status_data')
                work_object = status_data.get('work_object')
                dispatchers_group_name = f"sawatzky_dispatcher_{work_object}"
                await self.channel_layer.group_send(
                    dispatchers_group_name,
                    {
                        'type': 'send_status_change_notification',
                        'status_data': status_data
                    }
                )

            elif action == 'change_application_status_initiator':
                status_data = data.get('status_data')
                initiator_group_name = f"sawatzky_initiator_{self.scope['user'].id}"
                await self.channel_layer.group_send(
                    initiator_group_name,
                    {
                        'type': 'send_status_change_notification',
                        'status_data': status_data
                    }
                )
        except json.JSONDecodeError:
            pass

    async def send_status_change_notification(self, event):
        status_data = event.get('status_data')
        await self.send(text_data=json.dumps({
            'action': 'changeApplicationStatus',
            'data': status_data
        }))

    async def send_application_notification(self, event):
        application_data = event.get('application_data')
        await self.send(text_data=json.dumps({
            'action': 'newApplication',
            'data': application_data
        }))

    async def send_assignment_notification_to_performers(self, event):
        performer_ids = event.get('performer_ids')
        assignment_data = event.get('assignment_data')

        # print(f"Получено уведомление для исполнителя: {performer_ids}")
        # print(f"Данные: {assignment_data}")

        for performer_id in performer_ids:
            channel_name = f"sawatzky_performer_{performer_id}"
            try:
                # print(f"Отправка уведомления о назначении исполнителю {performer_id} на канале {channel_name}")
                await self.channel_layer.group_send(
                    channel_name,
                    {
                        'type': 'send_assignment_notification',
                        'assignment_data': assignment_data
                    }
                )
            except Exception as e:
                pass
                # print(f"Не удалось отправить уведомление исполнителю {performer_id}: {e}")

    async def send_assignment_notification(self, event):
        assignment_data = event.get('assignment_data')
        await self.send(text_data=json.dumps({
            'action': 'newAssignment',
            'data': assignment_data
        }))


    @sync_to_async
    def get_auth_user(self, user):
        user_serializer = UserSerializer(instance=user)
        return user_serializer.data

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            'action': 'userConnected',
            'data': event["message"]
        }))

    @sync_to_async
    def get_new_applications(self):
        new_applications = Application.objects.filter(status='new')
        application_serializer = ApplicationWithCreatorSerializer(instance=new_applications, many=True)
        return application_serializer.data

    async def send_new_applications(self):
        new_applications = await self.get_new_applications()
        for application in new_applications:
            await self.send(text_data=json.dumps({
                'action': 'newApplication',
                'data': json.dumps(application)
            }))

    async def add_initiator_to_groups(self, initiator):
        is_initiator = await self.get_employee_role(initiator)
        try:
            if is_initiator:
                self.user_group_name = f"sawatzky_initiator_{self.scope['user'].id}"
                await self.channel_layer.group_add(
                    self.user_group_name, self.channel_name
                )
        except Exception as e:
            print(e)

    @sync_to_async
    def get_employee_role(self, initiator):
        is_initiator = initiator['role'] == 'initiator'
        return is_initiator

    async def add_sawatzky_to_groups(self, employee):
        is_dispatcher, is_performer = await self.get_sawatzky_employee_role(employee)
        try:
            if is_dispatcher:
                for work_object in employee['workingObjects']:
                    self.user_group_name = f"sawatzky_dispatcher_{work_object}"
                    await self.channel_layer.group_add(
                        self.user_group_name, self.channel_name
                    )
        except Exception as e:
            print(e)

        try:
            if is_performer:
                for work_object in employee['workingObjects']:
                    self.user_group_name = f"sawatzky_performer_{work_object}"
                    await self.channel_layer.group_add(
                        self.user_group_name, self.channel_name
                    )
                    print(f"Added to performer group {self.user_group_name}")
        except Exception as e:
            print(e)

    @sync_to_async
    def get_sawatzky_employee_role(self, employee):
        is_dispatcher = employee['role'] in ['dispatcher', 'dispatcherPerformer']
        is_performer = employee['role'] in ['performer', 'dispatcherPerformer']
        return is_dispatcher, is_performer

    # async def send_text(self, text_data):
    #     await self.send(text_data)

