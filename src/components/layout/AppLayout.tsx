import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { SideNavProvider, useSideNav } from '../../context/SideNavContext';

interface MainContentProps extends BoxProps {
  isExpanded: boolean;
}

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<MainContentProps>(({ theme, isExpanded }) => ({
  flexGrow: 1,
  pt: 8, // Account for fixed TopNav height
  pl: 1.25, // 10px
  pr: 3,
  pb: 3,
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
      <TopNav />
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
