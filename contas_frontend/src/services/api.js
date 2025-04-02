import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      config.headers.Authorization = credentials;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication error - clearing credentials');
      clearCredentials();
    }
    return Promise.reject(error);
  }
);

export const setCredentials = (username, password) => {
  const credentials = btoa(`${username}:${password}`);
  localStorage.setItem('credentials', `Basic ${credentials}`);
};

export const clearCredentials = () => {
  localStorage.removeItem('credentials');
};

export const hasStoredCredentials = () => {
  return !!localStorage.getItem('credentials');
};

export const login = async (username, password) => {
  try {
    setCredentials(username, password);
    // Get categories as a login test
    const response = await axiosInstance.get('/categories/');
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    clearCredentials();
    throw error;
  }
};

export const logout = () => {
  clearCredentials();
  return Promise.resolve();
};

export const checkAuth = async () => {
  try {
    if (!hasStoredCredentials()) {
      throw new Error('No stored credentials');
    }
    const response = await axiosInstance.get('/categories/');
    console.log('Auth check successful:', response);
    return response;
  } catch (error) {
    console.error('Auth check failed:', error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const response = await axiosInstance.get('/expenses/');
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const createExpense = async (data) => {
  try {
    const response = await axiosInstance.post('/expenses/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const updateExpense = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/expenses/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axiosInstance.delete(`/expenses/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await axiosInstance.post('/categories/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getIncomes = async () => {
  try {
    const response = await axiosInstance.get('/incomes/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
};

export const createIncome = async (income) => {
  try {
    const response = await axiosInstance.post('/incomes/', income);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    throw error;
  }
};

export const updateIncome = async (id, income) => {
  try {
    const response = await axiosInstance.put(`/incomes/${id}/`, income);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    throw error;
  }
};

export const deleteIncome = async (id) => {
  try {
    await axiosInstance.delete(`/incomes/${id}/`);
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    throw error;
  }
};