import { Theme, Components } from '@mui/material/styles';

export const dataGridCustomizations: Components<Theme> = {
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: 'none',
      },
    },
  },
};
