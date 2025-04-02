import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

const IncomeForm = ({ onSubmit, categories = [] }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date(),
    category: '',
    income_type: 'ONETIME',
    recurrence_period: 'MONTHLY',
    next_due_date: null,
    total_installments: '',
    installment_value: '',
    current_installment: '1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Converte campos numéricos para número
    if (name === 'total_installments' || name === 'current_installment') {
      const numberValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numberValue) ? '' : numberValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleNextDueDateChange = (date) => {
    setFormData(prev => ({ ...prev, next_due_date: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };

    // Formata as datas para YYYY-MM-DD
    submitData.date = format(formData.date, 'yyyy-MM-dd');
    if (formData.next_due_date) {
      submitData.next_due_date = format(formData.next_due_date, 'yyyy-MM-dd');
    }

    // Remove campos desnecessários baseado no tipo de receita
    if (formData.income_type !== 'RECURRING') {
      delete submitData.recurrence_period;
      delete submitData.next_due_date;
    }
    if (formData.income_type !== 'INSTALLMENT') {
      delete submitData.total_installments;
      delete submitData.installment_value;
      delete submitData.current_installment;
    }

    onSubmit(submitData);
    setFormData({
      description: '',
      amount: '',
      date: new Date(),
      category: '',
      income_type: 'ONETIME',
      recurrence_period: 'MONTHLY',
      next_due_date: null,
      total_installments: '',
      installment_value: '',
      current_installment: '1',
    });
  };

  return (
    <Paper sx={{ p: 1.5, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Nova Receita
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valor"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Categoria"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="income_type"
                value={formData.income_type}
                onChange={handleChange}
                label="Tipo"
              >
                <MenuItem value="ONETIME">Única</MenuItem>
                <MenuItem value="RECURRING">Recorrente</MenuItem>
                <MenuItem value="INSTALLMENT">Parcelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.income_type === 'RECURRING' && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Período</InputLabel>
                  <Select
                    name="recurrence_period"
                    value={formData.recurrence_period}
                    onChange={handleChange}
                    label="Período"
                  >
                    <MenuItem value="DAILY">Diário</MenuItem>
                    <MenuItem value="MONTHLY">Mensal</MenuItem>
                    <MenuItem value="YEARLY">Anual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Próximo Vencimento"
                    value={formData.next_due_date}
                    onChange={handleNextDueDateChange}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          {formData.income_type === 'INSTALLMENT' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de Parcelas"
                  name="total_installments"
                  type="number"
                  value={formData.total_installments}
                  onChange={handleChange}
                  required
                  inputProps={{ min: "1", step: "1" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parcela Atual"
                  name="current_installment"
                  type="number"
                  value={formData.current_installment}
                  onChange={handleChange}
                  required
                  inputProps={{ min: "1", step: "1" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                Adicionar Receita
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default IncomeForm;