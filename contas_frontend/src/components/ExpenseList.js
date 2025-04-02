import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import RecurrentIcon from '@mui/icons-material/Repeat';
import InstallmentIcon from '@mui/icons-material/Payment';
import OneTimeIcon from '@mui/icons-material/EventNote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpenseForm from './ExpenseForm';

const ExpenseList = ({ expenses = [], onEdit, onDelete }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Add a safety check for expenses
  if (!Array.isArray(expenses)) {
    console.error('ExpenseList received non-array expenses:', expenses);
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ py: 2, color: 'text.secondary' }}>
                    Erro ao carregar despesas
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getExpenseTypeIcon = (type) => {
    switch (type) {
      case 'RECURRING':
        return <RecurrentIcon fontSize="small" />;
      case 'INSTALLMENT':
        return <InstallmentIcon fontSize="small" />;
      default:
        return <OneTimeIcon fontSize="small" />;
    }
  };

  const getExpenseTypeChip = (expense) => {
    let label = expense.expense_type_display;
    let color = 'default';
    
    switch (expense.expense_type) {
      case 'RECURRING':
        color = 'primary';
        label = `${label} (${expense.recurrence_period_display})`;
        break;
      case 'INSTALLMENT':
        color = 'secondary';
        label = `${label} (${expense.current_installment}/${expense.total_installments})`;
        break;
      default:
        color = 'default';
    }

    return (
      <Tooltip title={
        expense.expense_type === 'RECURRING' ? 
          `Próximo vencimento: ${format(new Date(expense.next_due_date), 'dd/MM/yyyy', { locale: ptBR })}` :
          expense.expense_type === 'INSTALLMENT' ?
          `Valor da parcela: ${formatCurrency(expense.installment_value)}` :
          'Despesa única'
      }>
        <Chip
          icon={getExpenseTypeIcon(expense.expense_type)}
          label={label}
          size="small"
          color={color}
          variant="outlined"
        />
      </Tooltip>
    );
  };

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleCloseEdit = () => {
    setEditingExpense(null);
  };

  const handleConfirmEdit = (updatedExpense) => {
    const expenseToUpdate = {
      ...updatedExpense,
      id: editingExpense.id,
      paid: updatedExpense.paid,
      paid_date: updatedExpense.paid_date
    };
    onEdit(editingExpense.id, expenseToUpdate);
    handleCloseEdit();
  };

  const handleOpenDelete = (expense) => {
    setSelectedExpense(expense);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setSelectedExpense(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      onDelete(selectedExpense.id);
    }
    handleCloseDelete();
  };

  const handlePaidToggle = (expense) => {
    const updatedExpense = {
      ...expense,
      paid: !expense.paid,
      paid_date: !expense.paid ? new Date().toISOString().split('T')[0] : null
    };
    onEdit(expense.id, updatedExpense);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Vencimento</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow 
                key={expense.id}
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: expense.paid ? 'action.hover' : 'inherit'
                }}
              >
                <TableCell>
                  {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category_name}</TableCell>
                <TableCell>{getExpenseTypeChip(expense)}</TableCell>
                <TableCell align="right">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={
                    expense.paid
                      ? `Pago em ${format(new Date(expense.paid_date), 'dd/MM/yyyy', { locale: ptBR })}`
                      : expense.date < new Date().toISOString()
                        ? 'Pagamento atrasado'
                        : 'Marcar como pago'
                  }>
                    <Switch
                      checked={expense.paid}
                      onChange={() => handlePaidToggle(expense)}
                      color="success"
                      size="small"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenEdit(expense)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleOpenDelete(expense)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ py: 2, color: 'text.secondary' }}>
                    Nenhuma despesa registrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog 
        open={Boolean(editingExpense)} 
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Despesa</DialogTitle>
        <DialogContent>
          {editingExpense && (
            <ExpenseForm
              initialData={editingExpense}
              onSubmit={handleConfirmEdit}
              onCancel={handleCloseEdit}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDelete}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta despesa?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExpenseList;