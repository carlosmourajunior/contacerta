from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # For storing Material-UI icon names
    color = models.CharField(max_length=20, blank=True)  # For category color coding
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Expense(models.Model):
    class ExpenseType(models.TextChoices):
        RECURRING = 'RECURRING', 'Recorrente'
        INSTALLMENT = 'INSTALLMENT', 'Parcelada'
        ONETIME = 'ONETIME', 'Única'

    class RecurrencePeriod(models.TextChoices):
        DAILY = 'DAILY', 'Diária'
        MONTHLY = 'MONTHLY', 'Mensal'
        YEARLY = 'YEARLY', 'Anual'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    date = models.DateField()
    expense_type = models.CharField(
        max_length=20,
        choices=ExpenseType.choices,
        default=ExpenseType.ONETIME
    )
    recurrence_period = models.CharField(
        max_length=20,
        choices=RecurrencePeriod.choices,
        null=True,
        blank=True
    )
    next_due_date = models.DateField(null=True, blank=True)
    total_installments = models.PositiveIntegerField(null=True, blank=True)
    current_installment = models.PositiveIntegerField(null=True, blank=True)
    installment_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    paid = models.BooleanField(default=False)  # New field
    paid_date = models.DateField(null=True, blank=True)  # New field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - R${self.amount}"

class Income(models.Model):
    class IncomeType(models.TextChoices):
        RECURRING = 'RECURRING', 'Recorrente'
        INSTALLMENT = 'INSTALLMENT', 'Parcelada'
        ONETIME = 'ONETIME', 'Única'

    class RecurrencePeriod(models.TextChoices):
        DAILY = 'DAILY', 'Diária'
        MONTHLY = 'MONTHLY', 'Mensal'
        YEARLY = 'YEARLY', 'Anual'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    date = models.DateField()
    income_type = models.CharField(
        max_length=20,
        choices=IncomeType.choices,
        default=IncomeType.ONETIME
    )
    recurrence_period = models.CharField(
        max_length=20,
        choices=RecurrencePeriod.choices,
        null=True,
        blank=True
    )
    next_due_date = models.DateField(null=True, blank=True)
    total_installments = models.PositiveIntegerField(null=True, blank=True)
    current_installment = models.PositiveIntegerField(null=True, blank=True)
    installment_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - R${self.amount}"
