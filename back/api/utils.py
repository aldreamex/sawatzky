from django.core.mail import send_mail
from django.template.loader import render_to_string

def send_notification_email(user_email, application_name, document_name):
    subject = 'Добавлен новый документ в заявку'
    message = f'В заявку "{application_name}" добавлен новый документ: "{document_name}".'
    send_mail(subject, message, 'from@example.com', [user_email])