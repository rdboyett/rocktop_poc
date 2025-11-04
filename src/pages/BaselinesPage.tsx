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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import { BarChart } from '@mui/x-charts/BarChart';
import PageHeader from '../components/layout/PageHeader';

interface Baseline {
  id: string;
  version: string;
  effectiveDate: string;
  bac: number;
  description: string;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

interface WBSDelta {
  wbsCode: string;
  wbsName: string;
  currentBAC: number;
  priorBAC: number;
  delta: number;
  percentChange: number;
}

interface BCR {
  id: string;
  bcrNumber: string;
  title: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  impact: number;
  affectedWBS: string[];
  approver?: string;
  approvalDate?: string;
  reason: string;
}

export default function BaselinesPage() {
  // Mock baselines
  const baselines: Baseline[] = [
    {
      id: '1',
      version: 'Baseline 3.0',
      effectiveDate: '2024-10-31',
      bac: 1250000,
      description: 'Q4 rebaseline - scope addition',
      approved: true,
      approvedBy: 'Jane Smith',
      approvedDate: '2024-10-25',
    },
    {
      id: '2',
      version: 'Baseline 2.0',
      effectiveDate: '2024-07-31',
      bac: 1200000,
      description: 'Mid-year adjustment',
      approved: true,
      approvedBy: 'John Doe',
      approvedDate: '2024-07-20',
    },
    {
      id: '3',
      version: 'Baseline 1.0',
      effectiveDate: '2024-01-31',
      bac: 1150000,
      description: 'Initial project baseline',
      approved: true,
      approvedBy: 'Jane Smith',
      approvedDate: '2024-01-15',
    },
  ];

  // Mock BCRs
  const bcrs: BCR[] = [
    {
      id: '1',
      bcrNumber: 'BCR-2024-005',
      title: 'Add security enhancement module',
      requestedBy: 'Alice Johnson',
      requestDate: '2024-10-15',
      status: 'approved',
      impact: 50000,
      affectedWBS: ['1.2', '1.3'],
      approver: 'Jane Smith',
      approvalDate: '2024-10-20',
      reason: 'New regulatory requirement',
    },
    {
      id: '2',
      bcrNumber: 'BCR-2024-004',
      title: 'Remove deprecated API integration',
      requestedBy: 'Bob Williams',
      requestDate: '2024-09-05',
      status: 'approved',
      impact: -25000,
      affectedWBS: ['1.4'],
      approver: 'John Doe',
      approvalDate: '2024-09-10',
      reason: 'Vendor discontinued service',
    },
    {
      id: '3',
      bcrNumber: 'BCR-2024-006',
      title: 'Add mobile responsiveness',
      requestedBy: 'Carol Davis',
      requestDate: '2024-11-01',
      status: 'pending',
      impact: 75000,
      affectedWBS: ['1.1', '1.2', '1.5'],
      reason: 'Customer request',
    },
    {
      id: '4',
      bcrNumber: 'BCR-2024-003',
      title: 'Accelerate deployment timeline',
      requestedBy: 'David Brown',
      requestDate: '2024-08-10',
      status: 'rejected',
      impact: 0,
      affectedWBS: ['2.1'],
      approver: 'Jane Smith',
      approvalDate: '2024-08-12',
      reason: 'Schedule compression',
    },
  ];

  // Mock WBS deltas
  const wbsDeltas: WBSDelta[] = [
    { wbsCode: '1.1', wbsName: 'System Design', currentBAC: 250000, priorBAC: 240000, delta: 10000, percentChange: 4.17 },
    { wbsCode: '1.2', wbsName: 'Development', currentBAC: 450000, priorBAC: 420000, delta: 30000, percentChange: 7.14 },
    { wbsCode: '1.3', wbsName: 'Testing', currentBAC: 220000, priorBAC: 200000, delta: 20000, percentChange: 10.0 },
    { wbsCode: '1.4', wbsName: 'Integration', currentBAC: 150000, priorBAC: 175000, delta: -25000, percentChange: -14.29 },
    { wbsCode: '1.5', wbsName: 'Deployment', currentBAC: 180000, priorBAC: 165000, delta: 15000, percentChange: 9.09 },
  ];

  const [currentBaseline, setCurrentBaseline] = React.useState(baselines[0].id);
  const [compareBaseline, setCompareBaseline] = React.useState(baselines[1].id);
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const currentBaselineData = baselines.find(b => b.id === currentBaseline);
  const compareBaselineData = baselines.find(b => b.id === compareBaseline);

  const filteredBCRs = bcrs.filter(bcr => filterStatus === 'all' || bcr.status === filterStatus);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: BCR['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
    }
  };

  const getStatusIcon = (status: BCR['status']) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      case 'rejected': return <CancelIcon fontSize="small" />;
    }
  };

  const handleExportDeltas = () => {
    const csv = [
      ['WBS Code', 'WBS Name', 'Current BAC', 'Prior BAC', 'Delta', '% Change'],
      ...wbsDeltas.map(d => [
        d.wbsCode,
        d.wbsName,
        d.currentBAC,
        d.priorBAC,
        d.delta,
        d.percentChange,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baseline-deltas-${currentBaselineData?.version}-vs-${compareBaselineData?.version}.csv`;
    a.click();
  };

  const handleExportBCRs = () => {
    const csv = [
      ['BCR Number', 'Title', 'Requested By', 'Request Date', 'Status', 'Impact', 'Affected WBS', 'Approver', 'Approval Date', 'Reason'],
      ...filteredBCRs.map(bcr => [
        bcr.bcrNumber,
        bcr.title,
        bcr.requestedBy,
        bcr.requestDate,
        bcr.status,
        bcr.impact,
        bcr.affectedWBS.join('; '),
        bcr.approver || '',
        bcr.approvalDate || '',
        bcr.reason,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bcr-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box>
      <PageHeader
        title="Baselines & Change Requests"
        subtitle="Compare baseline versions and track baseline change requests"
        showSearch={false}
      />

      {/* Baseline Comparison */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Baseline Comparison</Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Current Baseline</InputLabel>
                <Select
                  value={currentBaseline}
                  label="Current Baseline"
                  onChange={(e) => setCurrentBaseline(e.target.value)}
                >
                  {baselines.map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.version} - {formatCurrency(b.bac)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CompareArrowsIcon color="action" />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Compare To</InputLabel>
                <Select
                  value={compareBaseline}
                  label="Compare To"
                  onChange={(e) => setCompareBaseline(e.target.value)}
                >
                  {baselines.filter(b => b.id !== currentBaseline).map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.version} - {formatCurrency(b.bac)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {currentBaselineData && compareBaselineData && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Comparing <strong>{currentBaselineData.version}</strong> (effective {currentBaselineData.effectiveDate}) 
                to <strong>{compareBaselineData.version}</strong> (effective {compareBaselineData.effectiveDate})
              </Alert>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Total BAC Change</Typography>
                  <Typography variant="h5" color={currentBaselineData.bac - compareBaselineData.bac >= 0 ? 'primary' : 'error'}>
                    {formatCurrency(currentBaselineData.bac - compareBaselineData.bac)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Current BAC</Typography>
                  <Typography variant="h5">{formatCurrency(currentBaselineData.bac)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Prior BAC</Typography>
                  <Typography variant="h5" color="text.secondary">{formatCurrency(compareBaselineData.bac)}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* WBS Delta Chart */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">BAC Deltas by WBS</Typography>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportDeltas}>
              Export CSV
            </Button>
          </Box>

          <BarChart
            height={300}
            series={[
              {
                data: wbsDeltas.map(d => d.delta / 1000),
                label: 'BAC Delta ($K)',
                color: '#0ea5e9',
              },
            ]}
            xAxis={[{
              scaleType: 'band',
              data: wbsDeltas.map(d => d.wbsCode),
            }]}
          />

          <Box sx={{ overflowX: 'auto', mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>WBS Code</TableCell>
                  <TableCell>WBS Name</TableCell>
                  <TableCell align="right">Current BAC</TableCell>
                  <TableCell align="right">Prior BAC</TableCell>
                  <TableCell align="right">Delta</TableCell>
                  <TableCell align="right">% Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wbsDeltas.map((delta) => (
                  <TableRow key={delta.wbsCode}>
                    <TableCell>{delta.wbsCode}</TableCell>
                    <TableCell>{delta.wbsName}</TableCell>
                    <TableCell align="right">{formatCurrency(delta.currentBAC)}</TableCell>
                    <TableCell align="right">{formatCurrency(delta.priorBAC)}</TableCell>
                    <TableCell align="right">
                      <Typography color={delta.delta >= 0 ? 'success.main' : 'error'}>
                        {delta.delta >= 0 ? '+' : ''}{formatCurrency(delta.delta)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={delta.percentChange >= 0 ? 'success.main' : 'error'}>
                        {formatPercent(delta.percentChange)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* BCR Log */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Baseline Change Requests</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status Filter"
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportBCRs}>
                Export CSV
              </Button>
            </Box>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>BCR #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Impact</TableCell>
                  <TableCell>Affected WBS</TableCell>
                  <TableCell>Approver</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBCRs.map((bcr) => (
                  <TableRow key={bcr.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">{bcr.bcrNumber}</Typography>
                    </TableCell>
                    <TableCell>{bcr.title}</TableCell>
                    <TableCell>{bcr.requestedBy}</TableCell>
                    <TableCell>{bcr.requestDate}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(bcr.status)}
                        label={bcr.status.toUpperCase()}
                        size="small"
                        color={getStatusColor(bcr.status)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={bcr.impact >= 0 ? 'error' : 'success.main'}>
                        {bcr.impact >= 0 ? '+' : ''}{formatCurrency(bcr.impact)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {bcr.affectedWBS.map(wbs => (
                          <Chip key={wbs} label={wbs} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {bcr.approver ? (
                        <Box>
                          <Typography variant="body2">{bcr.approver}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bcr.approvalDate}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {bcr.reason}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {filteredBCRs.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No baseline change requests match the current filter.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
