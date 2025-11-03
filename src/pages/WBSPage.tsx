import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { mockApi, WBSData, WBSNode, WorkPackage } from '../services/mockApi';
import PageHeader from '../components/layout/PageHeader';
import KPIPill from '../components/evms/shared/KPIPill';
import ExportButton from '../components/evms/shared/ExportButton';

export default function WBSPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [wbsData, setWBSData] = React.useState<WBSData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedNode, setSelectedNode] = React.useState<WBSNode | null>(null);
  const [searchText, setSearchText] = React.useState('');
  const [timeWindow, setTimeWindow] = React.useState<number>(12);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (projectId) {
      mockApi.getWBSData(projectId).then((data) => {
        setWBSData(data);
        if (data) {
          // Auto-select root node
          setSelectedNode(data.root);
          // Auto-expand first level
          setExpandedItems([data.root.id]);
        }
        setLoading(false);
      });
    }
  }, [projectId]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!wbsData) {
    return (
      <Box>
        <Alert severity="error">WBS data not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/project/${projectId}`)}>
          Back to Project Overview
        </Button>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateSPI = (node: WBSNode) => {
    return node.pv_cum > 0 ? node.ev_cum / node.pv_cum : 0;
  };

  const calculateCPI = (node: WBSNode) => {
    return node.ac_cum > 0 ? node.ev_cum / node.ac_cum : 0;
  };

  // Recursively render tree nodes
  const renderTreeNode = (node: WBSNode): React.ReactNode => {
    const spi = node.spi || calculateSPI(node);
    const cpi = node.cpi || calculateCPI(node);
    const matchesSearch = searchText === '' || 
      node.id.toLowerCase().includes(searchText.toLowerCase()) ||
      node.name.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return null;

    const handleNodeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // If it's a CA node, navigate to CA detail page
      if (node.type === 'CA') {
        navigate(`/project/${projectId}/ca/${node.id}`);
      } else {
        // Otherwise just select it to show details
        setSelectedNode(node);
      }
    };

    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              py: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
              cursor: node.type === 'CA' ? 'pointer' : 'default',
            }}
            onClick={handleNodeClick}
          >
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 60 }}>
              {node.id}
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {node.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
              {formatCurrency(node.bac)}
            </Typography>
          </Box>
        }
      >
        {node.children?.map((child) => renderTreeNode(child))}
      </TreeItem>
    );
  };

  // Prepare chart data for selected node
  let chartData: { pv: number[]; ev: number[]; ac: number[] } | null = null;
  if (selectedNode?.series) {
    const series = selectedNode.series;
    const windowData = {
      pv: series.pv.slice(-timeWindow),
      ev: series.ev.slice(-timeWindow),
      ac: series.ac.slice(-timeWindow),
    };
    chartData = windowData;
  }

  const xLabels = wbsData.seriesMonths.slice(-timeWindow);

  // Get work packages for selected node
  const workPackages: WorkPackage[] = selectedNode?.wps || [];

  // KPI Tiles
  const kpiTiles = selectedNode
    ? [
        { label: 'PV (cum)', value: formatCurrency(selectedNode.pv_cum) },
        { label: 'EV (cum)', value: formatCurrency(selectedNode.ev_cum) },
        { label: 'AC (cum)', value: formatCurrency(selectedNode.ac_cum) },
        { label: 'SPI (cum)', value: calculateSPI(selectedNode).toFixed(2), pill: true, pillValue: calculateSPI(selectedNode) },
        { label: 'CPI (cum)', value: calculateCPI(selectedNode).toFixed(2), pill: true, pillValue: calculateCPI(selectedNode) },
      ]
    : [];

  return (
    <Box>
      <PageHeader
        title={`WBS & Control Accounts \u2022 ${wbsData.projectName}`}
        subtitle="Navigate the WBS, inspect control accounts, and review work packages."
        showSearch={false}
        actions={
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(`/project/${projectId}`)}
          >
            Project Overview
          </Button>
        }
      />

      <Grid container spacing={2}>
        {/* Left: Tree */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                WBS
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search WBS / CA / WP..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>
            <Box sx={{ p: 1, maxHeight: 640, overflow: 'auto' }}>
              <SimpleTreeView
                expandedItems={expandedItems}
                onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
              >
                {renderTreeNode(wbsData.root)}
              </SimpleTreeView>
            </Box>
          </Card>
        </Grid>

        {/* Right: Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Selected Node Info */}
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Selected
                    </Typography>
                    <Chip label={`as of ${wbsData.asOf}`} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h5">
                      {selectedNode ? `${selectedNode.id} \u2022 ${selectedNode.name}` : '\u2014'}
                    </Typography>
                    {selectedNode && (
                      <>
                        <Chip label={selectedNode.type} size="small" />
                        <Chip label={formatCurrency(selectedNode.bac)} size="small" variant="outlined" sx={{ ml: 'auto' }} />
                      </>
                    )}
                  </Box>
                </Box>

                {/* KPI Tiles */}
                <Grid container spacing={1.5}>
                  {kpiTiles.map((tile, index) => (
                    <Grid key={index} size={{ xs: 6, sm: 4, md: 2.4 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {tile.label}
                        </Typography>
                        {tile.pill && tile.pillValue !== undefined ? (
                          <KPIPill label="" value={tile.pillValue} />
                        ) : (
                          <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                            {tile.value}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Chart */}
            {chartData && (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">PV / EV / AC (Monthly)</Typography>
                    <Select
                      size="small"
                      value={timeWindow}
                      onChange={(e) => setTimeWindow(Number(e.target.value))}
                    >
                      <MenuItem value={6}>Last 6 months</MenuItem>
                      <MenuItem value={12}>Last 12 months</MenuItem>
                      <MenuItem value={24}>Last 24 months</MenuItem>
                    </Select>
                  </Box>
                  <LineChart
                    height={260}
                    series={[
                      { data: chartData.pv, label: 'PV', color: '#6b7280' },
                      { data: chartData.ev, label: 'EV', color: '#0ea5e9' },
                      { data: chartData.ac, label: 'AC', color: '#10b981' },
                    ]}
                    xAxis={[{ scaleType: 'point', data: xLabels }]}
                    sx={{
                      '& .MuiLineElement-root': {
                        strokeWidth: 2,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Work Packages Table */}
            {workPackages.length > 0 && (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Work Packages</Typography>
                    <ExportButton data={workPackages} filename={`wp-${selectedNode?.id}`} />
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>WP Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell align="right">BAC</TableCell>
                        <TableCell align="right">EV (cum)</TableCell>
                        <TableCell align="right">SPI</TableCell>
                        <TableCell align="right">CPI</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workPackages.map((wp) => (
                        <TableRow key={wp.code}>
                          <TableCell>{wp.code}</TableCell>
                          <TableCell>{wp.name}</TableCell>
                          <TableCell>{wp.dates}</TableCell>
                          <TableCell>{wp.method}</TableCell>
                          <TableCell align="right">{formatCurrency(wp.bac)}</TableCell>
                          <TableCell align="right">{formatCurrency(wp.ev_cum)}</TableCell>
                          <TableCell align="right">
                            <KPIPill label="" value={wp.spi} />
                          </TableCell>
                          <TableCell align="right">
                            <KPIPill label="" value={wp.cpi} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
