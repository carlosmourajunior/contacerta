import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import theme from './theme';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import CategoryList from './components/CategoryList';
import Dashboard from './components/Dashboard';
import IncomeList from './components/IncomeList';
import IncomeForm from './components/IncomeForm';
import * as api from './services/api.js';

const drawerWidth = 200;
const collapsedWidth = 55;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      console.log('Fetched expenses:', data);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      setError('Erro ao carregar despesas');
      setExpenses([]);
    }
  };

  const fetchIncomes = async () => {
    try {
      const data = await api.getIncomes();
      console.log('Fetched incomes:', data);
      setIncomes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      setError('Erro ao carregar receitas');
      setIncomes([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      console.log('Fetched categories:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError('Erro ao carregar categorias');
      setCategories([]);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!api.hasStoredCredentials()) {
        setLoading(false);
        return;
      }
      try {
        await api.checkAuth();
        setAuthenticated(true);
        await Promise.all([fetchExpenses(), fetchIncomes(), fetchCategories()]);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthenticated(false);
        setError('Erro de autenticação');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      await api.login(username, password);
      setAuthenticated(true);
      await Promise.all([fetchExpenses(), fetchIncomes(), fetchCategories()]);
      setError(null);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Erro no login: Verifique suas credenciais');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setAuthenticated(false);
      setExpenses([]);
      setIncomes([]);
      setCategories([]);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Erro ao fazer logout');
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      await api.createExpense(newExpense);
      await fetchExpenses();
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      setError('Erro ao adicionar despesa');
    }
  };

  const handleAddIncome = async (newIncome) => {
    try {
      await api.createIncome(newIncome);
      await fetchIncomes();
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      setError('Erro ao adicionar receita');
    }
  };

  const handleEditExpense = async (id, updatedExpense) => {
    try {
      await api.updateExpense(id, updatedExpense);
      await fetchExpenses();
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      setError('Erro ao atualizar despesa');
    }
  };

  const handleEditIncome = async (id, updatedIncome) => {
    try {
      await api.updateIncome(id, updatedIncome);
      await fetchIncomes();
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      setError('Erro ao atualizar receita');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      await fetchExpenses();
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      setError('Erro ao excluir despesa');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await api.deleteIncome(id);
      await fetchIncomes();
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
      setError('Erro ao excluir receita');
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await api.createCategory(newCategory);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setError('Erro ao adicionar categoria');
    }
  };

  const handleEditCategory = async (id, updatedCategory) => {
    try {
      await api.updateCategory(id, updatedCategory);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      setError('Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setError('Erro ao excluir categoria');
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    console.log('Rendering content with selectedMenuItem:', selectedMenuItem);
    console.log('Current categories:', categories);
    console.log('Current expenses:', expenses);
    console.log('Current incomes:', incomes);
    
    switch (selectedMenuItem) {
      case 'dashboard':
        return (
          <Dashboard 
            expenses={expenses}
            incomes={incomes}
            categories={categories}
          />
        );
      case 'expenses':
        return (
          <>
            <ExpenseForm 
              onSubmit={handleAddExpense} 
              categories={categories} 
            />
            <ExpenseList 
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              categories={categories}
            />
          </>
        );
      case 'incomes':
        return (
          <>
            <IncomeForm 
              onSubmit={handleAddIncome} 
              categories={categories} 
            />
            <IncomeList 
              incomes={incomes}
              onEdit={handleEditIncome}
              onDelete={handleDeleteIncome}
              categories={categories}
            />
          </>
        );
      case 'categories':
        return (
          <CategoryList
            categories={categories}
            onAdd={handleAddCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        );
      default:
        return null;
    }
  };

  const renderApp = () => {
    if (loading) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!authenticated) {
      return <Login onLogin={handleLogin} />;
    }

    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Header 
          handleDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
          isDrawerOpen={isDrawerOpen}
          selectedMenuItem={selectedMenuItem}
        />
        <Sidebar
          mobileOpen={mobileOpen}
          isOpen={isDrawerOpen}
          handleDrawerToggle={handleDrawerToggle}
          selectedMenuItem={selectedMenuItem}
          setSelectedMenuItem={setSelectedMenuItem}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 1.5,
            marginLeft: { sm: isDrawerOpen ? `${drawerWidth}px` : `${collapsedWidth}px` },
            width: { 
              xs: '100%',
              sm: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedWidth}px)` 
            },
            marginTop: '64px',
            backgroundColor: 'background.default',
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
          {renderApp()}
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError(null)}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
