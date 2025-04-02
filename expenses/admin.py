from django.contrib import admin
from .models import Category, Expense, Income

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'category', 'date', 'expense_type', 'user')
    list_filter = ('expense_type', 'category', 'date', 'user')
    search_fields = ('description', 'category__name')
    ordering = ('-date',)
    date_hierarchy = 'date'

    def get_queryset(self, request):
        """Optimize query by prefetching related fields"""
        return super().get_queryset(request).select_related('category', 'user')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'category', 'date', 'income_type', 'user')
    list_filter = ('income_type', 'category', 'date', 'user')
    search_fields = ('description', 'category__name')
    ordering = ('-date',)
    date_hierarchy = 'date'

    def get_queryset(self, request):
        """Optimize query by prefetching related fields"""
        return super().get_queryset(request).select_related('category', 'user')
