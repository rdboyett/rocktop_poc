import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import SideNav from './SideNav';
import { SideNavProvider, useSideNav } from '../../context/SideNavContext';

interface MainContentProps extends BoxProps {
  isExpanded: boolean;
}

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<MainContentProps>(({ theme, isExpanded }) => ({
  flexGrow: 1,
  padding: '20px 20px 20px 0',
  marginLeft: '55px',
  transition: theme.transitions.create('margin-left', {
    easing: theme.transitions.easing.sharp,
    duration: 150,
  }),
}));

function AppLayoutContent() {
  const { isHovered, isLocked, isMenuOpen } = useSideNav();
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav />
      <MainContent component="main" isExpanded={isHovered || isLocked || isMenuOpen}>
        <Outlet />
      </MainContent>
    </Box>
  );
}

export default function AppLayout() {
  return (
    <SideNavProvider>
      <AppLayoutContent />
    </SideNavProvider>
  );
}
