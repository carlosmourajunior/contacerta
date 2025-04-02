import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Grid, Paper, Typography, FormControlLabel, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { format } from 'date-fns';

const EXPENSE_TYPES = [
  { value: 'ONETIME', label: 'Única' },
  { value: 'RECURRING', label: 'Recorrente' },
  { value: 'INSTALLMENT', label: 'Parcelada' },
];

const RECURRENCE_PERIODS = [
  { value: 'DAILY', label: 'Diária' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
];

const ExpenseForm = ({ onSubmit, categories = [], initialData = null, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date(),
    expense_type: 'ONETIME',
    recurrence_period: 'MONTHLY',
    next_due_date: null,
    total_installments: '',
    current_installment: '1',
    installment_value: '',
    paid: false,
    paid_date: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date),
        next_due_date: initialData.next_due_date ? new Date(initialData.next_due_date) : null,
        paid: initialData.paid || false,
        paid_date: initialData.paid_date ? new Date(initialData.paid_date) : null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaidChange = (e) => {
    const isPaid = e.target.checked;
    setFormData(prev => ({
      ...prev,
      paid: isPaid,
      paid_date: isPaid ? new Date() : null
    }));
  };

  const renderExpenseTypeFields = () => {
    switch (formData.expense_type) {
      case 'RECURRING':
        return (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Periodicidade"
                name="recurrence_period"
                value={formData.recurrence_period}
                onChange={handleChange}
                required
              >
                {RECURRENCE_PERIODS.map((period) => (
                  <MenuItem key={period.value} value={period.value}>
                    {period.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Próximo Vencimento"
                value={formData.next_due_date}
                onChange={(newDate) => setFormData(prev => ({ ...prev, next_due_date: newDate }))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
          </>
        );
      case 'INSTALLMENT':
        return (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Total de Parcelas"
                name="total_installments"
                type="number"
                value={formData.total_installments}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Parcela Atual"
                name="current_installment"
                type="number"
                value={formData.current_installment}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Valor da Parcela"
                name="installment_value"
                type="number"
                value={formData.installment_value}
                onChange={handleChange}
                required
                inputProps={{ step: "0.01" }}
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };

    // Format dates to YYYY-MM-DD
    submitData.date = format(formData.date, 'yyyy-MM-dd');
    if (formData.next_due_date) {
      submitData.next_due_date = format(formData.next_due_date, 'yyyy-MM-dd');
    }
    if (formData.paid_date) {
      submitData.paid_date = format(formData.paid_date, 'yyyy-MM-dd');
    }
    
    if (formData.expense_type !== 'RECURRING') {
      delete submitData.recurrence_period;
      delete submitData.next_due_date;
    }
    if (formData.expense_type !== 'INSTALLMENT') {
      delete submitData.total_installments;
      delete submitData.current_installment;
      delete submitData.installment_value;
    }
    if (!formData.paid) {
      submitData.paid_date = null;
    }

    onSubmit(submitData);

    if (!isEditing) {
      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date(),
        expense_type: 'ONETIME',
        recurrence_period: 'MONTHLY',
        next_due_date: null,
        total_installments: '',
        current_installment: '1',
        installment_value: '',
        paid: false,
        paid_date: null,
      });
    }
  };

  return (
    <Paper sx={{ p: 1.5, mb: isEditing ? 0 : 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={1.5} sx={{ '& .MuiGrid-item': { pr: 0.5 } }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Valor Total"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              select
              label="Tipo"
              name="expense_type"
              value={formData.expense_type}
              onChange={handleChange}
              required
            >
              {EXPENSE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              select
              label="Categoria"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label="Data"
              value={formData.date}
              onChange={(newDate) => setFormData(prev => ({ ...prev, date: newDate }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          {renderExpenseTypeFields()}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.paid}
                    onChange={handlePaidChange}
                    color="success"
                  />
                }
                label="Despesa Paga"
              />
              {formData.paid && (
                <DatePicker
                  label="Data do Pagamento"
                  value={formData.paid_date}
                  onChange={(newDate) => setFormData(prev => ({ ...prev, paid_date: newDate }))}
                  slotProps={{ textField: { fullWidth: true, required: true, size: "small" } }}
                  sx={{ minWidth: 200 }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: isEditing ? 'flex-end' : 'flex-start' }}>
              {isEditing && (
                <Button
                  onClick={onCancel}
                  variant="outlined"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
              >
                {isEditing ? 'Salvar Alterações' : 'Adicionar Despesa'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpenseForm;