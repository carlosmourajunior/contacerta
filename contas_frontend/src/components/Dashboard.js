import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { format, addMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BalanceIcon from '@mui/icons-material/Balance';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';

const DashboardCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" color={`${color}.main`}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = ({ expenses, incomes, categories }) => {
  const [forecastMonths, setForecastMonths] = useState(3);
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    totalIncomes: 0,
    balance: 0,
    pendingExpenses: 0,
    upcomingExpenses: 0,
    unpaidExpenses: 0,
    paidExpenses: 0,
    categoriesCount: 0,
    recentExpenses: [],
    recentIncomes: [],
    expensesByCategory: [],
    incomesByCategory: [],
    monthlyForecasts: [],
  });

  const calculateMonthlyForecast = (baseDate, expenses, incomes) => {
    const forecast = {
      month: format(baseDate, 'MMMM yyyy', { locale: ptBR }),
      expectedExpenses: 0,
      expectedIncomes: 0,
      projectedBalance: 0,
      details: {
        recurring: [],
        installments: [],
        oneTime: []
      }
    };

    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    const currentMonth = startOfMonth(new Date());

    expenses.forEach(expense => {
      if (expense.expense_type === 'RECURRING' && expense.paid) {
        if (!isSameMonth(monthStart, currentMonth)) {
          expense = { ...expense, paid: false };
        }
      }

      if (expense.paid) return;

      switch (expense.expense_type) {
        case 'RECURRING':
          if (expense.next_due_date) {
            const nextDue = parseISO(expense.next_due_date);
            if (isWithinInterval(monthStart, { start: currentMonth, end: nextDue })) {
              forecast.expectedExpenses += parseFloat(expense.amount);
              forecast.details.recurring.push({
                description: expense.description,
                amount: expense.amount,
                date: expense.next_due_date
              });
            }
          }
          break;
        case 'INSTALLMENT':
          if (!expense.paid && expense.current_installment && expense.total_installments) {
            const currentInstallment = parseInt(expense.current_installment);
            const totalInstallments = parseInt(expense.total_installments);
            const startDate = parseISO(expense.date);
            const installmentDate = addMonths(startDate, currentInstallment - 1);
            if (isSameMonth(installmentDate, baseDate) && currentInstallment <= totalInstallments) {
              forecast.expectedExpenses += parseFloat(expense.installment_value);
              forecast.details.installments.push({
                description: expense.description,
                amount: expense.installment_value,
                installment: `${currentInstallment}/${totalInstallments}`
              });
            }
          }
          break;
        case 'ONETIME':
          const expenseDate = parseISO(expense.date);
          if (isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })) {
            forecast.expectedExpenses += parseFloat(expense.amount);
            forecast.details.oneTime.push({
              description: expense.description,
              amount: expense.amount,
              date: expense.date
            });
          }
          break;
      }
    });

    incomes.forEach(income => {
      if (income.income_type === 'RECURRING') {
        const startDate = parseISO(income.date);
        if (startDate <= monthEnd) {
          forecast.expectedIncomes += parseFloat(income.amount);
        }
      } else {
        const incomeDate = parseISO(income.date);
        if (isWithinInterval(incomeDate, { start: monthStart, end: monthEnd })) {
          forecast.expectedIncomes += parseFloat(income.amount);
        }
      }
    });

    forecast.projectedBalance = forecast.expectedIncomes - forecast.expectedExpenses;
    return forecast;
  };

  useEffect(() => {
    if (!Array.isArray(expenses) || !Array.isArray(incomes)) return;

    const now = new Date();
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalIncomes = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const balance = totalIncomes - totalExpenses;

    const unpaidExpenses = expenses
      .filter(exp => !exp.paid)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const paidExpenses = expenses
      .filter(exp => exp.paid)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const pendingExpenses = expenses
      .filter(exp => !exp.paid && new Date(exp.date) < now)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const upcomingExpenses = expenses
      .filter(exp => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        if (exp.expense_type === 'RECURRING' && exp.next_due_date) {
          const nextDueDate = new Date(exp.next_due_date);
          return nextDueDate > now && nextDueDate <= thirtyDaysFromNow;
        } else {
          const expDate = new Date(exp.date);
          return expDate > now && expDate <= thirtyDaysFromNow;
        }
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const recentIncomes = [...incomes]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const expensesByCategory = categories.map(cat => ({
      name: cat.name,
      total: expenses
        .filter(exp => exp.category === cat.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
    }));

    const incomesByCategory = categories.map(cat => ({
      name: cat.name,
      total: incomes
        .filter(inc => inc.category === cat.id)
        .reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
    }));

    const monthlyForecasts = [];
    for (let i = 0; i < forecastMonths; i++) {
      const forecastDate = addMonths(now, i);
      const forecast = calculateMonthlyForecast(forecastDate, expenses, incomes);
      monthlyForecasts.push(forecast);
    }

    setDashboardData({
      totalExpenses,
      totalIncomes,
      balance,
      pendingExpenses,
      upcomingExpenses,
      unpaidExpenses,
      paidExpenses,
      categoriesCount: categories.length,
      recentExpenses,
      recentIncomes,
      expensesByCategory,
      incomesByCategory,
      monthlyForecasts
    });
  }, [expenses, incomes, categories, forecastMonths]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Total de Receitas"
            value={formatCurrency(dashboardData.totalIncomes)}
            icon={<TrendingUpIcon color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Total de Despesas"
            value={formatCurrency(dashboardData.totalExpenses)}
            icon={<AccountBalanceIcon color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Saldo"
            value={formatCurrency(dashboardData.balance)}
            icon={<BalanceIcon color={dashboardData.balance >= 0 ? "success" : "error"} />}
            color={dashboardData.balance >= 0 ? "success" : "error"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Despesas Pagas"
            value={formatCurrency(dashboardData.paidExpenses)}
            icon={<CheckCircleIcon color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Despesas Não Pagas"
            value={formatCurrency(dashboardData.unpaidExpenses)}
            icon={<WarningIcon color="warning" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Despesas Atrasadas"
            value={formatCurrency(dashboardData.pendingExpenses)}
            icon={<ErrorIcon color="error" />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DashboardCard
            title="Categorias"
            value={dashboardData.categoriesCount}
            icon={<CategoryIcon color="info" />}
            color="info"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon sx={{ mr: 1 }} />
            Previsão Financeira
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Meses</InputLabel>
            <Select
              value={forecastMonths}
              label="Meses"
              onChange={(e) => setForecastMonths(e.target.value)}
            >
              <MenuItem value={3}>3 meses</MenuItem>
              <MenuItem value={6}>6 meses</MenuItem>
              <MenuItem value={12}>12 meses</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Mês</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Receitas Previstas</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Despesas Previstas</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Saldo Projetado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.monthlyForecasts.map((forecast, index) => (
                <TableRow key={index}>
                  <TableCell>{forecast.month}</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>
                    {formatCurrency(forecast.expectedIncomes)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>
                    {formatCurrency(forecast.expectedExpenses)}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      color: forecast.projectedBalance >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(forecast.projectedBalance)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {forecast.details.recurring.length > 0 && (
                        `${forecast.details.recurring.length} despesa(s) recorrente(s)`
                      )}
                      {forecast.details.installments.length > 0 && (
                        `${forecast.details.recurring.length > 0 ? ', ' : ''}${forecast.details.installments.length} parcela(s)`
                      )}
                      {forecast.details.oneTime.length > 0 && (
                        `${(forecast.details.recurring.length > 0 || forecast.details.installments.length > 0) ? ', ' : ''}${forecast.details.oneTime.length} despesa(s) única(s)`
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="h6" gutterBottom>
              Receitas Recentes
            </Typography>
            <Divider sx={{ my: 2 }} />
            {dashboardData.recentIncomes.map((income) => (
              <Box key={income.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">
                    {income.description}
                  </Typography>
                  <Typography variant="subtitle1" color="success.main">
                    {formatCurrency(income.amount)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(income.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categories.find(cat => cat.id === income.category)?.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="h6" gutterBottom>
              Despesas Recentes
            </Typography>
            <Divider sx={{ my: 2 }} />
            {dashboardData.recentExpenses.map((expense) => (
              <Box key={expense.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">
                    {expense.description}
                  </Typography>
                  <Typography variant="subtitle1" color="error">
                    {formatCurrency(expense.amount)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categories.find(cat => cat.id === expense.category)?.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;