import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {}

export default function TopNav({}: TopNavProps) {
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Rocktop EVMS
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', mx: 4 }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
              width: '100%',
              maxWidth: 520,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                pl: 2,
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Quick search…"
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '8px 8px 8px 0',
                  pl: 6,
                },
              }}
            />
          </Box>
        </Box>

        <Button color="inherit" onClick={() => navigate('/reports')}>
          Reports
        </Button>
        <Button color="inherit" onClick={() => navigate('/admin')}>
          Admin
        </Button>
        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
