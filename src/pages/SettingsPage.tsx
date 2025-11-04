import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PageHeader from '../components/layout/PageHeader';

export default function SettingsPage() {
  const [tabValue, setTabValue] = React.useState(0);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Integrations settings
  const [erpEnabled, setErpEnabled] = React.useState(true);
  const [erpEndpoint, setErpEndpoint] = React.useState('https://api.erp.company.com/v1');
  const [erpApiKey, setErpApiKey] = React.useState('');
  const [scheduleEnabled, setScheduleEnabled] = React.useState(true);
  const [scheduleType, setScheduleType] = React.useState('p6');
  const [scheduleEndpoint, setScheduleEndpoint] = React.useState('https://p6.company.com');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [slackWebhook, setSlackWebhook] = React.useState('');

  // Validation rules
  const [enforceMonthEnd, setEnforceMonthEnd] = React.useState(true);
  const [allowNegativeAmounts, setAllowNegativeAmounts] = React.useState(false);
  const [requireWBSMapping, setRequireWBSMapping] = React.useState(true);
  const [spiThreshold, setSpiThreshold] = React.useState('0.95');
  const [cpiThreshold, setCpiThreshold] = React.useState('0.95');
  const [autoAlerts, setAutoAlerts] = React.useState(true);

  // User preferences
  const [defaultView, setDefaultView] = React.useState('portfolio');
  const [dateFormat, setDateFormat] = React.useState('MM/DD/YYYY');
  const [currencyFormat, setCurrencyFormat] = React.useState('USD');
  const [theme, setTheme] = React.useState('system');
  const [defaultPageSize, setDefaultPageSize] = React.useState('25');

  // Organization settings
  const [orgName, setOrgName] = React.useState('Rocktop EVMS');
  const [fiscalYearStart, setFiscalYearStart] = React.useState('01');
  const [timezone, setTimezone] = React.useState('America/New_York');
  const [dataRetention, setDataRetention] = React.useState('7');

  const handleSave = () => {
    // In real app, would make API call to save settings
    console.log('Saving settings...');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = (type: string) => {
    // In real app, would test the connection
    console.log(`Testing ${type} connection...`);
    alert(`${type} connection test successful!`);
  };

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Configure application settings and integrations"
        showSearch={false}
        actions={
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        }
      />

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="Integrations" />
            <Tab label="Validation Rules" />
            <Tab label="User Preferences" />
            <Tab label="Organization" />
          </Tabs>

          {/* Integrations Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>System Integrations</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure connections to external systems and services.
              </Typography>

              {/* ERP Integration */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">ERP System</Typography>
                  <FormControlLabel
                    control={<Switch checked={erpEnabled} onChange={(e) => setErpEnabled(e.target.checked)} />}
                    label="Enabled"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="API Endpoint"
                      value={erpEndpoint}
                      onChange={(e) => setErpEndpoint(e.target.value)}
                      disabled={!erpEnabled}
                      helperText="Base URL for ERP API"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="API Key"
                      type="password"
                      value={erpApiKey}
                      onChange={(e) => setErpApiKey(e.target.value)}
                      disabled={!erpEnabled}
                      placeholder="Enter API key"
                      helperText="Will be stored securely"
                    />
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleTestConnection('ERP')}
                        disabled={!erpEnabled}
                      >
                        Test Connection
                      </Button>
                      {erpEnabled && <Chip icon={<CheckCircleIcon />} label="Connected" color="success" size="small" />}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Schedule Integration */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">Schedule System</Typography>
                  <FormControlLabel
                    control={<Switch checked={scheduleEnabled} onChange={(e) => setScheduleEnabled(e.target.checked)} />}
                    label="Enabled"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth disabled={!scheduleEnabled}>
                      <InputLabel>Schedule Type</InputLabel>
                      <Select
                        value={scheduleType}
                        label="Schedule Type"
                        onChange={(e) => setScheduleType(e.target.value)}
                      >
                        <MenuItem value="p6">Primavera P6</MenuItem>
                        <MenuItem value="msp">Microsoft Project</MenuItem>
                        <MenuItem value="csv">CSV Import</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Server Endpoint"
                      value={scheduleEndpoint}
                      onChange={(e) => setScheduleEndpoint(e.target.value)}
                      disabled={!scheduleEnabled}
                      helperText="P6 web services URL"
                    />
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleTestConnection('Schedule')}
                        disabled={!scheduleEnabled}
                      >
                        Test Connection
                      </Button>
                      {scheduleEnabled && <Chip icon={<CheckCircleIcon />} label="Connected" color="success" size="small" />}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Notifications */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">Notifications</Typography>
                  <FormControlLabel
                    control={<Switch checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />}
                    label="Enabled"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControlLabel
                      control={<Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />}
                      label="Email Notifications"
                      disabled={!notificationsEnabled}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Slack Webhook URL"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      disabled={!notificationsEnabled}
                      placeholder="https://hooks.slack.com/services/..."
                      helperText="Optional: receive alerts in Slack"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {/* Validation Rules Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Data Validation Rules</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure validation rules for data imports and entry.
              </Typography>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2">Enforce Month-End Dates</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Require all date entries to be month-end dates
                          </Typography>
                        </Box>
                        <Switch checked={enforceMonthEnd} onChange={(e) => setEnforceMonthEnd(e.target.checked)} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2">Allow Negative Amounts</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Permit negative values in cost and schedule data
                          </Typography>
                        </Box>
                        <Switch checked={allowNegativeAmounts} onChange={(e) => setAllowNegativeAmounts(e.target.checked)} />
                      </Box>
                      {allowNegativeAmounts && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          Negative amounts may indicate data quality issues
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2">Require WBS Mapping</Typography>
                          <Typography variant="caption" color="text.secondary">
                            All cost entries must have valid WBS assignment
                          </Typography>
                        </Box>
                        <Switch checked={requireWBSMapping} onChange={(e) => setRequireWBSMapping(e.target.checked)} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Performance Thresholds</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        Alert thresholds for SPI and CPI
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="SPI Threshold"
                            type="number"
                            value={spiThreshold}
                            onChange={(e) => setSpiThreshold(e.target.value)}
                            inputProps={{ step: 0.01, min: 0, max: 2 }}
                            helperText="Alert when SPI < threshold"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="CPI Threshold"
                            type="number"
                            value={cpiThreshold}
                            onChange={(e) => setCpiThreshold(e.target.value)}
                            inputProps={{ step: 0.01, min: 0, max: 2 }}
                            helperText="Alert when CPI < threshold"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2">Automatic Alert Generation</Typography>
                          <Typography variant="caption" color="text.secondary">
                            System automatically creates alerts based on thresholds
                          </Typography>
                        </Box>
                        <Switch checked={autoAlerts} onChange={(e) => setAutoAlerts(e.target.checked)} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* User Preferences Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>User Preferences</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Customize your personal application preferences.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Default View</InputLabel>
                    <Select
                      value={defaultView}
                      label="Default View"
                      onChange={(e) => setDefaultView(e.target.value)}
                    >
                      <MenuItem value="portfolio">Portfolio Dashboard</MenuItem>
                      <MenuItem value="analytics">Analytics</MenuItem>
                      <MenuItem value="reports">Reports</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={theme}
                      label="Theme"
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={dateFormat}
                      label="Date Format"
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={currencyFormat}
                      label="Currency"
                      onChange={(e) => setCurrencyFormat(e.target.value)}
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Default Page Size</InputLabel>
                    <Select
                      value={defaultPageSize}
                      label="Default Page Size"
                      onChange={(e) => setDefaultPageSize(e.target.value)}
                    >
                      <MenuItem value="10">10 rows</MenuItem>
                      <MenuItem value="25">25 rows</MenuItem>
                      <MenuItem value="50">50 rows</MenuItem>
                      <MenuItem value="100">100 rows</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Organization Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Organization Settings</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure organization-wide settings and policies.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Fiscal Year Start</InputLabel>
                    <Select
                      value={fiscalYearStart}
                      label="Fiscal Year Start"
                      onChange={(e) => setFiscalYearStart(e.target.value)}
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = new Date(2000, i, 1).toLocaleString('default', { month: 'long' });
                        const value = (i + 1).toString().padStart(2, '0');
                        return <MenuItem key={value} value={value}>{month}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={timezone}
                      label="Timezone"
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                      <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Data Retention</InputLabel>
                    <Select
                      value={dataRetention}
                      label="Data Retention"
                      onChange={(e) => setDataRetention(e.target.value)}
                    >
                      <MenuItem value="1">1 year</MenuItem>
                      <MenuItem value="3">3 years</MenuItem>
                      <MenuItem value="5">5 years</MenuItem>
                      <MenuItem value="7">7 years</MenuItem>
                      <MenuItem value="10">10 years</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <Alert severity="info">
                    Organization settings affect all users in your organization. Changes may require logout/login to take effect.
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
