import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonetizationOn as MonetizationOnIcon,
  Category as CategoryIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';

const drawerWidth = 200; // Reduzindo de 240 para 200
const collapsedWidth = 55; // Reduzindo de 65 para 55

const menuItems = [
  { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'expenses', text: 'Despesas', icon: <MoneyOffIcon /> },
  { id: 'incomes', text: 'Receitas', icon: <MonetizationOnIcon /> },
  { id: 'categories', text: 'Categorias', icon: <CategoryIcon /> },
];

const Sidebar = ({ mobileOpen, isOpen, handleDrawerToggle, selectedMenuItem, setSelectedMenuItem }) => {
  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List sx={{ p: 0.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!isOpen ? item.text : ""} placement="right">
              <ListItemButton
                selected={selectedMenuItem === item.id}
                onClick={() => setSelectedMenuItem(item.id)}
                sx={{
                  minHeight: 40,
                  justifyContent: isOpen ? 'initial' : 'center',
                  px: 1.5,
                  borderRadius: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: isOpen ? 1 : 0,
                    display: isOpen ? 'block' : 'none'
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: isOpen ? drawerWidth : collapsedWidth }, 
        flexShrink: { sm: 0 },
        position: 'fixed'
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isOpen ? drawerWidth : collapsedWidth,
            position: 'fixed',
            transition: theme =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
        open={isOpen}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;