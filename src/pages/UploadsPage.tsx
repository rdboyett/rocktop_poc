import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PageHeader from '../components/layout/PageHeader';

interface UploadRow {
  date: string;
  wbs: string;
  amount: number;
  notes?: string;
  errors: string[];
  warnings: string[];
}

interface ColumnMapping {
  date: string;
  wbs: string;
  amount: string;
  notes: string;
}

interface ValidationSummary {
  total: number;
  errors: number;
  warnings: number;
  valid: number;
}

export default function UploadsPage() {
  const [tab, setTab] = React.useState<'pv' | 'ac'>('pv');
  const [file, setFile] = React.useState<File | null>(null);
  const [csvData, setCsvData] = React.useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = React.useState<string[]>([]);
  const [columnMapping, setColumnMapping] = React.useState<ColumnMapping>({
    date: '',
    wbs: '',
    amount: '',
    notes: '',
  });
  const [parsedData, setParsedData] = React.useState<UploadRow[]>([]);
  const [validationSummary, setValidationSummary] = React.useState<ValidationSummary>({
    total: 0,
    errors: 0,
    warnings: 0,
    valid: 0,
  });
  const [step, setStep] = React.useState<'upload' | 'map' | 'validate' | 'confirm'>('upload');
  const [importing, setImporting] = React.useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return;

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      setCsvHeaders(headers);

      // Parse data rows (limit to first 100)
      const rows = lines.slice(1, 101).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setCsvData(rows);
      setStep('map');
    };
    reader.readAsText(file);
  };

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({ ...prev, [field]: value }));
  };

  const validateData = () => {
    const rows: UploadRow[] = csvData.map(row => {
      const errors: string[] = [];
      const warnings: string[] = [];

      const dateStr = row[columnMapping.date] || '';
      const wbsCode = row[columnMapping.wbs] || '';
      const amountStr = row[columnMapping.amount] || '';
      const amount = parseFloat(amountStr.replace(/[$,]/g, ''));

      // Date validation
      if (!dateStr) {
        errors.push('Date is required');
      } else {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          errors.push('Invalid date format');
        } else {
          // Month-end validation
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          if (date.getDate() !== lastDay.getDate()) {
            warnings.push('Date is not month-end');
          }
        }
      }

      // WBS code validation
      if (!wbsCode) {
        errors.push('WBS code is required');
      }

      // Amount validation
      if (!amountStr) {
        errors.push('Amount is required');
      } else if (isNaN(amount)) {
        errors.push('Amount must be numeric');
      } else if (amount < 0) {
        errors.push('Amount cannot be negative');
      }

      return {
        date: dateStr,
        wbs: wbsCode,
        amount: amount || 0,
        notes: row[columnMapping.notes] || '',
        errors,
        warnings,
      };
    });

    setParsedData(rows);

    const summary = {
      total: rows.length,
      errors: rows.filter(r => r.errors.length > 0).length,
      warnings: rows.filter(r => r.warnings.length > 0 && r.errors.length === 0).length,
      valid: rows.filter(r => r.errors.length === 0 && r.warnings.length === 0).length,
    };
    setValidationSummary(summary);
    setStep('validate');
  };

  const handleImport = () => {
    setImporting(true);
    // Simulate import
    setTimeout(() => {
      setImporting(false);
      setStep('confirm');
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({ date: '', wbs: '', amount: '', notes: '' });
    setParsedData([]);
    setValidationSummary({ total: 0, errors: 0, warnings: 0, valid: 0 });
    setStep('upload');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRowStatus = (row: UploadRow) => {
    if (row.errors.length > 0) return 'error';
    if (row.warnings.length > 0) return 'warning';
    return 'valid';
  };

  const rowsToShow = parsedData.slice(0, 100);

  return (
    <Box>
      <PageHeader
        title="Time-Phased Data Uploads"
        subtitle="Upload and validate PV (Planned Value) and AC (Actual Cost) data"
        showSearch={false}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(e, newValue) => { setTab(newValue); handleReset(); }}>
          <Tab label="PV Upload" value="pv" />
          <Tab label="AC Upload" value="ac" />
        </Tabs>
      </Box>

      {/* Step: Upload */}
      {step === 'upload' && (
        <Card>
          <CardContent>
            <input
              type="file"
              accept=".csv"
              id="csv-file-upload"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <label htmlFor="csv-file-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <Box
                sx={{
                  border: (theme) => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload CSV File
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Drag and drop or click to select a CSV file
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Expected columns: Date, WBS Code, Amount (and optionally Notes)
                </Typography>
              </Box>
            </label>

            {file && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  <strong>File selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Alert>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step: Map Columns */}
      {step === 'map' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Map CSV Columns
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Map your CSV columns to the required fields. Preview shows first row of data.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Date Column *</InputLabel>
                <Select
                  value={columnMapping.date}
                  label="Date Column *"
                  onChange={(e) => handleColumnMappingChange('date', e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {csvHeaders.map(header => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>WBS Code Column *</InputLabel>
                <Select
                  value={columnMapping.wbs}
                  label="WBS Code Column *"
                  onChange={(e) => handleColumnMappingChange('wbs', e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {csvHeaders.map(header => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Amount Column *</InputLabel>
                <Select
                  value={columnMapping.amount}
                  label="Amount Column *"
                  onChange={(e) => handleColumnMappingChange('amount', e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {csvHeaders.map(header => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Notes Column (Optional)</InputLabel>
                <Select
                  value={columnMapping.notes}
                  label="Notes Column (Optional)"
                  onChange={(e) => handleColumnMappingChange('notes', e.target.value)}
                >
                  <MenuItem value="">-- None --</MenuItem>
                  {csvHeaders.map(header => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {csvData.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Preview (first row):
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {columnMapping.date && <div><strong>Date:</strong> {csvData[0][columnMapping.date]}</div>}
                  {columnMapping.wbs && <div><strong>WBS:</strong> {csvData[0][columnMapping.wbs]}</div>}
                  {columnMapping.amount && <div><strong>Amount:</strong> {csvData[0][columnMapping.amount]}</div>}
                  {columnMapping.notes && <div><strong>Notes:</strong> {csvData[0][columnMapping.notes]}</div>}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={validateData}
                disabled={!columnMapping.date || !columnMapping.wbs || !columnMapping.amount}
              >
                Validate Data
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step: Validate */}
      {step === 'validate' && (
        <>
          {/* Validation Summary */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Validation Summary
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  icon={<InfoIcon />}
                  label={`Total: ${validationSummary.total}`}
                  color="default"
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Valid: ${validationSummary.valid}`}
                  color="success"
                />
                <Chip
                  icon={<WarningIcon />}
                  label={`Warnings: ${validationSummary.warnings}`}
                  color="warning"
                />
                <Chip
                  icon={<ErrorIcon />}
                  label={`Errors: ${validationSummary.errors}`}
                  color="error"
                />
              </Box>

              {validationSummary.errors > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <strong>{validationSummary.errors}</strong> rows have errors and must be fixed before importing.
                </Alert>
              )}
              {validationSummary.warnings > 0 && validationSummary.errors === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <strong>{validationSummary.warnings}</strong> rows have warnings. Review before importing.
                </Alert>
              )}
              {validationSummary.errors === 0 && validationSummary.warnings === 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  All rows passed validation. Ready to import.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Preview ({rowsToShow.length} of {parsedData.length} rows)
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>WBS Code</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Issues</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowsToShow.map((row, idx) => {
                      const status = getRowStatus(row);
                      return (
                        <TableRow
                          key={idx}
                          sx={{
                            bgcolor: status === 'error' ? 'error.lighter' : status === 'warning' ? 'warning.lighter' : 'transparent',
                          }}
                        >
                          <TableCell>
                            {status === 'error' && <ErrorIcon fontSize="small" color="error" />}
                            {status === 'warning' && <WarningIcon fontSize="small" color="warning" />}
                            {status === 'valid' && <CheckCircleIcon fontSize="small" color="success" />}
                          </TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.wbs}</TableCell>
                          <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                          <TableCell>{row.notes}</TableCell>
                          <TableCell>
                            {row.errors.length > 0 && (
                              <Typography variant="caption" color="error">
                                {row.errors.join(', ')}
                              </Typography>
                            )}
                            {row.warnings.length > 0 && row.errors.length === 0 && (
                              <Typography variant="caption" color="warning.dark">
                                {row.warnings.join(', ')}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="outlined" onClick={() => setStep('map')}>
                  Back to Mapping
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={validationSummary.errors > 0 || importing}
                >
                  {importing ? 'Importing...' : 'Import Data'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Confirmation */}
      {step === 'confirm' && (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Import Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {validationSummary.valid} rows imported successfully
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total amount: {formatCurrency(parsedData.reduce((sum, row) => sum + (row.errors.length === 0 ? row.amount : 0), 0))}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => console.log('Download import log')}
                >
                  Download Import Log
                </Button>
                <Button variant="contained" onClick={handleReset}>
                  Upload Another File
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
