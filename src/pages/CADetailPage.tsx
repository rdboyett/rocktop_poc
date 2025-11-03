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
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';
import FlagIcon from '@mui/icons-material/Flag';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { LineChart } from '@mui/x-charts/LineChart';
import { mockApi, CADetail } from '../services/mockApi';
import PageHeader from '../components/layout/PageHeader';
import KPIPill from '../components/evms/shared/KPIPill';
import ExportButton from '../components/evms/shared/ExportButton';

export default function CADetailPage() {
  const { projectId, caId } = useParams<{ projectId: string; caId: string }>();
  const navigate = useNavigate();
  const [caData, setCAData] = React.useState<CADetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeWindow, setTimeWindow] = React.useState<number>(12);

  React.useEffect(() => {
    if (caId) {
      mockApi.getCADetail(caId).then((data) => {
        setCAData(data);
        setLoading(false);
      });
    }
  }, [caId]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!caData) {
    return (
      <Box>
        <Alert severity="error">Control Account not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/project/${projectId}/wbs`)}>
          Back to WBS
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Prepare chart data
  const windowedSeries = caData.series.slice(-timeWindow);
  const chartData = {
    pv: windowedSeries.map(s => s.pv),
    ev: windowedSeries.map(s => s.ev),
    ac: windowedSeries.map(s => s.ac),
  };
  const xLabels = windowedSeries.map(s => s.period);

  // Status color
  const statusColor = caData.status === 'On Track' ? 'success' : caData.status === 'Watch' ? 'warning' : 'error';

  // Variance status icons
  const getVarianceIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleOutlineIcon fontSize="small" color="success" />;
      case 'warning':
        return <WarningAmberIcon fontSize="small" color="warning" />;
      case 'critical':
        return <ErrorOutlineIcon fontSize="small" color="error" />;
      default:
        return <InfoOutlinedIcon fontSize="small" />;
    }
  };

  // Activity feed icons
  const getFeedIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <FlagIcon fontSize="small" color="primary" />;
      case 'issue':
        return <ErrorOutlineIcon fontSize="small" color="error" />;
      case 'bcr':
        return <ChangeCircleIcon fontSize="small" color="info" />;
      case 'update':
      default:
        return <UpdateIcon fontSize="small" color="action" />;
    }
  };

  return (
    <Box>
      <PageHeader
        title={`${caData.id} \u2022 ${caData.name} \u2022 ${caData.projectName}`}
        subtitle={`CA Manager: ${caData.manager} | ${caData.startDate} to ${caData.endDate}`}
        showSearch={false}
        actions={
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(`/project/${projectId}/wbs`)}
          >
            Back to WBS
          </Button>
        }
      />

      <Grid container spacing={2}>
        {/* Top Row: Status & Key Metrics */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">Performance Summary</Typography>
                  <Chip label={caData.status} color={statusColor} size="small" />
                  <Chip label={`as of ${caData.asOf}`} size="small" variant="outlined" />
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                {/* Performance Metrics */}
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">BAC</Typography>
                  <Typography variant="h6">{formatCurrency(caData.kpis.bac)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">PV (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(caData.kpis.pv_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">EV (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(caData.kpis.ev_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">AC (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(caData.kpis.ac_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">SV (cum)</Typography>
                  <Typography variant="h6" color={caData.kpis.sv_cum < 0 ? 'error' : 'success'}>
                    {formatCurrency(caData.kpis.sv_cum)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">CV (cum)</Typography>
                  <Typography variant="h6" color={caData.kpis.cv_cum < 0 ? 'error' : 'success'}>
                    {formatCurrency(caData.kpis.cv_cum)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">SPI</Typography>
                  <KPIPill label="" value={caData.kpis.spi} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">CPI</Typography>
                  <KPIPill label="" value={caData.kpis.cpi} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecasts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">Forecast at Completion</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">EAC</Typography>
                  <Typography variant="h5">{formatCurrency(caData.kpis.eac)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">ETC</Typography>
                  <Typography variant="h5">{formatCurrency(caData.kpis.etc)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">VAC</Typography>
                  <Typography variant="h5" color={caData.kpis.vac < 0 ? 'error' : 'success'}>
                    {formatCurrency(caData.kpis.vac)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">TCPI</Typography>
                  <Typography variant="h5">
                    <KPIPill label="" value={caData.kpis.tcpi} />
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Variance Analysis */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Variance Thresholds</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caData.variances.map((variance, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{variance.metric}</TableCell>
                      <TableCell align="right">
                        {variance.metric.includes('$') || variance.metric.includes('Variance') 
                          ? formatCurrency(variance.value) 
                          : formatNumber(variance.value)}
                      </TableCell>
                      <TableCell align="center">{getVarianceIcon(variance.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid size={{ xs: 12 }}>
          <Card>
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
                  { data: chartData.pv, label: 'PV', color: '#6b7280' },
                  { data: chartData.ev, label: 'EV', color: '#0ea5e9' },
                  { data: chartData.ac, label: 'AC', color: '#10b981' },
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
        </Grid>

        {/* Work Packages */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Work Packages</Typography>
                <ExportButton data={caData.workPackages} filename={`${caData.id}-work-packages`} />
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>WP Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Dates</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">BAC</TableCell>
                    <TableCell align="right">EV (cum)</TableCell>
                    <TableCell align="right">SPI</TableCell>
                    <TableCell align="right">CPI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caData.workPackages.map((wp) => (
                    <TableRow 
                      key={wp.code}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/project/${projectId}/wp/${wp.code}`)}
                    >
                      <TableCell>{wp.code}</TableCell>
                      <TableCell>{wp.name}</TableCell>
                      <TableCell>{wp.dates}</TableCell>
                      <TableCell>{wp.method}</TableCell>
                      <TableCell align="right">{formatCurrency(wp.bac)}</TableCell>
                      <TableCell align="right">{formatCurrency(wp.ev_cum)}</TableCell>
                      <TableCell align="right">
                        <KPIPill label="" value={wp.spi} />
                      </TableCell>
                      <TableCell align="right">
                        <KPIPill label="" value={wp.cpi} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Feed */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Activity Feed</Typography>
              <List dense>
                {caData.feed.map((item, idx) => (
                  <ListItem key={idx} sx={{ px: 0 }}>
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      {getFeedIcon(item.type)}
                    </Box>
                    <ListItemText
                      primary={item.message}
                      secondary={item.date}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Variance Comments */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Variance Analysis & Comments</Typography>
              <List>
                {caData.variances.map((variance, idx) => (
                  <ListItem key={idx} sx={{ px: 0, alignItems: 'flex-start' }}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {getVarianceIcon(variance.status)}
                    </Box>
                    <ListItemText
                      primary={variance.metric}
                      secondary={variance.comment}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
