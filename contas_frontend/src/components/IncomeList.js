import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const IncomeList = ({ incomes, onEdit, onDelete, categories }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getIncomeTypeLabel = (type) => {
    const types = {
      'ONETIME': 'Única',
      'RECURRING': 'Recorrente',
      'INSTALLMENT': 'Parcelada'
    };
    return types[type] || type;
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography align="center">
                    Nenhuma receita cadastrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>R$ {Number(income.amount).toFixed(2)}</TableCell>
                  <TableCell>{formatDate(income.date)}</TableCell>
                  <TableCell>{getCategoryName(income.category)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getIncomeTypeLabel(income.income_type)}
                      color={income.income_type === 'RECURRING' ? 'primary' : 'default'}
                      variant={income.income_type === 'INSTALLMENT' ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(income)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(income.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default IncomeList;