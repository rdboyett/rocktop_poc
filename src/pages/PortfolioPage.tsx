import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mockApi, ProjectRow } from '../services/mockApi';
import KPIPill from '../components/evms/shared/KPIPill';
import SparkLine from '../components/evms/shared/SparkLine';
import ExportButton from '../components/evms/shared/ExportButton';

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<ProjectRow[]>([]);
  const [filteredProjects, setFilteredProjects] = React.useState<ProjectRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savedView, setSavedView] = React.useState('all');
  const [searchText, setSearchText] = React.useState('');
  const [programFilter, setProgramFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [spiFilter, setSpiFilter] = React.useState(false);
  const [cpiFilter, setCpiFilter] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    mockApi.getPortfolio().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Program filter
    if (programFilter !== 'all') {
      filtered = filtered.filter(p => p.program === programFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // SPI filter
    if (spiFilter) {
      filtered = filtered.filter(p => p.spi < 1.0);
    }

    // CPI filter
    if (cpiFilter) {
      filtered = filtered.filter(p => p.cpi < 1.0);
    }

    setFilteredProjects(filtered);
  }, [projects, searchText, programFilter, statusFilter, spiFilter, cpiFilter]);

  const uniquePrograms = Array.from(new Set(projects.map(p => p.program)));
  const uniqueStatuses = Array.from(new Set(projects.map(p => p.status)));

  const alerts = filteredProjects
    .filter(p => p.spi < 1.0 || p.cpi < 1.0)
    .flatMap(p => {
      const msgs = [];
      if (p.spi < 1.0) {
        msgs.push(`"${p.name}" SPI is ${p.spi.toFixed(2)} (below 1.0). Investigate schedule slippage.`);
      }
      if (p.cpi < 1.0) {
        msgs.push(`"${p.name}" CPI is ${p.cpi.toFixed(2)} (below 1.0). Costs trending over plan.`);
      }
      return msgs;
    });

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Project',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Box
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate(`/project/${params.row.id}`)}
          >
            {params.value}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {params.row.program} • {params.row.status}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'percent', 
      headerName: '%', 
      width: 80, 
      type: 'number',
      valueFormatter: (value) => `${value}%`,
    },
    {
      field: 'spi',
      headerName: 'SPI',
      width: 100,
      renderCell: (params) => <KPIPill label="" value={params.value} />,
    },
    {
      field: 'spiTrend',
      headerName: 'Spark',
      width: 120,
      sortable: false,
      renderCell: (params) => <SparkLine data={params.value} width={100} height={30} />,
    },
    {
      field: 'cpi',
      headerName: 'CPI',
      width: 100,
      renderCell: (params) => <KPIPill label="" value={params.value} />,
    },
    {
      field: 'cpiTrend',
      headerName: 'Spark',
      width: 120,
      sortable: false,
      renderCell: (params) => <SparkLine data={params.value} width={100} height={30} />,
    },
    {
      field: 'bac',
      headerName: 'BAC',
      width: 130,
      type: 'number',
      valueFormatter: (value) => `$${(value / 1000).toFixed(0)}k`,
    },
    {
      field: 'eac',
      headerName: 'EAC',
      width: 130,
      type: 'number',
      valueFormatter: (value) => `$${(value / 1000).toFixed(0)}k`,
    },
    {
      field: 'vac',
      headerName: 'VAC',
      width: 130,
      type: 'number',
      valueFormatter: (value) => {
        const val = value / 1000;
        return `${val >= 0 ? '+' : ''}$${val.toFixed(0)}k`;
      },
    },
    { field: 'owner', headerName: 'Owner', width: 150 },
  ];

  return (
    <Box sx={{padding: '85px 20px 0 0'}}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Earned Value Management • Portfolio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Scan projects, spot SPI/CPI risk, and jump into details.
        </Typography>
      </Box>

      {/* Toolbar */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" fontWeight={600}>Saved Views</Typography>
              <Select
                value={savedView}
                onChange={(e) => setSavedView(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All projects</MenuItem>
                <MenuItem value="risk">At risk (SPI&lt;1 or CPI&lt;1)</MenuItem>
                <MenuItem value="recent">Updated in last 14 days</MenuItem>
              </Select>
            </Box>
            
            <TextField
              placeholder="Search projects..."
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />

            <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label="v0.1" size="small" color="primary" variant="outlined" />
              <ExportButton data={filteredProjects} filename="portfolio" />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2">Program</Typography>
              <Select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="all">All</MenuItem>
                {uniquePrograms.map(prog => (
                  <MenuItem key={prog} value={prog}>{prog}</MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2">Status</Typography>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="all">All</MenuItem>
                {uniqueStatuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </Box>

            <Chip
              label="SPI < 1"
              onClick={() => setSpiFilter(!spiFilter)}
              color={spiFilter ? 'primary' : 'default'}
              variant={spiFilter ? 'filled' : 'outlined'}
            />
            <Chip
              label="CPI < 1"
              onClick={() => setCpiFilter(!cpiFilter)}
              color={cpiFilter ? 'primary' : 'default'}
              variant={cpiFilter ? 'filled' : 'outlined'}
            />
          </Box>
        </CardContent>
      </Card>

      {/* DataGrid */}
      <DataGrid
        rows={filteredProjects}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />

      {/* Alerts Summary */}
      {alerts.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alerts Summary
            </Typography>
            {alerts.map((alert, idx) => (
              <Alert key={idx} severity="warning" sx={{ mb: 1 }}>
                {alert}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
