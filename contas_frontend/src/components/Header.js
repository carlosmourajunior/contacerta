import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const menuTitles = {
  dashboard: 'Dashboard',
  expenses: 'Despesas',
  incomes: 'Receitas',
  categories: 'Categorias'
};

const Header = ({ handleDrawerToggle, onLogout, isDrawerOpen, selectedMenuItem }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ pr: 1 }}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1 }}
        >
          {isDrawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            Conta Certa
          </Typography>
          <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
            {menuTitles[selectedMenuItem]}
          </Typography>
        </Box>
        <Button color="inherit" onClick={onLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;