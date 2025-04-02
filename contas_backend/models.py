from django.db import models
from django.contrib.auth.models import User

class Conta(models.Model):
    TIPO_CONTA = [
        ('recorrente', 'Recorrente'),
        ('parcelada', 'Parcelada'),
        ('unica', 'Única'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=20, choices=TIPO_CONTA)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class ContaRecorrente(Conta):
    frequencia = models.CharField(max_length=10, choices=[('mes', 'Mensal'), ('ano', 'Anual')])

class ContaParcelada(Conta):
    parcelas = models.IntegerField()

class ContaUnica(Conta):
    data_vencimento = models.DateField()

# Registrar no admin
from django.contrib import admin

@admin.register(ContaRecorrente)
class ContaRecorrenteAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'frequencia', 'data_criacao')

@admin.register(ContaParcelada)
class ContaParceladaAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'parcelas', 'data_criacao')

@admin.register(ContaUnica)
class ContaUnicaAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'data_vencimento', 'data_criacao')