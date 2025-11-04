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
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PageHeader from '../components/layout/PageHeader';

interface Vendor {
  id: string;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  ytdSpend: number;
  contractValue: number;
  costClasses: string[];
}

interface CostClass {
  id: string;
  code: string;
  name: string;
  description: string;
  erpMapping: string;
  ytdSpend: number;
  budgeted: number;
}

export default function VendorsPage() {
  const [tabValue, setTabValue] = React.useState(0);
  const [vendorDialogOpen, setVendorDialogOpen] = React.useState(false);
  const [costClassDialogOpen, setCostClassDialogOpen] = React.useState(false);
  const [editingVendor, setEditingVendor] = React.useState<Vendor | null>(null);
  const [editingCostClass, setEditingCostClass] = React.useState<CostClass | null>(null);

  // Mock vendors
  const [vendors, setVendors] = React.useState<Vendor[]>([
    {
      id: '1',
      name: 'Acme Engineering',
      code: 'ACME',
      contact: 'John Smith',
      email: 'john@acme.com',
      phone: '555-0100',
      status: 'active',
      ytdSpend: 450000,
      contractValue: 800000,
      costClasses: ['Labor', 'Materials'],
    },
    {
      id: '2',
      name: 'TechCorp Solutions',
      code: 'TECH',
      contact: 'Jane Doe',
      email: 'jane@techcorp.com',
      phone: '555-0200',
      status: 'active',
      ytdSpend: 325000,
      contractValue: 500000,
      costClasses: ['Labor', 'Subcontracts'],
    },
    {
      id: '3',
      name: 'Quality Manufacturing',
      code: 'QMFG',
      contact: 'Bob Johnson',
      email: 'bob@qmfg.com',
      phone: '555-0300',
      status: 'active',
      ytdSpend: 180000,
      contractValue: 300000,
      costClasses: ['Materials', 'Equipment'],
    },
    {
      id: '4',
      name: 'Legacy Systems Inc',
      code: 'LGCY',
      contact: 'Alice Brown',
      email: 'alice@legacy.com',
      phone: '555-0400',
      status: 'inactive',
      ytdSpend: 0,
      contractValue: 0,
      costClasses: [],
    },
  ]);

  // Mock cost classes
  const [costClasses, setCostClasses] = React.useState<CostClass[]>([
    {
      id: '1',
      code: 'LAB',
      name: 'Labor',
      description: 'Direct and indirect labor costs',
      erpMapping: 'GL-5000',
      ytdSpend: 520000,
      budgeted: 750000,
    },
    {
      id: '2',
      code: 'MAT',
      name: 'Materials',
      description: 'Raw materials and components',
      erpMapping: 'GL-5100',
      ytdSpend: 280000,
      budgeted: 400000,
    },
    {
      id: '3',
      code: 'SUB',
      name: 'Subcontracts',
      description: 'Third-party subcontractor costs',
      erpMapping: 'GL-5200',
      ytdSpend: 325000,
      budgeted: 500000,
    },
    {
      id: '4',
      code: 'EQP',
      name: 'Equipment',
      description: 'Equipment purchase and rental',
      erpMapping: 'GL-5300',
      ytdSpend: 95000,
      budgeted: 150000,
    },
    {
      id: '5',
      code: 'TRV',
      name: 'Travel',
      description: 'Business travel expenses',
      erpMapping: 'GL-5400',
      ytdSpend: 45000,
      budgeted: 75000,
    },
    {
      id: '6',
      code: 'ODC',
      name: 'Other Direct Costs',
      description: 'Miscellaneous direct costs',
      erpMapping: 'GL-5500',
      ytdSpend: 35000,
      budgeted: 50000,
    },
  ]);

  const [vendorForm, setVendorForm] = React.useState({
    name: '',
    code: '',
    contact: '',
    email: '',
    phone: '',
    contractValue: '',
  });

  const [costClassForm, setCostClassForm] = React.useState({
    code: '',
    name: '',
    description: '',
    erpMapping: '',
    budgeted: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getUtilization = (spent: number, total: number) => {
    return total > 0 ? (spent / total) * 100 : 0;
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVendorForm({
      name: vendor.name,
      code: vendor.code,
      contact: vendor.contact,
      email: vendor.email,
      phone: vendor.phone,
      contractValue: vendor.contractValue.toString(),
    });
    setVendorDialogOpen(true);
  };

  const handleEditCostClass = (costClass: CostClass) => {
    setEditingCostClass(costClass);
    setCostClassForm({
      code: costClass.code,
      name: costClass.name,
      description: costClass.description,
      erpMapping: costClass.erpMapping,
      budgeted: costClass.budgeted.toString(),
    });
    setCostClassDialogOpen(true);
  };

  const handleSaveVendor = () => {
    // In real app, would make API call
    console.log('Saving vendor:', vendorForm);
    setVendorDialogOpen(false);
    setEditingVendor(null);
    setVendorForm({ name: '', code: '', contact: '', email: '', phone: '', contractValue: '' });
  };

  const handleSaveCostClass = () => {
    // In real app, would make API call
    console.log('Saving cost class:', costClassForm);
    setCostClassDialogOpen(false);
    setEditingCostClass(null);
    setCostClassForm({ code: '', name: '', description: '', erpMapping: '', budgeted: '' });
  };

  const handleExportVendors = () => {
    const csv = [
      ['Vendor Code', 'Name', 'Contact', 'Email', 'Phone', 'Status', 'YTD Spend', 'Contract Value', 'Utilization %', 'Cost Classes'],
      ...vendors.map(v => [
        v.code,
        v.name,
        v.contact,
        v.email,
        v.phone,
        v.status,
        v.ytdSpend,
        v.contractValue,
        getUtilization(v.ytdSpend, v.contractValue).toFixed(1),
        v.costClasses.join('; '),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportCostClasses = () => {
    const csv = [
      ['Code', 'Name', 'Description', 'ERP Mapping', 'YTD Spend', 'Budgeted', 'Utilization %'],
      ...costClasses.map(c => [
        c.code,
        c.name,
        c.description,
        c.erpMapping,
        c.ytdSpend,
        c.budgeted,
        getUtilization(c.ytdSpend, c.budgeted).toFixed(1),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-classes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box>
      <PageHeader
        title="Vendors & Cost Classes"
        subtitle="Manage vendor relationships and cost class mappings"
        showSearch={false}
      />

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="Vendors" />
            <Tab label="Cost Classes" />
          </Tabs>

          {/* Vendors Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Vendor Directory</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportVendors}
                  >
                    Export
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setVendorDialogOpen(true)}
                  >
                    Add Vendor
                  </Button>
                </Box>
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">YTD Spend</TableCell>
                      <TableCell align="right">Contract Value</TableCell>
                      <TableCell align="right">Utilization</TableCell>
                      <TableCell>Cost Classes</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendors.map((vendor) => {
                      const utilization = getUtilization(vendor.ytdSpend, vendor.contractValue);
                      return (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">{vendor.code}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{vendor.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">{vendor.contact}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {vendor.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={vendor.status === 'active' ? <CheckCircleIcon /> : undefined}
                              label={vendor.status.toUpperCase()}
                              size="small"
                              color={vendor.status === 'active' ? 'success' : 'default'}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{formatCurrency(vendor.ytdSpend)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{formatCurrency(vendor.contractValue)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              {utilization > 90 && <WarningIcon fontSize="small" color="warning" />}
                              <Typography variant="body2">{utilization.toFixed(0)}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {vendor.costClasses.map(cc => (
                                <Chip key={cc} label={cc} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleEditVendor(vendor)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {/* Summary Cards */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total Vendors</Typography>
                      <Typography variant="h5">{vendors.length}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Active Vendors</Typography>
                      <Typography variant="h5" color="success.main">
                        {vendors.filter(v => v.status === 'active').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total YTD Spend</Typography>
                      <Typography variant="h5">
                        {formatCurrency(vendors.reduce((sum, v) => sum + v.ytdSpend, 0))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total Contract Value</Typography>
                      <Typography variant="h5">
                        {formatCurrency(vendors.reduce((sum, v) => sum + v.contractValue, 0))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Cost Classes Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Cost Classes</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportCostClasses}
                  >
                    Export
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setCostClassDialogOpen(true)}
                  >
                    Add Cost Class
                  </Button>
                </Box>
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>ERP Mapping</TableCell>
                      <TableCell align="right">YTD Spend</TableCell>
                      <TableCell align="right">Budgeted</TableCell>
                      <TableCell align="right">Utilization</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costClasses.map((costClass) => {
                      const utilization = getUtilization(costClass.ytdSpend, costClass.budgeted);
                      return (
                        <TableRow key={costClass.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">{costClass.code}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{costClass.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {costClass.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={costClass.erpMapping} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{formatCurrency(costClass.ytdSpend)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{formatCurrency(costClass.budgeted)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              {utilization > 90 && <WarningIcon fontSize="small" color="warning" />}
                              <Typography
                                variant="body2"
                                color={utilization > 100 ? 'error' : utilization > 90 ? 'warning.main' : 'text.primary'}
                              >
                                {utilization.toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleEditCostClass(costClass)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {/* Summary Cards */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total Cost Classes</Typography>
                      <Typography variant="h5">{costClasses.length}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total YTD Spend</Typography>
                      <Typography variant="h5">
                        {formatCurrency(costClasses.reduce((sum, c) => sum + c.ytdSpend, 0))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Total Budgeted</Typography>
                      <Typography variant="h5">
                        {formatCurrency(costClasses.reduce((sum, c) => sum + c.budgeted, 0))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Vendor Dialog */}
      <Dialog open={vendorDialogOpen} onClose={() => setVendorDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={vendorForm.name}
                onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Vendor Code"
                value={vendorForm.code}
                onChange={(e) => setVendorForm({ ...vendorForm, code: e.target.value })}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Contact Name"
                value={vendorForm.contact}
                onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={vendorForm.email}
                onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Phone"
                value={vendorForm.phone}
                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Contract Value"
                type="number"
                value={vendorForm.contractValue}
                onChange={(e) => setVendorForm({ ...vendorForm, contractValue: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVendorDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveVendor}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Cost Class Dialog */}
      <Dialog open={costClassDialogOpen} onClose={() => setCostClassDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCostClass ? 'Edit Cost Class' : 'Add Cost Class'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Cost Class Code"
                value={costClassForm.code}
                onChange={(e) => setCostClassForm({ ...costClassForm, code: e.target.value })}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Name"
                value={costClassForm.name}
                onChange={(e) => setCostClassForm({ ...costClassForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={costClassForm.description}
                onChange={(e) => setCostClassForm({ ...costClassForm, description: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="ERP Mapping"
                value={costClassForm.erpMapping}
                onChange={(e) => setCostClassForm({ ...costClassForm, erpMapping: e.target.value })}
                helperText="e.g., GL account code"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Budgeted Amount"
                type="number"
                value={costClassForm.budgeted}
                onChange={(e) => setCostClassForm({ ...costClassForm, budgeted: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCostClassDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCostClass}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
