from rest_framework import serializers
from .models import ContaRecorrente, ContaParcelada, ContaUnica

class ContaRecorrenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaRecorrente
        fields = ['id', 'usuario', 'descricao', 'valor', 'tipo', 'data_criacao', 'frequencia']

class ContaParceladaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaParcelada
        fields = ['id', 'usuario', 'descricao', 'valor', 'tipo', 'data_criacao', 'parcelas']

class ContaUnicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaUnica
        fields = ['id', 'usuario', 'descricao', 'valor', 'tipo', 'data_criacao', 'data_vencimento']