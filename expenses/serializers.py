from rest_framework import serializers
from .models import Expense, Category, Income

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'color']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    expense_type_display = serializers.CharField(source='get_expense_type_display', read_only=True)
    recurrence_period_display = serializers.CharField(source='get_recurrence_period_display', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'user', 'category', 'category_name', 'amount', 'description', 'date',
            'expense_type', 'expense_type_display', 'recurrence_period', 'recurrence_period_display',
            'next_due_date', 'total_installments', 'current_installment', 'installment_value',
            'created_at', 'updated_at', 'paid', 'paid_date'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        expense_type = data.get('expense_type')
        
        if expense_type == 'RECURRING':
            if not data.get('recurrence_period'):
                raise serializers.ValidationError(
                    {'recurrence_period': 'Este campo é obrigatório para despesas recorrentes.'}
                )
            if not data.get('next_due_date'):
                raise serializers.ValidationError(
                    {'next_due_date': 'Este campo é obrigatório para despesas recorrentes.'}
                )
        
        elif expense_type == 'INSTALLMENT':
            if not data.get('total_installments'):
                raise serializers.ValidationError(
                    {'total_installments': 'Este campo é obrigatório para despesas parceladas.'}
                )
            if not data.get('installment_value'):
                raise serializers.ValidationError(
                    {'installment_value': 'Este campo é obrigatório para despesas parceladas.'}
                )
            data['current_installment'] = data.get('current_installment', 1)
        
        return data

class IncomeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    income_type_display = serializers.CharField(source='get_income_type_display', read_only=True)
    recurrence_period_display = serializers.CharField(source='get_recurrence_period_display', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Income
        fields = [
            'id', 'user', 'category', 'category_name', 'amount', 'description', 'date',
            'income_type', 'income_type_display', 'recurrence_period', 'recurrence_period_display',
            'next_due_date', 'total_installments', 'current_installment', 'installment_value',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        income_type = data.get('income_type')
        
        if income_type == 'RECURRING':
            if not data.get('recurrence_period'):
                raise serializers.ValidationError(
                    {'recurrence_period': 'Este campo é obrigatório para receitas recorrentes.'}
                )
            if not data.get('next_due_date'):
                raise serializers.ValidationError(
                    {'next_due_date': 'Este campo é obrigatório para receitas recorrentes.'}
                )
        
        elif income_type == 'INSTALLMENT':
            if not data.get('total_installments'):
                raise serializers.ValidationError(
                    {'total_installments': 'Este campo é obrigatório para receitas parceladas.'}
                )
            if not data.get('installment_value'):
                raise serializers.ValidationError(
                    {'installment_value': 'Este campo é obrigatório para receitas parceladas.'}
                )
            data['current_installment'] = data.get('current_installment', 1)
        
        return data