# Generated by Django 4.1 on 2024-05-23 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0089_report_application_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='legalentity',
            name='totalInvoicedSum',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15, verbose_name='Сумма выставленных счетов'),
        ),
    ]
