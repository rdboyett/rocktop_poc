import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LineChart } from '@mui/x-charts/LineChart';
import { mockApi, ProjectDetail } from '../services/mockApi';
import PageHeader from '../components/layout/PageHeader';
import KPIPill from '../components/evms/shared/KPIPill';

export default function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = React.useState<ProjectDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeWindow, setTimeWindow] = React.useState<number>(12);

  React.useEffect(() => {
    if (projectId) {
      mockApi.getProjectDetail(projectId).then((data) => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [projectId]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!project) {
    return (
      <Box>
        <Alert severity="error">Project not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Portfolio
        </Button>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getVarianceColor = (value: number) => {
    return value >= 0 ? 'success.main' : 'error.main';
  };

  // Prepare chart data
  const chartData = project.series.slice(-timeWindow);
  const xLabels = chartData.map((d) => d.period);
  const pvData = chartData.map((d) => d.pv);
  const evData = chartData.map((d) => d.ev);
  const acData = chartData.map((d) => d.ac);

  // KPI Tiles data
  const kpiTiles = [
    { label: 'PV (Period)', value: formatCurrency(project.kpis.period.pv) },
    { label: 'EV (Period)', value: formatCurrency(project.kpis.period.ev) },
    { label: 'AC (Period)', value: formatCurrency(project.kpis.period.ac) },
    { label: 'SV', value: formatCurrency(project.kpis.period.sv), color: getVarianceColor(project.kpis.period.sv) },
    { label: 'CV', value: formatCurrency(project.kpis.period.cv), color: getVarianceColor(project.kpis.period.cv) },
    { label: 'SPI (Period)', value: project.kpis.period.spi.toFixed(2), pill: true, pillValue: project.kpis.period.spi },
    { label: 'CPI (Period)', value: project.kpis.period.cpi.toFixed(2), pill: true, pillValue: project.kpis.period.cpi },
    { label: 'BAC', value: formatCurrency(project.kpis.bac) },
    { label: 'EAC', value: formatCurrency(project.kpis.eac) },
    { label: 'VAC', value: formatCurrency(project.kpis.vac), color: getVarianceColor(project.kpis.vac) },
  ];

  return (
    <Box>
      <PageHeader
        title={`Project Overview \u2022 ${project.name}`}
        subtitle={`Snapshot of PV/EV/AC, variances, and recent changes. As of ${project.asOf}`}
        showSearch={false}
        actions={
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Portfolio
          </Button>
        }
      />

      {/* KPI Tiles */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {kpiTiles.map((tile, index) => (
          <Grid key={index} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Card>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  {tile.label}
                </Typography>
                {tile.pill && tile.pillValue !== undefined ? (
                  <KPIPill label="" value={tile.pillValue} />
                ) : (
                  <Typography variant="h6" sx={{ color: tile.color || 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                    {tile.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">PV / EV / AC (Monthly)</Typography>
            <Select
              size="small"
              value={timeWindow}
              onChange={(e) => setTimeWindow(Number(e.target.value))}
            >
              <MenuItem value={6}>Last 6 months</MenuItem>
              <MenuItem value={12}>Last 12 months</MenuItem>
              <MenuItem value={24}>Last 24 months</MenuItem>
            </Select>
          </Box>
          <LineChart
            height={300}
            series={[
              { data: pvData, label: 'PV', color: '#6b7280' },
              { data: evData, label: 'EV', color: '#0ea5e9' },
              { data: acData, label: 'AC', color: '#10b981' },
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            sx={{
              '& .MuiLineElement-root': {
                strokeWidth: 2,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Variance Table and Feed */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Variances (Current Period)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>WBS / CA / WP</TableCell>
                    <TableCell align="right">SV</TableCell>
                    <TableCell align="right">CV</TableCell>
                    <TableCell align="right">SPI</TableCell>
                    <TableCell align="right">CPI</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.variances.map((variance, index) => (
                    <TableRow key={index}>
                      <TableCell>{variance.node}</TableCell>
                      <TableCell align="right" sx={{ color: getVarianceColor(variance.sv) }}>
                        {formatCurrency(variance.sv)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: getVarianceColor(variance.cv) }}>
                        {formatCurrency(variance.cv)}
                      </TableCell>
                      <TableCell align="right">
                        <KPIPill label="" value={variance.spi} />
                      </TableCell>
                      <TableCell align="right">
                        <KPIPill label="" value={variance.cpi} />
                      </TableCell>
                      <TableCell>{variance.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What Changed
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {project.feed.map((item, index) => (
                  <Typography
                    key={index}
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
