import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PageHeader from '../../components/layout/PageHeader';
import KPIPill from '../../components/evms/shared/KPIPill';

interface CPRRow {
  wbsId: string;
  wbsName: string;
  level: number;
  bcws: number; // Budgeted Cost of Work Scheduled (PV)
  bcwp: number; // Budgeted Cost of Work Performed (EV)
  acwp: number; // Actual Cost of Work Performed (AC)
  sv: number;   // Schedule Variance
  cv: number;   // Cost Variance
  bac: number;  // Budget at Completion
  eac: number;  // Estimate at Completion
  vac: number;  // Variance at Completion
}

// Mock CPR data
const mockCPRData: CPRRow[] = [
  {
    wbsId: '1.0',
    wbsName: 'Avionics',
    level: 1,
    bcws: 180000,
    bcwp: 168000,
    acwp: 176000,
    sv: -12000,
    cv: -8000,
    bac: 250000,
    eac: 260000,
    vac: -10000,
  },
  {
    wbsId: '1.1',
    wbsName: 'Flight Controls',
    level: 2,
    bcws: 108000,
    bcwp: 100000,
    acwp: 105000,
    sv: -8000,
    cv: -5000,
    bac: 150000,
    eac: 157500,
    vac: -7500,
  },
  {
    wbsId: 'CA-101',
    wbsName: 'Sensors',
    level: 3,
    bcws: 65000,
    bcwp: 62000,
    acwp: 68000,
    sv: -3000,
    cv: -6000,
    bac: 90000,
    eac: 98900,
    vac: -8900,
  },
  {
    wbsId: 'CA-102',
    wbsName: 'Actuators',
    level: 3,
    bcws: 43000,
    bcwp: 38000,
    acwp: 37000,
    sv: -5000,
    cv: 1000,
    bac: 60000,
    eac: 58250,
    vac: 1750,
  },
  {
    wbsId: '1.2',
    wbsName: 'Software',
    level: 2,
    bcws: 72000,
    bcwp: 68000,
    acwp: 71000,
    sv: -4000,
    cv: -3000,
    bac: 100000,
    eac: 104200,
    vac: -4200,
  },
  {
    wbsId: 'CA-105',
    wbsName: 'Navigation SW',
    level: 3,
    bcws: 72000,
    bcwp: 68000,
    acwp: 71000,
    sv: -4000,
    cv: -3000,
    bac: 100000,
    eac: 104200,
    vac: -4200,
  },
];

export default function CPRFormat1Page() {
  const navigate = useNavigate();
  const [project, setProject] = React.useState('alpha');
  const [asOfDate, setAsOfDate] = React.useState('2025-10');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateSPI = (bcws: number, bcwp: number) => {
    return bcws > 0 ? bcwp / bcws : 0;
  };

  const calculateCPI = (bcwp: number, acwp: number) => {
    return acwp > 0 ? bcwp / acwp : 0;
  };

  const handleExport = () => {
    // Implement CSV export
    console.log('Exporting CPR Format 1...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      <PageHeader
        title="CPR Format 1 - WBS"
        subtitle="Cost Performance Report - Cumulative performance by Work Breakdown Structure"
        showSearch={false}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<PrintIcon />}
              variant="outlined"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              startIcon={<FileDownloadIcon />}
              variant="outlined"
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => navigate('/reports')}
            >
              Back to Reports
            </Button>
          </Box>
        }
      />

      {/* Report Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={project}
                label="Project"
                onChange={(e) => setProject(e.target.value)}
              >
                <MenuItem value="alpha">Project Alpha</MenuItem>
                <MenuItem value="beta">Project Beta</MenuItem>
                <MenuItem value="gamma">Project Gamma</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>As of Date</InputLabel>
              <Select
                value={asOfDate}
                label="As of Date"
                onChange={(e) => setAsOfDate(e.target.value)}
              >
                <MenuItem value="2025-10">Oct 2025</MenuItem>
                <MenuItem value="2025-09">Sep 2025</MenuItem>
                <MenuItem value="2025-08">Aug 2025</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <Chip label={`Report Date: ${new Date().toLocaleDateString()}`} />
          </Box>
        </CardContent>
      </Card>

      {/* CPR Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Project Alpha - Cumulative Performance
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            All amounts in USD | As of: {asOfDate}
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>WBS</TableCell>
                  <TableCell>Element Name</TableCell>
                  <TableCell align="right">BCWS</TableCell>
                  <TableCell align="right">BCWP</TableCell>
                  <TableCell align="right">ACWP</TableCell>
                  <TableCell align="right">SV</TableCell>
                  <TableCell align="right">CV</TableCell>
                  <TableCell align="center">SPI</TableCell>
                  <TableCell align="center">CPI</TableCell>
                  <TableCell align="right">BAC</TableCell>
                  <TableCell align="right">EAC</TableCell>
                  <TableCell align="right">VAC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCPRData.map((row) => {
                  const spi = calculateSPI(row.bcws, row.bcwp);
                  const cpi = calculateCPI(row.bcwp, row.acwp);
                  
                  return (
                    <TableRow 
                      key={row.wbsId}
                      sx={{
                        bgcolor: row.level === 1 ? 'action.hover' : 'transparent',
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={row.level === 1 ? 700 : row.level === 2 ? 600 : 400}
                          sx={{ pl: (row.level - 1) * 2 }}
                        >
                          {row.wbsId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={row.level === 1 ? 700 : row.level === 2 ? 600 : 400}
                        >
                          {row.wbsName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(row.bcws)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.bcwp)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.acwp)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: row.sv < 0 ? 'error.main' : 'success.main',
                          fontWeight: Math.abs(row.sv) > 5000 ? 600 : 400,
                        }}
                      >
                        {formatCurrency(row.sv)}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: row.cv < 0 ? 'error.main' : 'success.main',
                          fontWeight: Math.abs(row.cv) > 5000 ? 600 : 400,
                        }}
                      >
                        {formatCurrency(row.cv)}
                      </TableCell>
                      <TableCell align="center">
                        <KPIPill label="" value={spi} />
                      </TableCell>
                      <TableCell align="center">
                        <KPIPill label="" value={cpi} />
                      </TableCell>
                      <TableCell align="right">{formatCurrency(row.bac)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.eac)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: row.vac < 0 ? 'error.main' : 'success.main',
                          fontWeight: Math.abs(row.vac) > 5000 ? 600 : 400,
                        }}
                      >
                        {formatCurrency(row.vac)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              <strong>Legend:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                BCWS = Budgeted Cost of Work Scheduled (Planned Value)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                BCWP = Budgeted Cost of Work Performed (Earned Value)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ACWP = Actual Cost of Work Performed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SV = Schedule Variance (BCWP - BCWS)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CV = Cost Variance (BCWP - ACWP)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SPI = Schedule Performance Index (BCWP / BCWS)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CPI = Cost Performance Index (BCWP / ACWP)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
