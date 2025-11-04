import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageHeader from '../components/layout/PageHeader';

const steps = [
  'Project Details',
  'Baseline & Budget',
  'Schedule',
  'Control Accounts',
  'Review & Create',
];

interface WBSNode {
  code: string;
  name: string;
  bac: number;
}

interface CAAssignment {
  caCode: string;
  caName: string;
  manager: string;
  wbsElements: string[];
}

export default function SetupWizardPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  // Step 1: Project Details
  const [projectName, setProjectName] = React.useState('');
  const [projectCode, setProjectCode] = React.useState('');
  const [program, setProgram] = React.useState('');
  const [customer, setCustomer] = React.useState('');
  const [contractValue, setContractValue] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Step 2: Baseline & Budget
  const [bac, setBac] = React.useState('');
  const [pmb, setPmb] = React.useState('');
  const [mr, setMr] = React.useState('');
  const [ub, setUb] = React.useState('');
  const [baselineDate, setBaselineDate] = React.useState('');

  // Step 3: Schedule
  const [scheduleFile, setScheduleFile] = React.useState<File | null>(null);
  const [scheduleType, setScheduleType] = React.useState('p6');
  const [dataDate, setDataDate] = React.useState('');

  // Step 4: Control Accounts
  const [wbsNodes, setWbsNodes] = React.useState<WBSNode[]>([
    { code: '1.1', name: 'System Design', bac: 250000 },
    { code: '1.2', name: 'Development', bac: 450000 },
    { code: '1.3', name: 'Testing', bac: 200000 },
  ]);
  const [caAssignments, setCaAssignments] = React.useState<CAAssignment[]>([
    { caCode: 'CA-1.1', caName: 'Design Phase', manager: 'John Doe', wbsElements: ['1.1'] },
    { caCode: 'CA-1.2', caName: 'Development Phase', manager: 'Jane Smith', wbsElements: ['1.2'] },
  ]);

  const [newWbs, setNewWbs] = React.useState({ code: '', name: '', bac: '' });
  const [newCA, setNewCA] = React.useState({ caCode: '', caName: '', manager: '', wbsElements: [] as string[] });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddWBS = () => {
    if (newWbs.code && newWbs.name && newWbs.bac) {
      setWbsNodes([...wbsNodes, { ...newWbs, bac: Number(newWbs.bac) }]);
      setNewWbs({ code: '', name: '', bac: '' });
    }
  };

  const handleDeleteWBS = (code: string) => {
    setWbsNodes(wbsNodes.filter(w => w.code !== code));
  };

  const handleAddCA = () => {
    if (newCA.caCode && newCA.caName && newCA.manager && newCA.wbsElements.length > 0) {
      setCaAssignments([...caAssignments, newCA]);
      setNewCA({ caCode: '', caName: '', manager: '', wbsElements: [] });
    }
  };

  const handleDeleteCA = (caCode: string) => {
    setCaAssignments(caAssignments.filter(ca => ca.caCode !== caCode));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setScheduleFile(event.target.files[0]);
    }
  };

  const handleCreate = () => {
    // In real app, would make API call to create project
    console.log('Creating project with data:', {
      projectName,
      projectCode,
      program,
      customer,
      contractValue,
      startDate,
      endDate,
      bac,
      pmb,
      mr,
      ub,
      baselineDate,
      scheduleFile,
      scheduleType,
      dataDate,
      wbsNodes,
      caAssignments,
    });

    // Navigate to new project
    navigate('/project/new-project-id');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return projectName && projectCode && program && customer && contractValue && startDate && endDate;
      case 1:
        return bac && pmb && baselineDate;
      case 2:
        return scheduleFile && dataDate;
      case 3:
        return wbsNodes.length > 0 && caAssignments.length > 0;
      default:
        return true;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalBAC = wbsNodes.reduce((sum, node) => sum + node.bac, 0);

  return (
    <Box>
      <PageHeader
        title="Project Setup Wizard"
        subtitle="Create a new project with guided configuration"
        showSearch={false}
      />

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Project Details</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter basic project information and contract details.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Project Code"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Customer"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contract Value"
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Baseline & Budget</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set the performance measurement baseline and budget allocations.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Budget at Completion (BAC)"
                    type="number"
                    value={bac}
                    onChange={(e) => setBac(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Performance Measurement Baseline (PMB)"
                    type="number"
                    value={pmb}
                    onChange={(e) => setPmb(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Management Reserve (MR)"
                    type="number"
                    value={mr}
                    onChange={(e) => setMr(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    helperText="Optional"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Undistributed Budget (UB)"
                    type="number"
                    value={ub}
                    onChange={(e) => setUb(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    helperText="Optional"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Baseline Date"
                    type="date"
                    value={baselineDate}
                    onChange={(e) => setBaselineDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>

              {bac && pmb && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  BAC = PMB + MR + UB: ${Number(bac).toLocaleString()} = ${Number(pmb).toLocaleString()} + ${Number(mr || 0).toLocaleString()} + ${Number(ub || 0).toLocaleString()}
                </Alert>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Schedule Integration</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your project schedule file for integration.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Schedule Type</InputLabel>
                    <Select
                      value={scheduleType}
                      label="Schedule Type"
                      onChange={(e) => setScheduleType(e.target.value)}
                    >
                      <MenuItem value="p6">Primavera P6 (.xer)</MenuItem>
                      <MenuItem value="msp">Microsoft Project (.mpp)</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Data Date"
                    type="date"
                    value={dataDate}
                    onChange={(e) => setDataDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="As-of date for schedule data"
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 100, borderStyle: 'dashed' }}
                  >
                    {scheduleFile ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2">{scheduleFile.name}</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <AddIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2">Click to upload schedule file</Typography>
                      </Box>
                    )}
                    <input type="file" hidden onChange={handleFileChange} accept=".xer,.mpp,.csv" />
                  </Button>
                </Grid>
              </Grid>

              {scheduleFile && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  File ready for upload: {scheduleFile.name} ({(scheduleFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Control Account Setup</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Define WBS structure and assign control account managers.
              </Typography>

              {/* WBS Nodes */}
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 3 }}>
                WBS Structure
              </Typography>
              <Box sx={{ overflowX: 'auto', mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>WBS Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">BAC</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wbsNodes.map((node) => (
                      <TableRow key={node.code}>
                        <TableCell>{node.code}</TableCell>
                        <TableCell>{node.name}</TableCell>
                        <TableCell align="right">{formatCurrency(node.bac)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleDeleteWBS(node.code)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="1.4"
                          value={newWbs.code}
                          onChange={(e) => setNewWbs({ ...newWbs, code: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Element Name"
                          value={newWbs.name}
                          onChange={(e) => setNewWbs({ ...newWbs, name: e.target.value })}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          placeholder="0"
                          value={newWbs.bac}
                          onChange={(e) => setNewWbs({ ...newWbs, bac: e.target.value })}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={handleAddWBS} color="primary">
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Total WBS BAC: {formatCurrency(totalBAC)}
              </Alert>

              {/* Control Accounts */}
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Control Account Assignments
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>CA Code</TableCell>
                      <TableCell>CA Name</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>WBS Elements</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {caAssignments.map((ca) => (
                      <TableRow key={ca.caCode}>
                        <TableCell>{ca.caCode}</TableCell>
                        <TableCell>{ca.caName}</TableCell>
                        <TableCell>{ca.manager}</TableCell>
                        <TableCell>
                          {ca.wbsElements.map(wbs => (
                            <Chip key={wbs} label={wbs} size="small" sx={{ mr: 0.5 }} />
                          ))}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleDeleteCA(ca.caCode)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {activeStep === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>Review & Create</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review your project configuration before creating.
              </Typography>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Project Details
                      </Typography>
                      <Typography variant="body2"><strong>Name:</strong> {projectName}</Typography>
                      <Typography variant="body2"><strong>Code:</strong> {projectCode}</Typography>
                      <Typography variant="body2"><strong>Program:</strong> {program}</Typography>
                      <Typography variant="body2"><strong>Customer:</strong> {customer}</Typography>
                      <Typography variant="body2"><strong>Contract Value:</strong> ${Number(contractValue).toLocaleString()}</Typography>
                      <Typography variant="body2"><strong>Duration:</strong> {startDate} to {endDate}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Budget & Baseline
                      </Typography>
                      <Typography variant="body2"><strong>BAC:</strong> ${Number(bac).toLocaleString()}</Typography>
                      <Typography variant="body2"><strong>PMB:</strong> ${Number(pmb).toLocaleString()}</Typography>
                      <Typography variant="body2"><strong>MR:</strong> ${Number(mr || 0).toLocaleString()}</Typography>
                      <Typography variant="body2"><strong>UB:</strong> ${Number(ub || 0).toLocaleString()}</Typography>
                      <Typography variant="body2"><strong>Baseline Date:</strong> {baselineDate}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Schedule
                      </Typography>
                      <Typography variant="body2"><strong>File:</strong> {scheduleFile?.name}</Typography>
                      <Typography variant="body2"><strong>Type:</strong> {scheduleType.toUpperCase()}</Typography>
                      <Typography variant="body2"><strong>Data Date:</strong> {dataDate}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        WBS & Control Accounts
                      </Typography>
                      <Typography variant="body2"><strong>WBS Elements:</strong> {wbsNodes.length}</Typography>
                      <Typography variant="body2"><strong>Control Accounts:</strong> {caAssignments.length}</Typography>
                      <Typography variant="body2"><strong>Total WBS BAC:</strong> {formatCurrency(totalBAC)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Alert severity="success" sx={{ mt: 3 }}>
                All configuration is complete. Click "Create Project" to finalize.
              </Alert>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep < steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  Next
                </Button>
              )}
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCreate}
                  startIcon={<CheckCircleIcon />}
                >
                  Create Project
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
