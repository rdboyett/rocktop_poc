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
