# Generated by Django 4.1 on 2024-06-18 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0100_alter_legalentity_correspondentaccount'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='totalPayment',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True, verbose_name='Сумма оплаты'),
        ),
    ]
