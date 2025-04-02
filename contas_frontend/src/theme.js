import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
            minWidth: 0,
          },
          '& .MuiListItemButton-root': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.24)',
              },
            },
          },
          '& .MuiDivider-root': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;