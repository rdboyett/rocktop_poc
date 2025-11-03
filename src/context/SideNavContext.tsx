import * as React from 'react';

interface SideNavContextType {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const SideNavContext = React.createContext<SideNavContextType | undefined>(undefined);

export function SideNavProvider({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <SideNavContext.Provider value={{ isHovered, setIsHovered, isLocked, setIsLocked, isMenuOpen, setIsMenuOpen }}>
      {children}
    </SideNavContext.Provider>
  );
}

export function useSideNav() {
  const context = React.useContext(SideNavContext);
  if (!context) {
    throw new Error('useSideNav must be used within SideNavProvider');
  }
  return context;
}
