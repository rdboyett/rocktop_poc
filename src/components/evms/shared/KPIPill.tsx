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
