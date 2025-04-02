# Generated by Django 4.2.10 on 2025-03-25 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0005_income'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='paid',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='expense',
            name='paid_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
