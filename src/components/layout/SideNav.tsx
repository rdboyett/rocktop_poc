import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import LayersIcon from '@mui/icons-material/Layers';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useSideNav } from '../../context/SideNavContext';
import { useThemeMode } from '../../context/ThemeContext';
import ProfileMenu from './ProfileMenu';

const drawerWidth = 240;
const miniDrawerWidth = 72;

interface SideNavProps {}

const topNavItems = [
  { label: 'Portfolio', path: '/', icon: <DashboardIcon /> },
  { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Project', path: '/project/alpha', icon: <FolderIcon /> },
  { label: 'WBS', path: '/project/alpha/wbs', icon: <AccountTreeIcon /> },
  { label: 'Uploads', path: '/uploads', icon: <UploadIcon /> },
  { label: 'Progress', path: '/bulk-progress', icon: <EditIcon /> },
  { label: 'Baselines', path: '/baselines', icon: <LayersIcon /> },
  { label: 'Forecast', path: '/forecast', icon: <TrendingUpIcon /> },
];

const bottomNavItems = [
  { label: 'Alerts', path: '/alerts', icon: <NotificationsIcon /> },
  { label: 'Vendors', path: '/vendors', icon: <BusinessIcon /> },
  { label: 'Settings', path: '/admin', icon: <SettingsIcon /> },
];

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { isHovered, isLocked, isMenuOpen } = useSideNav();
  
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={toggleTheme}
        sx={{
          minHeight: 48,
          justifyContent: 'initial',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: 'center',
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </ListItemIcon>
        <ListItemText 
          primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          sx={{
            opacity: (isHovered || isLocked || isMenuOpen) ? 1 : 0,
            transition: (theme) => theme.transitions.create('opacity', {
              duration: 150,
            }),
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: miniDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: 150,
  }),
  '& .MuiDrawer-paper': {
    width: miniDrawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: 150,
    }),
    boxSizing: 'border-box',
  },
  '&:hover': {
    width: drawerWidth,
  },
  '&:hover .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

export default function SideNav({}: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isHovered, setIsHovered, isLocked, setIsLocked, isMenuOpen } = useSideNav();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleMouseEnter = () => {
    if (!isLocked) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked && !isMenuOpen) {
      setIsHovered(false);
    }
  };

  return (
    <Drawer 
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: (isHovered || isLocked || isMenuOpen) ? drawerWidth : miniDrawerWidth,
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
            width: (isHovered || isLocked || isMenuOpen) ? drawerWidth : miniDrawerWidth
        },
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'white',
            fontSize: '18px',
          }}
        >
          R
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            opacity: (isHovered || isLocked) ? 1 : 0,
            transition: (theme) => theme.transitions.create('opacity', {
              duration: 150,
            }),
            whiteSpace: 'nowrap',
          }}
        >
          Rocktop EVMS
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title={isLocked ? "Unpin sidebar" : "Pin sidebar"} placement="right">
          <IconButton
            size="small"
            onClick={() => setIsLocked(!isLocked)}
            sx={{
              opacity: (isHovered || isLocked) ? 1 : 0,
              transition: (theme) => theme.transitions.create('opacity', {
                duration: 150,
              }),
            }}
          >
            {isLocked ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <List>
        {topNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  opacity: (isHovered || isLocked || isMenuOpen) ? 1 : 0,
                  transition: (theme) => theme.transitions.create('opacity', {
                    duration: 150,
                  }),
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <List>
        {bottomNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  opacity: (isHovered || isLocked || isMenuOpen) ? 1 : 0,
                  transition: (theme) => theme.transitions.create('opacity', {
                    duration: 150,
                  }),
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ThemeToggleButton />
      </List>
      
      <Divider />
      <ProfileMenu isExpanded={isHovered} />
    </Drawer>
  );
}
