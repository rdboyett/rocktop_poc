import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import PageHeader from '../components/layout/PageHeader';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'active' | 'acknowledged';

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedItem: string;
  affectedType: 'project' | 'ca' | 'wp';
  projectId: string;
  itemId: string;
  timestamp: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export default function AlertsPage() {
  const navigate = useNavigate();

  // Mock alerts
  const allAlerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'SPI Below Critical Threshold',
      description: 'Schedule Performance Index has dropped below 0.85',
      affectedItem: 'Project Alpha',
      affectedType: 'project',
      projectId: 'proj-alpha',
      itemId: 'proj-alpha',
      timestamp: '2024-11-03T14:30:00Z',
      status: 'active',
    },
    {
      id: '2',
      severity: 'high',
      title: 'Cost Overrun Detected',
      description: 'Actual costs exceed planned by 15%',
      affectedItem: 'WP 1.2.3 - Backend Development',
      affectedType: 'wp',
      projectId: 'proj-alpha',
      itemId: 'WP-1.2.3',
      timestamp: '2024-11-03T12:15:00Z',
      status: 'active',
    },
    {
      id: '3',
      severity: 'medium',
      title: 'Milestone At Risk',
      description: 'Milestone completion date in jeopardy based on current progress',
      affectedItem: 'CA 1.2 - Software Development',
      affectedType: 'ca',
      projectId: 'proj-alpha',
      itemId: 'CA-1.2',
      timestamp: '2024-11-03T10:00:00Z',
      status: 'acknowledged',
      acknowledgedBy: 'John Doe',
      acknowledgedAt: '2024-11-03T11:00:00Z',
    },
    {
      id: '4',
      severity: 'critical',
      title: 'Negative Cash Flow Projected',
      description: 'EAC exceeds contract value by $250K',
      affectedItem: 'Project Beta',
      affectedType: 'project',
      projectId: 'proj-beta',
      itemId: 'proj-beta',
      timestamp: '2024-11-02T16:45:00Z',
      status: 'active',
    },
    {
      id: '5',
      severity: 'high',
      title: 'TCPI Above 1.2',
      description: 'To-Complete Performance Index indicates unrealistic remaining work efficiency',
      affectedItem: 'CA 2.1 - Testing',
      affectedType: 'ca',
      projectId: 'proj-beta',
      itemId: 'CA-2.1',
      timestamp: '2024-11-02T14:20:00Z',
      status: 'active',
    },
    {
      id: '6',
      severity: 'medium',
      title: 'Resource Utilization Low',
      description: 'Work package shows 40% lower progress than planned',
      affectedItem: 'WP 2.3.1 - Integration Testing',
      affectedType: 'wp',
      projectId: 'proj-beta',
      itemId: 'WP-2.3.1',
      timestamp: '2024-11-02T09:30:00Z',
      status: 'acknowledged',
      acknowledgedBy: 'Jane Smith',
      acknowledgedAt: '2024-11-02T10:00:00Z',
    },
    {
      id: '7',
      severity: 'low',
      title: 'Schedule Variance Increasing',
      description: 'SV has increased by 5% over the past month',
      affectedItem: 'Project Gamma',
      affectedType: 'project',
      projectId: 'proj-gamma',
      itemId: 'proj-gamma',
      timestamp: '2024-11-01T11:00:00Z',
      status: 'acknowledged',
      acknowledgedBy: 'Alice Johnson',
      acknowledgedAt: '2024-11-01T15:30:00Z',
    },
    {
      id: '8',
      severity: 'high',
      title: 'Baseline Change Pending',
      description: 'BCR-2024-006 requires approval within 48 hours',
      affectedItem: 'Project Alpha',
      affectedType: 'project',
      projectId: 'proj-alpha',
      itemId: 'proj-alpha',
      timestamp: '2024-11-01T08:00:00Z',
      status: 'active',
    },
  ];

  const [severityFilter, setSeverityFilter] = React.useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<AlertStatus | 'all'>('all');

  const filteredAlerts = allAlerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = allAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const highCount = allAlerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  const activeCount = allAlerts.filter(a => a.status === 'active').length;
  const acknowledgedCount = allAlerts.filter(a => a.status === 'acknowledged').length;

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon fontSize="small" />;
      case 'high':
        return <WarningIcon fontSize="small" />;
      case 'medium':
        return <InfoIcon fontSize="small" />;
      case 'low':
        return <InfoIcon fontSize="small" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    // In real app, would make API call
    console.log('Acknowledging alert:', alertId);
  };

  const handleNavigate = (alert: Alert) => {
    switch (alert.affectedType) {
      case 'project':
        navigate(`/project/${alert.projectId}`);
        break;
      case 'ca':
        navigate(`/project/${alert.projectId}/ca/${alert.itemId}`);
        break;
      case 'wp':
        navigate(`/project/${alert.projectId}/wp/${alert.itemId}`);
        break;
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Severity', 'Title', 'Description', 'Affected Item', 'Type', 'Timestamp', 'Status', 'Acknowledged By', 'Acknowledged At'],
      ...filteredAlerts.map(alert => [
        alert.id,
        alert.severity,
        alert.title,
        alert.description,
        alert.affectedItem,
        alert.affectedType,
        alert.timestamp,
        alert.status,
        alert.acknowledgedBy || '',
        alert.acknowledgedAt || '',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box>
      <PageHeader
        title="Alerts Center"
        subtitle="Monitor and manage system alerts across all projects"
        showSearch={false}
      />

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="caption" color="text.secondary">Critical Alerts</Typography>
              </Box>
              <Typography variant="h3" color="error">{criticalCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WarningIcon color="warning" />
                <Typography variant="caption" color="text.secondary">High Priority</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">{highCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoIcon color="info" />
                <Typography variant="caption" color="text.secondary">Active Alerts</Typography>
              </Box>
              <Typography variant="h3" color="info.main">{activeCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="caption" color="text.secondary">Acknowledged</Typography>
              </Box>
              <Typography variant="h3" color="success.main">{acknowledgedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6">All Alerts</Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="acknowledged">Acknowledged</MenuItem>
                </Select>
              </FormControl>

              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExport}>
                Export
              </Button>
            </Box>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Severity</TableCell>
                  <TableCell>Alert</TableCell>
                  <TableCell>Affected Item</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow
                    key={alert.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell>
                      <Chip
                        icon={getSeverityIcon(alert.severity)}
                        label={alert.severity.toUpperCase()}
                        size="small"
                        color={getSeverityColor(alert.severity)}
                        sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{alert.affectedItem}</Typography>
                      <Chip
                        label={alert.affectedType.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      {alert.status === 'active' ? (
                        <Chip label="Active" size="small" color="error" variant="outlined" />
                      ) : (
                        <Box>
                          <Chip label="Acknowledged" size="small" color="success" variant="outlined" />
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            by {alert.acknowledgedBy}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatTimestamp(alert.timestamp)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleNavigate(alert)}>
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {alert.status === 'active' && (
                          <Tooltip title="Acknowledge">
                            <IconButton size="small" onClick={() => handleAcknowledge(alert.id)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {filteredAlerts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No alerts match the current filters.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
