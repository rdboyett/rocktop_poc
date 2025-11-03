import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UpdateIcon from '@mui/icons-material/Update';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { mockApi, WPDetail } from '../services/mockApi';
import PageHeader from '../components/layout/PageHeader';
import KPIPill from '../components/evms/shared/KPIPill';
import ExportButton from '../components/evms/shared/ExportButton';

export default function WPDetailPage() {
  const { projectId, wpCode } = useParams<{ projectId: string; wpCode: string }>();
  const navigate = useNavigate();
  const [wpData, setWPData] = React.useState<WPDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (wpCode) {
      mockApi.getWPDetail(wpCode).then((data) => {
        setWPData(data);
        setLoading(false);
      });
    }
  }, [wpCode]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!wpData) {
    return (
      <Box>
        <Alert severity="error">Work Package not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
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

  const formatNumber = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Status color
  const statusColor = 
    wpData.status === 'Complete' ? 'success' :
    wpData.status === 'On Track' ? 'success' : 
    wpData.status === 'Watch' ? 'warning' : 'error';

  // Chart data
  const chartData = {
    pv: wpData.series.map(s => s.pv),
    ev: wpData.series.map(s => s.ev),
    ac: wpData.series.map(s => s.ac),
  };
  const xLabels = wpData.series.map(s => s.period);

  // Actuals chart data
  const actualsLabels = wpData.actuals.map(a => a.period);
  const laborCosts = wpData.actuals.map(a => a.laborCost);
  const materialCosts = wpData.actuals.map(a => a.materialCost);
  const otherCosts = wpData.actuals.map(a => a.otherCost);

  // Activity feed icon
  const getFeedIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <FlagIcon fontSize="small" color="primary" />;
      case 'issue':
        return <ErrorOutlineIcon fontSize="small" color="error" />;
      case 'actual':
        return <ReceiptIcon fontSize="small" color="info" />;
      case 'forecast':
        return <TimelineIcon fontSize="small" color="warning" />;
      case 'update':
      default:
        return <UpdateIcon fontSize="small" color="action" />;
    }
  };

  return (
    <Box>
      <PageHeader
        title={`${wpData.code} \u2022 ${wpData.name} \u2022 ${wpData.projectName}`}
        subtitle={`WP Manager: ${wpData.manager} | CA: ${wpData.caId} ${wpData.caName}`}
        showSearch={false}
        actions={
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(`/project/${projectId}/ca/${wpData.caId}`)}
          >
            Back to {wpData.caId}
          </Button>
        }
      />

      <Grid container spacing={2}>
        {/* Status & Progress */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">Work Package Status</Typography>
                  <Chip label={wpData.status} color={statusColor} size="small" />
                  <Chip label={`as of ${wpData.asOf}`} size="small" variant="outlined" />
                </Box>
                <Typography variant="h4" color="primary">
                  {formatNumber(wpData.percentComplete, 1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={wpData.percentComplete} 
                sx={{ height: 10, borderRadius: 1, mb: 2 }} 
              />
              <Typography variant="body2" color="text.secondary">
                {wpData.evMethod.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Schedule Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarTodayIcon color="primary" />
                <Typography variant="h6">Schedule</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Planned Start</Typography>
                  <Typography variant="body2">{wpData.schedule.plannedStart}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Planned Finish</Typography>
                  <Typography variant="body2">{wpData.schedule.plannedFinish}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Actual Start</Typography>
                  <Typography variant="body2">{wpData.schedule.actualStart}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {wpData.schedule.actualFinish ? 'Actual Finish' : 'Forecast Finish'}
                  </Typography>
                  <Typography variant="body2" color={wpData.schedule.actualFinish ? 'success' : 'warning'}>
                    {wpData.schedule.actualFinish || wpData.schedule.forecastFinish}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* EV Method & Milestones */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6">EV Method</Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                <strong>{wpData.evMethod.type}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {wpData.evMethod.description}
              </Typography>
              {wpData.evMethod.milestones && wpData.evMethod.milestones.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Milestones
                  </Typography>
                  <List dense disablePadding>
                    {wpData.evMethod.milestones.map((milestone, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <Box sx={{ mr: 1 }}>
                          {milestone.status === 'complete' ? (
                            <CheckCircleIcon fontSize="small" color="success" />
                          ) : (
                            <PendingIcon fontSize="small" color="action" />
                          )}
                        </Box>
                        <ListItemText
                          primary={`${milestone.name} (${milestone.weight}%)`}
                          secondary={milestone.date}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">BAC</Typography>
                  <Typography variant="h6">{formatCurrency(wpData.kpis.bac)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">PV (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(wpData.kpis.pv_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">EV (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(wpData.kpis.ev_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">AC (cum)</Typography>
                  <Typography variant="h6">{formatCurrency(wpData.kpis.ac_cum)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">SV (cum)</Typography>
                  <Typography variant="h6" color={wpData.kpis.sv_cum < 0 ? 'error' : 'success'}>
                    {formatCurrency(wpData.kpis.sv_cum)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">CV (cum)</Typography>
                  <Typography variant="h6" color={wpData.kpis.cv_cum < 0 ? 'error' : 'success'}>
                    {formatCurrency(wpData.kpis.cv_cum)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">SPI</Typography>
                  <KPIPill label="" value={wpData.kpis.spi} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">CPI</Typography>
                  <KPIPill label="" value={wpData.kpis.cpi} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">Forecast at Completion</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">EAC</Typography>
                  <Typography variant="h5">{formatCurrency(wpData.kpis.eac)}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">ETC</Typography>
                  <Typography variant="h5">{formatCurrency(wpData.kpis.etc)}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">VAC</Typography>
                  <Typography variant="h5" color={wpData.kpis.vac < 0 ? 'error' : 'success'}>
                    {formatCurrency(wpData.kpis.vac)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Feed */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Activity Feed</Typography>
              <List dense>
                {wpData.feed.map((item, idx) => (
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

        {/* PV/EV/AC Chart */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>PV / EV / AC (Monthly)</Typography>
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

        {/* Cost Breakdown Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon color="primary" />
                <Typography variant="h6">Cost Breakdown (Monthly)</Typography>
              </Box>
              <BarChart
                height={300}
                series={[
                  { data: laborCosts, label: 'Labor', stack: 'total', color: '#0ea5e9' },
                  { data: materialCosts, label: 'Material', stack: 'total', color: '#10b981' },
                  { data: otherCosts, label: 'Other', stack: 'total', color: '#f59e0b' },
                ]}
                xAxis={[{ scaleType: 'band', data: actualsLabels }]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Actuals Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Cost Actuals by Period</Typography>
                <ExportButton data={wpData.actuals} filename={`${wpData.code}-actuals`} />
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Labor</TableCell>
                    <TableCell align="right">Material</TableCell>
                    <TableCell align="right">Other</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wpData.actuals.map((actual) => (
                    <TableRow key={actual.period}>
                      <TableCell>{actual.period}</TableCell>
                      <TableCell align="right">{formatNumber(actual.laborHours, 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(actual.laborCost)}</TableCell>
                      <TableCell align="right">{formatCurrency(actual.materialCost)}</TableCell>
                      <TableCell align="right">{formatCurrency(actual.otherCost)}</TableCell>
                      <TableCell align="right"><strong>{formatCurrency(actual.totalCost)}</strong></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
