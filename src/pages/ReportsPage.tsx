import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PageHeader from '../components/layout/PageHeader';

interface ReportItem {
  id: string;
  name: string;
  description: string;
  category: string;
  format?: string;
  icon: React.ReactNode;
}

const reports: ReportItem[] = [
  // Performance Reports
  {
    id: 'cpr-format-1',
    name: 'CPR Format 1 - WBS',
    description: 'Cost Performance Report showing cumulative BCWS, BCWP, ACWP by Work Breakdown Structure',
    category: 'Performance Reports',
    format: 'CPR Format 1',
    icon: <TableChartIcon />,
  },
  {
    id: 'cpr-format-2',
    name: 'CPR Format 2 - Organizational',
    description: 'Cost Performance Report by organizational category',
    category: 'Performance Reports',
    format: 'CPR Format 2',
    icon: <TableChartIcon />,
  },
  {
    id: 'cpr-format-5',
    name: 'CPR Format 5 - Baseline',
    description: 'Baseline comparison showing original vs current performance measurement baseline',
    category: 'Performance Reports',
    format: 'CPR Format 5',
    icon: <BarChartIcon />,
  },

  // Variance Reports
  {
    id: 'variance-analysis',
    name: 'Variance Analysis Report',
    description: 'Detailed variance analysis showing SV, CV, and threshold exceptions across all control accounts',
    category: 'Variance Reports',
    icon: <TimelineIcon />,
  },
  {
    id: 'variance-thresholds',
    name: 'Threshold Exception Report',
    description: 'Control accounts and work packages exceeding variance thresholds',
    category: 'Variance Reports',
    icon: <AssessmentIcon />,
  },

  // Forecast Reports
  {
    id: 'eac-report',
    name: 'Estimate at Completion (EAC)',
    description: 'Forecast report showing EAC, ETC, VAC projections by WBS and CA',
    category: 'Forecast Reports',
    icon: <TrendingUpIcon />,
  },
  {
    id: 'trend-analysis',
    name: 'Performance Trend Analysis',
    description: 'Historical trends of SPI and CPI over time with forecasting',
    category: 'Forecast Reports',
    icon: <TimelineIcon />,
  },

  // Status Reports
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level program status with key metrics, risks, and accomplishments',
    category: 'Status Reports',
    icon: <DescriptionIcon />,
  },
  {
    id: 'milestone-status',
    name: 'Milestone Status Report',
    description: 'Status of key program milestones and deliverables',
    category: 'Status Reports',
    icon: <AssessmentIcon />,
  },
];

const categories = [
  { name: 'Performance Reports', color: '#0ea5e9' as const },
  { name: 'Variance Reports', color: '#f59e0b' as const },
  { name: 'Forecast Reports', color: '#10b981' as const },
  { name: 'Status Reports', color: '#8b5cf6' as const },
];

export default function ReportsPage() {
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.name === category)?.color || '#6b7280';
  };

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Access standard EVMS reports, variance analysis, and performance summaries"
        showSearch={false}
      />

      {categories.map((category) => {
        const categoryReports = reports.filter(r => r.category === category.name);
        
        return (
          <Box key={category.name} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: category.color,
                  borderRadius: 1,
                }}
              />
              <Typography variant="h6">{category.name}</Typography>
              <Chip label={categoryReports.length} size="small" />
            </Box>

            <Grid container spacing={2}>
              {categoryReports.map((report) => (
                <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardActionArea
                      onClick={() => navigate(`/reports/${report.id}`)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: `${category.color}15`,
                              color: category.color,
                              flexShrink: 0,
                            }}
                          >
                            {report.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                              {report.name}
                            </Typography>
                            {report.format && (
                              <Chip 
                                label={report.format} 
                                size="small" 
                                sx={{ mb: 1 }}
                              />
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {report.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}
