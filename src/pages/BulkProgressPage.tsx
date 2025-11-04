import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PageHeader from '../components/layout/PageHeader';
import ExportButton from '../components/evms/shared/ExportButton';

interface WorkPackageRow {
  id: string;
  wbs: string;
  wbsName: string;
  code: string;
  name: string;
  currentPercent: number;
  newPercent: number | null;
  notes: string;
  manager: string;
}

interface PendingChange {
  id: string;
  code: string;
  name: string;
  currentPercent: number;
  newPercent: number;
}

// Mock data
const mockWorkPackages: WorkPackageRow[] = [
  {
    id: '1',
    wbs: '1.1',
    wbsName: 'Flight Controls',
    code: 'WP-301',
    name: 'Guidance Logic',
    currentPercent: 77.5,
    newPercent: null,
    notes: '',
    manager: 'Tom Anderson',
  },
  {
    id: '2',
    wbs: '1.1',
    wbsName: 'Flight Controls',
    code: 'WP-302',
    name: 'Sensor Fusion',
    currentPercent: 50,
    newPercent: null,
    notes: '',
    manager: 'Lisa Chen',
  },
  {
    id: '3',
    wbs: '1.1',
    wbsName: 'Flight Controls',
    code: 'WP-321',
    name: 'Servo Control',
    currentPercent: 80,
    newPercent: null,
    notes: '',
    manager: 'Marcus Thompson',
  },
  {
    id: '4',
    wbs: '1.1',
    wbsName: 'Flight Controls',
    code: 'WP-322',
    name: 'Torque Tuning',
    currentPercent: 40,
    newPercent: null,
    notes: '',
    manager: 'Marcus Thompson',
  },
  {
    id: '5',
    wbs: '1.2',
    wbsName: 'Software',
    code: 'WP-401',
    name: 'Nav Core',
    currentPercent: 100,
    newPercent: null,
    notes: '',
    manager: 'Kevin Park',
  },
  {
    id: '6',
    wbs: '1.2',
    wbsName: 'Software',
    code: 'WP-402',
    name: 'Safety Module',
    currentPercent: 35,
    newPercent: null,
    notes: '',
    manager: 'Rachel Kim',
  },
];

export default function BulkProgressPage() {
  const [workPackages, setWorkPackages] = React.useState<WorkPackageRow[]>(mockWorkPackages);
  const [searchText, setSearchText] = React.useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const [savedCount, setSavedCount] = React.useState(0);

  const handlePercentChange = (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setWorkPackages(prev =>
      prev.map(wp =>
        wp.id === id
          ? { ...wp, newPercent: numValue }
          : wp
      )
    );
  };

  const handleNotesChange = (id: string, value: string) => {
    setWorkPackages(prev =>
      prev.map(wp =>
        wp.id === id
          ? { ...wp, notes: value }
          : wp
      )
    );
  };

  const validatePercent = (value: number | null): string | null => {
    if (value === null) return null;
    if (isNaN(value)) return 'Must be a number';
    if (value < 0 || value > 100) return 'Must be 0-100';
    return null;
  };

  const getPendingChanges = (): PendingChange[] => {
    return workPackages
      .filter(wp => wp.newPercent !== null && wp.newPercent !== wp.currentPercent)
      .filter(wp => validatePercent(wp.newPercent) === null)
      .map(wp => ({
        id: wp.id,
        code: wp.code,
        name: wp.name,
        currentPercent: wp.currentPercent,
        newPercent: wp.newPercent!,
      }));
  };

  const pendingChanges = getPendingChanges();
  const hasValidChanges = pendingChanges.length > 0;

  const handleSave = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    const count = pendingChanges.length;
    
    // Apply changes
    setWorkPackages(prev =>
      prev.map(wp => {
        if (wp.newPercent !== null && validatePercent(wp.newPercent) === null) {
          return { ...wp, currentPercent: wp.newPercent, newPercent: null, notes: '' };
        }
        return wp;
      })
    );

    setSavedCount(count);
    setConfirmDialogOpen(false);
    setSuccessDialogOpen(true);
  };

  const handleReset = () => {
    setWorkPackages(prev =>
      prev.map(wp => ({ ...wp, newPercent: null, notes: '' }))
    );
  };

  const filteredWorkPackages = workPackages.filter(wp =>
    searchText === '' ||
    wp.code.toLowerCase().includes(searchText.toLowerCase()) ||
    wp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    wp.wbs.toLowerCase().includes(searchText.toLowerCase()) ||
    wp.wbsName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        title="Bulk Progress Entry"
        subtitle="Update physical percent complete for multiple work packages"
        showSearch={false}
      />

      {/* Toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search work packages..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        
        <Box sx={{ flexGrow: 1 }} />

        {pendingChanges.length > 0 && (
          <Chip
            icon={<EditIcon />}
            label={`${pendingChanges.length} pending changes`}
            color="warning"
          />
        )}

        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!hasValidChanges}
        >
          Reset All
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasValidChanges}
        >
          Save Changes
        </Button>

        <ExportButton data={workPackages} filename="bulk-progress" />
      </Box>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Instructions:</strong> Enter new percent complete values (0-100) in the "New %" column. 
        Changes are saved when you click "Save Changes". Leave blank to keep current value.
      </Alert>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>WBS</TableCell>
                  <TableCell>WBS Name</TableCell>
                  <TableCell>WP Code</TableCell>
                  <TableCell>Work Package</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell align="right">Current %</TableCell>
                  <TableCell align="right" sx={{ minWidth: 120 }}>New %</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkPackages.map((wp) => {
                  const error = validatePercent(wp.newPercent);
                  const hasChange = wp.newPercent !== null && wp.newPercent !== wp.currentPercent;
                  
                  return (
                    <TableRow
                      key={wp.id}
                      sx={{
                        bgcolor: hasChange && !error ? 'warning.lighter' : 'transparent',
                      }}
                    >
                      <TableCell>{wp.wbs}</TableCell>
                      <TableCell>{wp.wbsName}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {wp.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{wp.name}</TableCell>
                      <TableCell>{wp.manager}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {wp.currentPercent.toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={wp.newPercent ?? ''}
                          onChange={(e) => handlePercentChange(wp.id, e.target.value)}
                          error={!!error}
                          helperText={error}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          inputProps={{
                            min: 0,
                            max: 100,
                            step: 0.1,
                          }}
                          sx={{ width: 110 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Optional notes..."
                          value={wp.notes}
                          onChange={(e) => handleNotesChange(wp.id, e.target.value)}
                          disabled={wp.newPercent === null}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Progress Updates</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to update <strong>{pendingChanges.length}</strong> work package(s):
          </Typography>
          <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>WP Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Current %</TableCell>
                  <TableCell align="right">New %</TableCell>
                  <TableCell align="right">Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingChanges.map((change) => {
                  const delta = change.newPercent - change.currentPercent;
                  return (
                    <TableRow key={change.id}>
                      <TableCell>{change.code}</TableCell>
                      <TableCell>{change.name}</TableCell>
                      <TableCell align="right">{change.currentPercent.toFixed(1)}%</TableCell>
                      <TableCell align="right">{change.newPercent.toFixed(1)}%</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={delta > 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will update the physical percent complete and affect earned value calculations.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmSave} startIcon={<SaveIcon />}>
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Progress Updated Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>{savedCount}</strong> work package(s) updated
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSuccessDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
