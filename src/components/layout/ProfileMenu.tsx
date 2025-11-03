import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSideNav } from '../../context/SideNavContext';

interface ProfileMenuProps {
  isExpanded: boolean;
}

export default function ProfileMenu({ isExpanded }: ProfileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setIsHovered, isLocked, setIsMenuOpen } = useSideNav();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
    // Keep drawer expanded while menu is open
    if (!isLocked) {
      setIsHovered(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    // Don't close the menu or drawer when clicking items
  };

  return (
    <Box
      sx={{
        mt: 'auto',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: 'primary.main',
        }}
      >
        RC
      </Avatar>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          opacity: isExpanded ? 1 : 0,
          transition: (theme) =>
            theme.transitions.create('opacity', {
              duration: 150,
            }),
        }}
      >
        <Typography variant="body2" fontWeight={600} noWrap>
          Riley Carter
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          riley@email.com
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          opacity: isExpanded ? 1 : 0,
          transition: (theme) =>
            theme.transitions.create('opacity', {
              duration: 150,
            }),
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        slotProps={{
          paper: {
            onMouseLeave: handleClose,
          },
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick(() => console.log('Profile'))}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(() => console.log('My account'))}>
          My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuItemClick(() => console.log('Add another account'))}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(() => console.log('Settings'))}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleClose(); console.log('Logout'); }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
