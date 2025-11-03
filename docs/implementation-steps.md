# EVMS POC - Step-by-Step Implementation Guide

**Version:** 1.0  
**Date:** 2025-11-03  
**Goal:** Systematically build the EVMS POC with full light/dark theme support

---

## Prerequisites

✅ React app with TypeScript running  
✅ MUI components installed (Material-UI core + MUI X packages)  
✅ MUI X Charts, Data Grid, Date Pickers, Tree View installed  
✅ Current directory: `/Users/robert/Projects/rocktop_frontend_poc`

## Important: Dashboard Replacement

**The EVMS application will REPLACE the current MUI dashboard template.**

- Remove existing dashboard files from `src/dashboard/` after Phase 1 setup
- The Portfolio page (`index.html` from static) becomes the new default route
- All navigation and layout is based on the EVMS static HTML design
- We're keeping only the MUI component library, not the dashboard template

---

## Phase 1: Foundation & Theme Setup ✅ COMPLETED

### Step 1.0: Remove Existing Dashboard ✅
**Status:** Skipped - Dashboard template preserved for reference

---

### Step 1.1: Install Additional Dependencies ✅
```bash
npm install react-router-dom @types/react-router-dom
npm install @mui/lab  # For Timeline component in Audit modal
```

**Status:** COMPLETED  
**Verification:** Dependencies installed and working

---

### Step 1.2: Create Theme Configuration with EVMS Colors ✅
**Goal:** Extend MUI theme to support light/dark modes with EVMS-specific colors

**File:** `src/theme/evmsTheme.ts`

```typescript
import { createTheme, ThemeOptions, PaletteMode } from '@mui/material/styles';

// EVMS-specific color palette
const evmsColors = {
  ok: {
    light: '#16a34a',    // green-600
    dark: '#22c55e',     // green-500
  },
  warn: {
    light: '#f59e0b',    // amber-500
    dark: '#fbbf24',     // amber-400
  },
  bad: {
    light: '#ef4444',    // red-500
    dark: '#f87171',     // red-400
  },
  brand: {
    light: '#0e7afe',    // blue-600
    dark: '#60a5fa',     // blue-400
  },
};

// Extend the Theme type
declare module '@mui/material/styles' {
  interface Palette {
    evms: {
      ok: string;
      warn: string;
      bad: string;
      brand: string;
    };
  }
  interface PaletteOptions {
    evms?: {
      ok?: string;
      warn?: string;
      bad?: string;
      brand?: string;
    };
  }
}

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#0e7afe' : '#60a5fa',
    },
    background: {
      default: mode === 'light' ? '#f6f7fb' : '#0b1220',
      paper: mode === 'light' ? '#ffffff' : '#0f172a',
    },
    evms: {
      ok: evmsColors.ok[mode],
      warn: evmsColors.warn[mode],
      bad: evmsColors.bad[mode],
      brand: evmsColors.brand[mode],
    },
  },
  typography: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export const createEVMSTheme = (mode: PaletteMode) => 
  createTheme(getThemeOptions(mode));
```

**Status:** COMPLETED - File created and working  
**Location:** `src/context/ThemeContext.tsx`

---

### Step 1.3: Create Theme Context Provider ✅
**Goal:** Manage theme state globally with localStorage persistence

**File:** `src/context/ThemeContext.tsx`
**Status:** COMPLETED

```typescript
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEVMSTheme } from '../theme/evmsTheme';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = localStorage.getItem('rocktop_theme');
    return (stored === 'light' || stored === 'dark') ? stored : 'light';
  });

  useEffect(() => {
    localStorage.setItem('rocktop_theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createEVMSTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
```

**Status:** COMPLETED - Theme toggle working in both TopNav and via keyboard shortcuts  
**Note:** Uses `useThemeMode()` instead of `useTheme()` to avoid conflict with MUI's useTheme

---

### Step 1.4: Set Up React Router ✅
**Goal:** Configure routing structure for all EVMS pages

**File:** `src/App.tsx`
**Status:** COMPLETED

```typescript
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import PortfolioPage from './pages/PortfolioPage';

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<PortfolioPage />} />
            {/* More routes will be added */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
```

**Status:** COMPLETED - Routing working with nested routes

---

### Step 1.5: Create Base Layout Components ✅ ENHANCED
**Goal:** Build reusable layout structure
**Status:** COMPLETED with enhancements

#### File: `src/components/layout/AppLayout.tsx`

```typescript
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import TopNav from './TopNav';
import SideNav from './SideNav';

export default function AppLayout() {
  const [sideNavOpen, setSideNavOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopNav onMenuClick={() => setSideNavOpen(!sideNavOpen)} />
      <SideNav open={sideNavOpen} onClose={() => setSideNavOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Account for fixed TopNav height
          px: 3,
          pb: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
```

#### File: `src/components/layout/TopNav.tsx`

```typescript
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
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

        <IconButton color="inherit" onClick={() => navigate('/reports')}>
          Reports
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/admin')}>
          Admin
        </IconButton>
        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
```

#### File: `src/components/layout/SideNav.tsx`

```typescript
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import LayersIcon from '@mui/icons-material/Layers';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Portfolio', path: '/', icon: <DashboardIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Project', path: '/project/alpha', icon: <FolderIcon /> },
  { label: 'WBS', path: '/project/alpha/wbs', icon: <AccountTreeIcon /> },
  { label: 'Uploads', path: '/uploads', icon: <UploadIcon /> },
  { label: 'Progress', path: '/bulk-progress', icon: <EditIcon /> },
  { label: 'Baselines', path: '/baselines', icon: <LayersIcon /> },
  { label: 'Forecast', path: '/forecast', icon: <TrendingUpIcon /> },
  { label: 'Alerts', path: '/alerts', icon: <NotificationsIcon /> },
  { label: 'Vendors', path: '/vendors', icon: <BusinessIcon /> },
  { label: 'Admin', path: '/admin', icon: <SettingsIcon /> },
];

export default function SideNav({ open, onClose }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
```

**Status:** COMPLETED with significant enhancements:

#### Enhancements Made:
1. **Persistent Mini Drawer** - SideNav now uses persistent drawer pattern:
   - Collapsed width: 72px (icons only)
   - Expanded width: 240px (icons + labels)
   - Hover to expand functionality
   - Pin button to lock expanded state
   - Smooth transitions (150ms)

2. **SideNav Context** - Created `src/context/SideNavContext.tsx`:
   - `isHovered` - Tracks hover state
   - `isLocked` - Tracks pinned state
   - `isMenuOpen` - Tracks profile menu state
   - Main content shifts dynamically with sidebar

3. **Navigation Reorganization**:
   - Top items: Portfolio through Forecast
   - Bottom items: Alerts, Vendors, Settings (renamed from Admin)
   - Spacer pushes bottom items to footer

4. **Profile Menu Component** - Created `src/components/layout/ProfileMenu.tsx`:
   - Avatar with initials ("RC")
   - User info (Riley Carter, riley@email.com)
   - Three-dot dropdown menu
   - Menu items: Profile, My account, Add another account, Settings, Logout
   - Keeps drawer expanded while menu is open
   - Smooth opacity transitions

5. **Main Content Adjustments**:
   - Left padding reduced to 10px for closer spacing to sidebar
   - Dynamic margin based on sidebar state (72px collapsed, 240px expanded)
   - Smooth transition matching sidebar animation

**Files Created:**
- `src/context/SideNavContext.tsx`
- `src/components/layout/ProfileMenu.tsx`

**Files Modified:**
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/SideNav.tsx`
- `src/components/layout/TopNav.tsx` (removed hamburger menu)

---

## Phase 2: Shared Components ✅ COMPLETED

### Step 2.1: Create KPIPill Component ✅
**Goal:** Reusable SPI/CPI indicator with theme-aware colors

**File:** `src/components/evms/shared/KPIPill.tsx`
**Status:** COMPLETED

```typescript
import * as React from 'react';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

interface KPIPillProps {
  label: string;
  value: number;
  threshold?: {
    ok: number;
    warn: number;
  };
}

export default function KPIPill({ label, value, threshold = { ok: 1.0, warn: 0.9 } }: KPIPillProps) {
  const theme = useTheme();

  const getColor = () => {
    if (value >= threshold.ok) return theme.palette.evms.ok;
    if (value >= threshold.warn) return theme.palette.evms.warn;
    return theme.palette.evms.bad;
  };

  const getBgColor = () => {
    if (value >= threshold.ok) return `${theme.palette.evms.ok}20`;
    if (value >= threshold.warn) return `${theme.palette.evms.warn}20`;
    return `${theme.palette.evms.bad}20`;
  };

  return (
    <Chip
      label={`${label} ${value.toFixed(2)}`}
      size="small"
      sx={{
        color: getColor(),
        backgroundColor: getBgColor(),
        border: `1px solid ${getColor()}`,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}
    />
  );
}
```

**Status:** COMPLETED - Working with theme-aware colors

---

### Step 2.2: Create ExportButton Component ✅
**Goal:** Reusable CSV export functionality

**File:** `src/components/evms/shared/ExportButton.tsx`
**Status:** COMPLETED

```typescript
import * as React from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
}

export default function ExportButton({ data, filename, label = 'Export CSV' }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      {label}
    </Button>
  );
}
```

**Status:** COMPLETED - CSV export working

---

### Step 2.3: Create Mock Data Service ✅
**Goal:** Centralized mock API for EVMS data

**File:** `src/services/mockApi.ts`
**Status:** COMPLETED

```typescript
// Portfolio mock data
export interface ProjectRow {
  id: string;
  name: string;
  program: string;
  status: 'On Track' | 'Watch' | 'At Risk';
  percent: number;
  spi: number;
  cpi: number;
  spiTrend: number[];
  cpiTrend: number[];
  bac: number;
  eac: number;
  vac: number;
  lastUpdate: string;
  owner: string;
}

const mockPortfolio: ProjectRow[] = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    program: 'Avionics',
    status: 'Watch',
    percent: 65,
    spi: 0.93,
    cpi: 0.96,
    spiTrend: [0.95, 0.94, 0.92, 0.91, 0.93, 0.92, 0.93],
    cpiTrend: [0.98, 0.97, 0.96, 0.95, 0.96, 0.96, 0.96],
    bac: 1200000,
    eac: 1250000,
    vac: -50000,
    lastUpdate: '2025-10-28',
    owner: 'Sarah Chen',
  },
  {
    id: 'beta',
    name: 'Project Beta',
    program: 'Propulsion',
    status: 'On Track',
    percent: 42,
    spi: 1.02,
    cpi: 1.05,
    spiTrend: [1.01, 1.02, 1.03, 1.02, 1.01, 1.02, 1.02],
    cpiTrend: [1.06, 1.05, 1.05, 1.04, 1.05, 1.05, 1.05],
    bac: 850000,
    eac: 810000,
    vac: 40000,
    lastUpdate: '2025-10-30',
    owner: 'Mike Johnson',
  },
  // Add more mock projects as needed
];

export const mockApi = {
  getPortfolio: (): Promise<ProjectRow[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPortfolio), 300);
    });
  },

  getProject: (id: string): Promise<ProjectRow | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = mockPortfolio.find((p) => p.id === id);
        resolve(project || null);
      }, 300);
    });
  },

  // Add more API methods as needed
};
```

**Status:** COMPLETED - Mock data service working

### Step 2.4: Create SparkLine Component ✅
**Goal:** Inline sparkline charts for trends

**File:** `src/components/evms/shared/SparkLine.tsx`
**Status:** COMPLETED - Using MUI SparkLineChart

---

## Phase 3: Portfolio Page (MVP) ✅ COMPLETED

### Step 3.1: Create Portfolio Page ✅
**Goal:** First working EVMS page with theme support

**File:** `src/pages/PortfolioPage.tsx`
**Status:** COMPLETED

```typescript
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mockApi, ProjectRow } from '../services/mockApi';
import KPIPill from '../components/evms/shared/KPIPill';
import ExportButton from '../components/evms/shared/ExportButton';

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<ProjectRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    mockApi.getPortfolio().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Project',
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={() => navigate(`/project/${params.row.id}`)}
        >
          {params.value}
        </Box>
      ),
    },
    { field: 'program', headerName: 'Program', width: 120 },
    { field: 'percent', headerName: '% Complete', width: 110, type: 'number' },
    {
      field: 'spi',
      headerName: 'SPI',
      width: 120,
      renderCell: (params) => <KPIPill label="SPI" value={params.value} />,
    },
    {
      field: 'cpi',
      headerName: 'CPI',
      width: 120,
      renderCell: (params) => <KPIPill label="CPI" value={params.value} />,
    },
    {
      field: 'bac',
      headerName: 'BAC',
      width: 130,
      type: 'number',
      valueFormatter: (params) => `$${(params.value / 1000).toFixed(0)}k`,
    },
    {
      field: 'eac',
      headerName: 'EAC',
      width: 130,
      type: 'number',
      valueFormatter: (params) => `$${(params.value / 1000).toFixed(0)}k`,
    },
    {
      field: 'vac',
      headerName: 'VAC',
      width: 130,
      type: 'number',
      valueFormatter: (params) => {
        const val = params.value / 1000;
        return `${val >= 0 ? '+' : ''}$${val.toFixed(0)}k`;
      },
    },
    { field: 'owner', headerName: 'Owner', width: 150 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Earned Value Management • Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scan projects, spot SPI/CPI risk, and jump into details.
          </Typography>
        </Box>
        <ExportButton data={projects} filename="portfolio" />
      </Box>

      <DataGrid
        rows={projects}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
}
```

**Status:** COMPLETED - Portfolio page fully functional with all features

---

## Testing Checklist for Phase 1-3

- [x] Theme toggle switches between light and dark
- [x] Theme persists in localStorage on refresh
- [x] TopNav renders correctly in both themes
- [x] SideNav persistent drawer with hover/pin functionality
- [x] Profile menu at bottom of SideNav with dropdown
- [x] Portfolio page loads mock data
- [x] KPIPill shows correct colors based on value
- [x] SparkLine charts display trends
- [x] Export button downloads CSV
- [x] Project name click navigates (placeholder pages)
- [x] No console errors
- [x] Responsive layout working

---

---

## Summary of Current Implementation Status

### ✅ Completed Components
1. **Layout System**
   - AppLayout with persistent sidebar
   - TopNav with search and theme toggle
   - SideNav with hover/pin, profile menu
   - SideNavContext for state management
   - ProfileMenu with dropdown

2. **Shared Components**
   - KPIPill (theme-aware SPI/CPI indicators)
   - SparkLine (trend visualization)
   - ExportButton (CSV download)

3. **Pages**
   - PortfolioPage (fully functional)

4. **Services**
   - mockApi.ts (portfolio data)
   - ThemeContext with localStorage persistence

### 🚧 In Progress / TODO

## Phase 4-7: Remaining Pages 🚧

### Step 4: Implement Remaining Routes

**Update:** `src/App.tsx` to add all routes:

```typescript
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<PortfolioPage />} />
    <Route path="project/:projectId" element={<ProjectOverviewPage />} />
    <Route path="project/:projectId/wbs" element={<WBSPage />} />
    <Route path="project/:projectId/wbs/:wpCode" element={<WorkPackageDetailPage />} />
    <Route path="uploads" element={<UploadsPage />} />
    <Route path="bulk-progress" element={<BulkProgressPage />} />
    <Route path="forecast" element={<ForecastPage />} />
    <Route path="baselines" element={<BaselinesPage />} />
    <Route path="analytics" element={<AnalyticsPage />} />
    <Route path="alerts" element={<AlertsPage />} />
    <Route path="vendors" element={<VendorsPage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="reports" element={<ReportsPage />} />
  </Route>
</Routes>
```

### Step 5-12: Implement Each Page
For each remaining page, follow this pattern:

1. Create placeholder page component in `src/pages/`
2. Create specific components in `src/components/evms/<section>/`
3. Add mock data to `src/services/mockApi.ts`
4. Use theme-aware MUI components
5. Test in both light and dark modes
6. Add to routing

**Order of Implementation:**
1. ✅ Portfolio (complete)
2. Project Overview
3. WBS
4. Work Package Detail
5. Uploads
6. Bulk Progress
7. Forecast
8. Baselines
9. Analytics
10. Alerts
11. Vendors
12. Admin
13. Reports

---

## Final Verification Steps

### Theme Compatibility Checklist
- [ ] All pages render correctly in light mode
- [ ] All pages render correctly in dark mode
- [ ] Theme toggle works from any page
- [ ] No visual glitches during theme transition
- [ ] EVMS colors (ok/warn/bad) visible in both themes
- [ ] Charts readable in both themes
- [ ] Tables readable in both themes
- [ ] Forms readable in both themes

### Functionality Checklist
- [ ] All routes navigate correctly
- [ ] Mock data loads on all pages
- [ ] Export CSV works on all tables
- [ ] KPI pills show correct colors
- [ ] Charts render with data
- [ ] Forms validate input
- [ ] Modals open/close properly
- [ ] LocalStorage persists theme preference

### Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader compatible

---

## Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] Build output in `/build` directory
- [ ] No console errors in production build
- [ ] Theme works in production
- [ ] All routes accessible
- [ ] Static assets load correctly

---

## Next Steps After Implementation

1. **User Testing**: Get feedback on theme preference and usability
2. **Performance Optimization**: Lazy load pages, optimize bundle size
3. **Documentation**: Create user guide for POC
4. **Backend Integration Planning**: Define API contracts
5. **Enhanced Features**: Add more interactive charts, real-time updates

---

**End of Step-by-Step Implementation Guide**  
© 2025 Rocktop Systems
