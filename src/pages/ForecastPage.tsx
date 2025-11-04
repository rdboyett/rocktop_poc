import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LineChart } from '@mui/x-charts/LineChart';
import PageHeader from '../components/layout/PageHeader';
import KPIPill from '../components/evms/shared/KPIPill';

type ForecastMethod = 'cpi' | 'spi_cpi' | 'hybrid' | 'manual';

interface Scenario {
  id: string;
  name: string;
  method: ForecastMethod;
  bac: number;
  ev: number;
  ac: number;
  pv: number;
  futureCPI: number;
  futureSPI: number;
  hybridWeight: number;
  riskAdder: number;
  ub: number;
  mr: number;
  includeAdders: boolean;
  eac: number;
  timestamp: Date;
}

export default function ForecastPage() {
  // Base inputs
  const [method, setMethod] = React.useState<ForecastMethod>('cpi');
  const [bac, setBac] = React.useState(1200000);
  const [ev, setEv] = React.useState(815000);
  const [ac, setAc] = React.useState(845000);
  const [pv, setPv] = React.useState(880000);
  const [futureCPI, setFutureCPI] = React.useState(1.0);
  const [futureSPI, setFutureSPI] = React.useState(1.0);
  const [hybridWeight, setHybridWeight] = React.useState(0.5);

  // Adders
  const [riskAdder, setRiskAdder] = React.useState(50000);
  const [ub, setUb] = React.useState(30000);
  const [mr, setMr] = React.useState(20000);
  const [includeAdders, setIncludeAdders] = React.useState(false);

  // Scenarios
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
  const [compareMode, setCompareMode] = React.useState(false);

  // Dialogs
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [scenarioName, setScenarioName] = React.useState('');
  const [commitDialogOpen, setCommitDialogOpen] = React.useState(false);
  const [commitDate, setCommitDate] = React.useState('');
  const [commitNotes, setCommitNotes] = React.useState('');

  // Calculate current performance indices
  const spi = pv > 0 ? ev / pv : 0;
  const cpi = ac > 0 ? ev / ac : 0;

  // Calculate EAC based on method
  const calculateEAC = (): number => {
    const etc = bac - ev;
    let baseEAC = 0;

    switch (method) {
      case 'cpi':
        // EAC = AC + (BAC - EV) / (CPI × futureCPI)
        baseEAC = ac + etc / (cpi * futureCPI);
        break;
      case 'spi_cpi':
        // EAC = AC + (BAC - EV) / (CPI × SPI × futureCPI × futureSPI)
        baseEAC = ac + etc / (cpi * spi * futureCPI * futureSPI);
        break;
      case 'hybrid':
        // Weighted average of CPI and SPI×CPI methods
        const eacCPI = ac + etc / (cpi * futureCPI);
        const eacSPICPI = ac + etc / (cpi * spi * futureCPI * futureSPI);
        baseEAC = eacCPI * hybridWeight + eacSPICPI * (1 - hybridWeight);
        break;
      case 'manual':
        // User enters EAC directly (for now, use CPI method as fallback)
        baseEAC = ac + etc / (cpi * futureCPI);
        break;
    }

    return includeAdders ? baseEAC + riskAdder + ub : baseEAC;
  };

  const eac = calculateEAC();
  const etc = eac - ac;
  const vac = bac - eac;
  const tcpiBAC = (bac - ev) / (bac - ac);
  const tcpiEAC = (bac - ev) / (eac - ac);

  // Historical data (mock)
  const historicalMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const historicalPV = [100, 200, 310, 420, 540, 660, 760, 880, 880, 880];
  const historicalEV = [95, 190, 290, 395, 510, 625, 710, 815, 815, 815];
  const historicalAC = [105, 215, 320, 435, 550, 670, 760, 845, 845, 845];

  // Projected data (simple linear projection)
  const projectedMonths = ['Nov', 'Dec', 'Jan+1', 'Feb+1'];
  const remainingWork = bac - ev;
  const monthsToComplete = 4;
  const monthlyBurn = remainingWork / monthsToComplete;

  const projectedEV = projectedMonths.map((_, i) => ev + monthlyBurn * (i + 1));
  const projectedAC = projectedMonths.map((_, i) => {
    const projEV = ev + monthlyBurn * (i + 1);
    return ac + (projEV - ev) / (futureCPI);
  });

  const allMonths = [...historicalMonths, ...projectedMonths];
  const allPV = [...historicalPV, ...new Array(projectedMonths.length).fill(bac)];
  const allEV = [...historicalEV, ...projectedEV];
  const allAC = [...historicalAC, ...projectedAC];

  const handleSaveScenario = () => {
    const scenario: Scenario = {
      id: Date.now().toString(),
      name: scenarioName || `Scenario ${scenarios.length + 1}`,
      method,
      bac,
      ev,
      ac,
      pv,
      futureCPI,
      futureSPI,
      hybridWeight,
      riskAdder,
      ub,
      mr,
      includeAdders,
      eac,
      timestamp: new Date(),
    };
    setScenarios([...scenarios, scenario]);
    setSaveDialogOpen(false);
    setScenarioName('');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const handleCommit = () => {
    // Validate month-end date
    const date = new Date(commitDate);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (date.getDate() !== lastDay.getDate()) {
      alert('Effective date must be month-end');
      return;
    }

    // Save to localStorage and download
    const commit = {
      version: `v${Date.now()}`,
      effective: commitDate,
      method,
      snapshot: {
        bac, ev, ac, pv, futureCPI, futureSPI,
        riskAdder, ub, mr, includeAdders,
        eac, etc, vac, tcpiBAC, tcpiEAC, spi, cpi,
      },
      notes: commitNotes,
      committed_at: new Date().toISOString(),
      committed_by: 'Current User',
    };

    // Save to localStorage
    const commits = JSON.parse(localStorage.getItem('rocktop_commits') || '[]');
    commits.push(commit);
    localStorage.setItem('rocktop_commits', JSON.stringify(commits));

    // Download JSON
    const blob = new Blob([JSON.stringify(commit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-commit-${commit.version}.json`;
    a.click();

    setCommitDialogOpen(false);
    setCommitDate('');
    setCommitNotes('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getMethodLabel = (m: ForecastMethod) => {
    switch (m) {
      case 'cpi': return 'CPI Method';
      case 'spi_cpi': return 'SPI × CPI Method';
      case 'hybrid': return 'Hybrid (Weighted)';
      case 'manual': return 'Manual Entry';
    }
  };

  return (
    <Box>
      <PageHeader
        title="Forecasting & EAC Sandbox"
        subtitle="Interactive forecast simulator with scenario management"
        showSearch={false}
      />

      <Grid container spacing={2}>
        {/* Left Panel: Inputs */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Base Inputs</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Forecast Method</InputLabel>
                <Select
                  value={method}
                  label="Forecast Method"
                  onChange={(e) => setMethod(e.target.value as ForecastMethod)}
                >
                  <MenuItem value="cpi">CPI Method</MenuItem>
                  <MenuItem value="spi_cpi">SPI × CPI Method</MenuItem>
                  <MenuItem value="hybrid">Hybrid (Weighted)</MenuItem>
                  <MenuItem value="manual">Manual Entry</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="BAC"
                type="number"
                value={bac}
                onChange={(e) => setBac(Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="EV (Cumulative)"
                type="number"
                value={ev}
                onChange={(e) => setEv(Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="AC (Cumulative)"
                type="number"
                value={ac}
                onChange={(e) => setAc(Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="PV (Cumulative)"
                type="number"
                value={pv}
                onChange={(e) => setPv(Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Future CPI: {futureCPI.toFixed(2)}
              </Typography>
              <Slider
                value={futureCPI}
                onChange={(e, val) => setFutureCPI(val as number)}
                min={0.5}
                max={1.5}
                step={0.01}
                marks={[
                  { value: 0.5, label: '0.5' },
                  { value: 1.0, label: '1.0' },
                  { value: 1.5, label: '1.5' },
                ]}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Future SPI: {futureSPI.toFixed(2)}
              </Typography>
              <Slider
                value={futureSPI}
                onChange={(e, val) => setFutureSPI(val as number)}
                min={0.5}
                max={1.5}
                step={0.01}
                marks={[
                  { value: 0.5, label: '0.5' },
                  { value: 1.0, label: '1.0' },
                  { value: 1.5, label: '1.5' },
                ]}
                sx={{ mb: 2 }}
                disabled={method !== 'spi_cpi' && method !== 'hybrid'}
              />

              {method === 'hybrid' && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Hybrid Weight (CPI): {hybridWeight.toFixed(2)}
                  </Typography>
                  <Slider
                    value={hybridWeight}
                    onChange={(e, val) => setHybridWeight(val as number)}
                    min={0}
                    max={1}
                    step={0.1}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 0.5, label: '50%' },
                      { value: 1, label: '100%' },
                    ]}
                    sx={{ mb: 2 }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Adders</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeAdders}
                      onChange={(e) => setIncludeAdders(e.target.checked)}
                    />
                  }
                  label="Include"
                />
              </Box>

              <TextField
                fullWidth
                label="Risk Adder"
                type="number"
                value={riskAdder}
                onChange={(e) => setRiskAdder(Number(e.target.value))}
                disabled={!includeAdders}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Undistributed Budget"
                type="number"
                value={ub}
                onChange={(e) => setUb(Number(e.target.value))}
                disabled={!includeAdders}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Management Reserve"
                type="number"
                value={mr}
                onChange={(e) => setMr(Number(e.target.value))}
                disabled
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                helperText="Read-only"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel: Results */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* KPIs */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Forecast Results</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">SPI</Typography>
                  <KPIPill label="" value={spi} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">CPI</Typography>
                  <KPIPill label="" value={cpi} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">EAC</Typography>
                  <Typography variant="h6">{formatCurrency(eac)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">ETC</Typography>
                  <Typography variant="h6">{formatCurrency(etc)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">VAC</Typography>
                  <Typography variant="h6" color={vac < 0 ? 'error' : 'success.main'}>
                    {formatCurrency(vac)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">TCPI (BAC)</Typography>
                  <KPIPill label="" value={tcpiBAC} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">TCPI (EAC)</Typography>
                  <KPIPill label="" value={tcpiEAC} />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => setSaveDialogOpen(true)}>
                  Save Scenario
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CompareArrowsIcon />}
                  onClick={() => setCompareMode(!compareMode)}
                  disabled={scenarios.length === 0}
                >
                  Compare ({scenarios.length})
                </Button>
                <Button variant="contained" onClick={() => setCommitDialogOpen(true)}>
                  Commit Forecast
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Historical & Projected Performance</Typography>
              <LineChart
                height={300}
                series={[
                  { data: allPV, label: 'PV', color: '#6b7280' },
                  { data: allEV, label: 'EV', color: '#0ea5e9' },
                  { data: allAC, label: 'AC', color: '#10b981' },
                ]}
                xAxis={[{ scaleType: 'point', data: allMonths }]}
                sx={{
                  '& .MuiLineElement-root': {
                    strokeWidth: 2,
                  },
                }}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Historical data shown in solid lines. Projected data based on current forecast method.
              </Alert>
            </CardContent>
          </Card>

          {/* Scenario Comparison */}
          {compareMode && scenarios.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Scenario Comparison</Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Scenario</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell align="right">EAC</TableCell>
                        <TableCell align="right">VAC</TableCell>
                        <TableCell align="right">Future CPI</TableCell>
                        <TableCell>Adders</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenarios.map((scenario) => (
                        <TableRow key={scenario.id}>
                          <TableCell>{scenario.name}</TableCell>
                          <TableCell>{getMethodLabel(scenario.method)}</TableCell>
                          <TableCell align="right">{formatCurrency(scenario.eac)}</TableCell>
                          <TableCell align="right">
                            <Typography color={scenario.bac - scenario.eac < 0 ? 'error' : 'success.main'}>
                              {formatCurrency(scenario.bac - scenario.eac)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{scenario.futureCPI.toFixed(2)}</TableCell>
                          <TableCell>
                            {scenario.includeAdders ? (
                              <Chip label="Included" size="small" color="primary" />
                            ) : (
                              <Chip label="Excluded" size="small" />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleDeleteScenario(scenario.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Save Scenario Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Scenario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Scenario Name"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder={`Scenario ${scenarios.length + 1}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveScenario}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Commit Dialog */}
      <Dialog open={commitDialogOpen} onClose={() => setCommitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Commit Forecast</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Committing will create a version snapshot and save to localStorage.
          </Alert>

          <TextField
            fullWidth
            label="Effective Date"
            type="date"
            value={commitDate}
            onChange={(e) => setCommitDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText="Must be month-end"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={commitNotes}
            onChange={(e) => setCommitNotes(e.target.value)}
            placeholder="Add notes about this forecast commit..."
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Snapshot Summary:
            </Typography>
            <Typography variant="body2">Method: {getMethodLabel(method)}</Typography>
            <Typography variant="body2">EAC: {formatCurrency(eac)}</Typography>
            <Typography variant="body2">VAC: {formatCurrency(vac)}</Typography>
            <Typography variant="body2">Adders: {includeAdders ? 'Included' : 'Excluded'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCommit} disabled={!commitDate}>
            Commit & Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
