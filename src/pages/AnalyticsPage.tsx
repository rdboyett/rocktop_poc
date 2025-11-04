import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { LineChart } from '@mui/x-charts/LineChart';
import PageHeader from '../components/layout/PageHeader';

interface Project {
  id: string;
  name: string;
  program: string;
  spi: number;
  cpi: number;
  status: 'green' | 'yellow' | 'red';
}

interface TrendData {
  month: string;
  portfolioSPI: number;
  portfolioCPI: number;
}

export default function AnalyticsPage() {
  // Mock projects
  const projects: Project[] = [
    { id: '1', name: 'Project Alpha', program: 'Defense Systems', spi: 0.95, cpi: 1.02, status: 'yellow' },
    { id: '2', name: 'Project Beta', program: 'Defense Systems', spi: 1.05, cpi: 1.08, status: 'green' },
    { id: '3', name: 'Project Gamma', program: 'Space Technology', spi: 0.88, cpi: 0.92, status: 'red' },
    { id: '4', name: 'Project Delta', program: 'Space Technology', spi: 1.12, cpi: 1.15, status: 'green' },
    { id: '5', name: 'Project Epsilon', program: 'Aerospace', spi: 0.97, cpi: 0.89, status: 'red' },
    { id: '6', name: 'Project Zeta', program: 'Aerospace', spi: 1.03, cpi: 1.01, status: 'green' },
    { id: '7', name: 'Project Eta', program: 'Defense Systems', spi: 0.92, cpi: 0.96, status: 'yellow' },
    { id: '8', name: 'Project Theta', program: 'Space Technology', spi: 1.08, cpi: 1.12, status: 'green' },
  ];

  // Mock trend data
  const trendData: TrendData[] = [
    { month: 'Jan', portfolioSPI: 0.98, portfolioCPI: 1.02 },
    { month: 'Feb', portfolioSPI: 0.99, portfolioCPI: 1.03 },
    { month: 'Mar', portfolioSPI: 1.01, portfolioCPI: 1.05 },
    { month: 'Apr', portfolioSPI: 0.97, portfolioCPI: 1.01 },
    { month: 'May', portfolioSPI: 0.96, portfolioCPI: 0.99 },
    { month: 'Jun', portfolioSPI: 0.98, portfolioCPI: 1.00 },
    { month: 'Jul', portfolioSPI: 1.00, portfolioCPI: 1.02 },
    { month: 'Aug', portfolioSPI: 1.02, portfolioCPI: 1.04 },
    { month: 'Sep', portfolioSPI: 1.01, portfolioCPI: 1.03 },
    { month: 'Oct', portfolioSPI: 0.99, portfolioCPI: 1.01 },
  ];

  const [selectedProgram, setSelectedProgram] = React.useState<string>('all');
  const [selectedMetric, setSelectedMetric] = React.useState<'spi' | 'cpi'>('spi');

  const programs = ['all', ...Array.from(new Set(projects.map(p => p.program)))];

  const filteredProjects = selectedProgram === 'all' 
    ? projects 
    : projects.filter(p => p.program === selectedProgram);

  const currentSPI = trendData[trendData.length - 1].portfolioSPI;
  const currentCPI = trendData[trendData.length - 1].portfolioCPI;
  const priorSPI = trendData[trendData.length - 2].portfolioSPI;
  const priorCPI = trendData[trendData.length - 2].portfolioCPI;
  const spiTrend = ((currentSPI - priorSPI) / priorSPI) * 100;
  const cpiTrend = ((currentCPI - priorCPI) / priorCPI) * 100;

  const getPerformanceColor = (value: number) => {
    if (value >= 1.0) return '#10b981'; // green
    if (value >= 0.95) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'green': return '#10b981';
      case 'yellow': return '#f59e0b';
      case 'red': return '#ef4444';
    }
  };

  const handleExportTrends = () => {
    const csv = [
      ['Month', 'Portfolio SPI', 'Portfolio CPI'],
      ...trendData.map(d => [d.month, d.portfolioSPI, d.portfolioCPI]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-trends-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportHeatmap = () => {
    const csv = [
      ['Project', 'Program', 'SPI', 'CPI', 'Status'],
      ...filteredProjects.map(p => [p.name, p.program, p.spi, p.cpi, p.status]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-heatmap-${selectedProgram}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box>
      <PageHeader
        title="Analytics"
        subtitle="Portfolio performance trends and insights"
        showSearch={false}
      />

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Portfolio SPI</Typography>
              <Typography variant="h4" sx={{ color: getPerformanceColor(currentSPI) }}>
                {currentSPI.toFixed(3)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {spiTrend >= 0 ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography variant="caption" color={spiTrend >= 0 ? 'success.main' : 'error'}>
                  {spiTrend >= 0 ? '+' : ''}{spiTrend.toFixed(2)}% MoM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Portfolio CPI</Typography>
              <Typography variant="h4" sx={{ color: getPerformanceColor(currentCPI) }}>
                {currentCPI.toFixed(3)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {cpiTrend >= 0 ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography variant="caption" color={cpiTrend >= 0 ? 'success.main' : 'error'}>
                  {cpiTrend >= 0 ? '+' : ''}{cpiTrend.toFixed(2)}% MoM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Projects at Risk</Typography>
              <Typography variant="h4" color="error">
                {projects.filter(p => p.status === 'red').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of {projects.length} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">On Track Projects</Typography>
              <Typography variant="h4" color="success.main">
                {projects.filter(p => p.status === 'green').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((projects.filter(p => p.status === 'green').length / projects.length) * 100).toFixed(0)}% of portfolio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portfolio Trends */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Portfolio Performance Trends</Typography>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportTrends}>
              Export CSV
            </Button>
          </Box>

          <LineChart
            height={350}
            series={[
              {
                data: trendData.map(d => d.portfolioSPI),
                label: 'Portfolio SPI',
                color: '#0ea5e9',
                curve: 'linear',
              },
              {
                data: trendData.map(d => d.portfolioCPI),
                label: 'Portfolio CPI',
                color: '#10b981',
                curve: 'linear',
              },
            ]}
            xAxis={[{ scaleType: 'point', data: trendData.map(d => d.month) }]}
            yAxis={[{
              min: 0.85,
              max: 1.15,
            }]}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiLineElement-root': {
                strokeWidth: 3,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Performance Heatmap */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Performance Heatmap</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Program Filter</InputLabel>
                <Select
                  value={selectedProgram}
                  label="Program Filter"
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  <MenuItem value="all">All Programs</MenuItem>
                  {programs.filter(p => p !== 'all').map(program => (
                    <MenuItem key={program} value={program}>{program}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  label="Metric"
                  onChange={(e) => setSelectedMetric(e.target.value as 'spi' | 'cpi')}
                >
                  <MenuItem value="spi">SPI</MenuItem>
                  <MenuItem value="cpi">CPI</MenuItem>
                </Select>
              </FormControl>

              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportHeatmap}>
                Export CSV
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {filteredProjects.map((project) => {
              const metricValue = selectedMetric === 'spi' ? project.spi : project.cpi;
              const metricColor = getPerformanceColor(metricValue);
              
              return (
                <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      borderLeft: 4,
                      borderColor: getStatusColor(project.status),
                      '&:hover': {
                        boxShadow: 3,
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        {project.program}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {selectedMetric.toUpperCase()}
                        </Typography>
                        <Typography variant="h5" sx={{ color: metricColor }}>
                          {metricValue.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Chip 
                          label={`SPI: ${project.spi.toFixed(2)}`} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.7rem',
                            bgcolor: getPerformanceColor(project.spi) + '20',
                            color: getPerformanceColor(project.spi),
                          }}
                        />
                        <Chip 
                          label={`CPI: ${project.cpi.toFixed(2)}`} 
                          size="small"
                          sx={{ 
                            fontSize: '0.7rem',
                            bgcolor: getPerformanceColor(project.cpi) + '20',
                            color: getPerformanceColor(project.cpi),
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {filteredProjects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No projects found for the selected program.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
