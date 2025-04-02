# Generated by Django 4.2.10 on 2025-03-21 17:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('expenses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContaUnica',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(max_length=255)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tipo', models.CharField(choices=[('recorrente', 'Recorrente'), ('parcelada', 'Parcelada'), ('unica', 'Única')], max_length=20)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('data_vencimento', models.DateField()),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ContaRecorrente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(max_length=255)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tipo', models.CharField(choices=[('recorrente', 'Recorrente'), ('parcelada', 'Parcelada'), ('unica', 'Única')], max_length=20)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('frequencia', models.CharField(choices=[('mes', 'Mensal'), ('ano', 'Anual')], max_length=10)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ContaParcelada',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(max_length=255)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tipo', models.CharField(choices=[('recorrente', 'Recorrente'), ('parcelada', 'Parcelada'), ('unica', 'Única')], max_length=20)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('parcelas', models.IntegerField()),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
