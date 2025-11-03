// Portfolio mock data
export interface ProjectRow {
  id: string;
  name: string;
  program: string;
  status: 'On Track' | 'Watch' | 'At Risk';
  percent: number;
  spi: number;
  cpi: number;
  spiTrend: number[];
  cpiTrend: number[];
  bac: number;
  eac: number;
  vac: number;
  lastUpdate: string;
  owner: string;
}

// Project detail types
export interface ProjectDetail {
  id: string;
  name: string;
  program: string;
  status: 'On Track' | 'Watch' | 'At Risk';
  asOf: string;
  owner: string;
  kpis: {
    period: {
      pv: number;
      ev: number;
      ac: number;
      sv: number;
      cv: number;
      spi: number;
      cpi: number;
    };
    cumulative: {
      pv: number;
      ev: number;
      ac: number;
      spi: number;
      cpi: number;
    };
    bac: number;
    eac: number;
    vac: number;
    tcpi: number;
  };
  series: Array<{
    period: string;
    pv: number;
    ev: number;
    ac: number;
  }>;
  variances: Array<{
    node: string;
    sv: number;
    cv: number;
    spi: number;
    cpi: number;
    comment: string;
  }>;
  feed: string[];
}

// WBS types
export interface WBSNode {
  id: string;
  name: string;
  type: 'WBS' | 'CA';
  bac: number;
  pv_cum: number;
  ev_cum: number;
  ac_cum: number;
  spi?: number;
  cpi?: number;
  series?: {
    pv: number[];
    ev: number[];
    ac: number[];
  };
  wps?: WorkPackage[];
  children?: WBSNode[];
}

export interface WorkPackage {
  code: string;
  name: string;
  dates: string;
  method: string;
  bac: number;
  ev_cum: number;
  spi: number;
  cpi: number;
}

// Work Package detail types
export interface WPDetail {
  code: string;
  name: string;
  projectId: string;
  projectName: string;
  caId: string;
  caName: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: 'On Track' | 'Watch' | 'At Risk' | 'Complete';
  percentComplete: number;
  asOf: string;
  schedule: {
    plannedStart: string;
    plannedFinish: string;
    actualStart: string;
    actualFinish: string | null;
    forecastFinish: string;
  };
  evMethod: {
    type: string;
    description: string;
    milestones?: Array<{
      name: string;
      date: string;
      weight: number;
      status: 'complete' | 'pending';
    }>;
  };
  kpis: {
    bac: number;
    pv_cum: number;
    ev_cum: number;
    ac_cum: number;
    sv_cum: number;
    cv_cum: number;
    spi: number;
    cpi: number;
    eac: number;
    etc: number;
    vac: number;
  };
  series: Array<{
    period: string;
    pv: number;
    ev: number;
    ac: number;
  }>;
  actuals: Array<{
    period: string;
    laborHours: number;
    laborCost: number;
    materialCost: number;
    otherCost: number;
    totalCost: number;
  }>;
  feed: Array<{
    date: string;
    type: 'update' | 'issue' | 'milestone' | 'actual' | 'forecast';
    message: string;
  }>;
}

export interface WBSData {
  projectId: string;
  projectName: string;
  asOf: string;
  seriesMonths: string[];
  root: WBSNode;
}

// Control Account detail types
export interface CADetail {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: 'On Track' | 'Watch' | 'At Risk';
  asOf: string;
  kpis: {
    bac: number;
    pv_cum: number;
    ev_cum: number;
    ac_cum: number;
    sv_cum: number;
    cv_cum: number;
    spi: number;
    cpi: number;
    eac: number;
    etc: number;
    vac: number;
    tcpi: number;
  };
  series: Array<{
    period: string;
    pv: number;
    ev: number;
    ac: number;
  }>;
  workPackages: WorkPackage[];
  variances: Array<{
    metric: string;
    value: number;
    threshold: number;
    status: 'good' | 'warning' | 'critical';
    comment: string;
  }>;
  feed: Array<{
    date: string;
    type: 'update' | 'issue' | 'milestone' | 'bcr';
    message: string;
  }>;
}

const mockPortfolio: ProjectRow[] = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    program: 'Avionics',
    status: 'Watch',
    percent: 65,
    spi: 0.93,
    cpi: 0.96,
    spiTrend: [0.95, 0.94, 0.92, 0.91, 0.93, 0.92, 0.93],
    cpiTrend: [0.98, 0.97, 0.96, 0.95, 0.96, 0.96, 0.96],
    bac: 1200000,
    eac: 1250000,
    vac: -50000,
    lastUpdate: '2025-10-28',
    owner: 'Sarah Chen',
  },
  {
    id: 'beta',
    name: 'Project Beta',
    program: 'Propulsion',
    status: 'On Track',
    percent: 42,
    spi: 1.02,
    cpi: 1.05,
    spiTrend: [1.01, 1.02, 1.03, 1.02, 1.01, 1.02, 1.02],
    cpiTrend: [1.06, 1.05, 1.05, 1.04, 1.05, 1.05, 1.05],
    bac: 850000,
    eac: 810000,
    vac: 40000,
    lastUpdate: '2025-10-30',
    owner: 'Mike Johnson',
  },
  {
    id: 'gamma',
    name: 'Project Gamma',
    program: 'Avionics',
    status: 'At Risk',
    percent: 78,
    spi: 0.85,
    cpi: 0.88,
    spiTrend: [0.92, 0.90, 0.88, 0.87, 0.86, 0.85, 0.85],
    cpiTrend: [0.95, 0.93, 0.91, 0.90, 0.89, 0.88, 0.88],
    bac: 2100000,
    eac: 2400000,
    vac: -300000,
    lastUpdate: '2025-10-29',
    owner: 'David Lee',
  },
];

const mockProjectDetails: Record<string, ProjectDetail> = {
  alpha: {
    id: 'alpha',
    name: 'Project Alpha',
    program: 'Avionics',
    status: 'Watch',
    asOf: '2025-10',
    owner: 'Sarah Chen',
    kpis: {
      period: {
        pv: 120000,
        ev: 98000,
        ac: 110000,
        sv: -22000,
        cv: -12000,
        spi: 0.82,
        cpi: 0.89,
      },
      cumulative: {
        pv: 880000,
        ev: 815000,
        ac: 845000,
        spi: 0.93,
        cpi: 0.96,
      },
      bac: 1200000,
      eac: 1250000,
      vac: -50000,
      tcpi: 1.08,
    },
    series: [
      { period: '2024-11', pv: 65000, ev: 61000, ac: 64000 },
      { period: '2024-12', pv: 70000, ev: 64000, ac: 72000 },
      { period: '2025-01', pv: 72000, ev: 66000, ac: 73000 },
      { period: '2025-02', pv: 74000, ev: 70000, ac: 76000 },
      { period: '2025-03', pv: 76000, ev: 71000, ac: 78000 },
      { period: '2025-04', pv: 80000, ev: 75000, ac: 82000 },
      { period: '2025-05', pv: 82000, ev: 78000, ac: 84000 },
      { period: '2025-06', pv: 86000, ev: 82000, ac: 88000 },
      { period: '2025-07', pv: 90000, ev: 83000, ac: 91000 },
      { period: '2025-08', pv: 94000, ev: 88000, ac: 97000 },
      { period: '2025-09', pv: 100000, ev: 93000, ac: 104000 },
      { period: '2025-10', pv: 120000, ev: 98000, ac: 110000 },
    ],
    variances: [
      {
        node: 'CA-102 • Actuators',
        sv: -12000,
        cv: -20000,
        spi: 0.91,
        cpi: 0.88,
        comment: 'Material overrun (supplier change)',
      },
      {
        node: 'CA-105 • Software',
        sv: 8000,
        cv: 3000,
        spi: 1.06,
        cpi: 1.04,
        comment: 'Early completion on module X',
      },
      {
        node: 'WP-301 • Guidance',
        sv: -5000,
        cv: -3000,
        spi: 0.93,
        cpi: 0.96,
        comment: 'Delayed test window',
      },
    ],
    feed: [
      'Actuals upload Oct 28 (+$20K Labor)',
      'BCR-004 Approved (+$50K to avionics tests)',
      'Progress update: WP-301 at 80%',
    ],
  },
};

const mockWBSData: Record<string, WBSData> = {
  alpha: {
    projectId: 'alpha',
    projectName: 'Project Alpha',
    asOf: '2025-10',
    seriesMonths: ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10'],
    root: {
      id: '1.0',
      name: 'Avionics',
      type: 'WBS',
      bac: 250000,
      pv_cum: 180000,
      ev_cum: 168000,
      ac_cum: 176000,
      series: {
        pv: [14500, 15600, 16800, 17700, 18600, 19500, 20400, 21300, 22500, 23800, 25300, 27000],
        ev: [13700, 14500, 15300, 16100, 16900, 17700, 18300, 19300, 20300, 21400, 22700, 24000],
        ac: [14800, 15500, 16500, 17400, 18200, 18800, 19700, 20600, 21400, 22700, 24000, 25200],
      },
      wps: [
        {
          code: 'WP-301',
          name: 'Guidance Logic',
          dates: '07/01–11/30',
          method: 'PERCENT',
          bac: 80000,
          ev_cum: 62000,
          spi: 0.93,
          cpi: 0.96,
        },
        {
          code: 'WP-302',
          name: 'Sensor Fusion',
          dates: '06/01–10/31',
          method: 'FIFTY_FIFTY',
          bac: 10000,
          ev_cum: 0,
          spi: 0.75,
          cpi: 0.80,
        },
        {
          code: 'WP-321',
          name: 'Servo Control',
          dates: '05/01–09/30',
          method: 'MILESTONE_WEIGHT',
          bac: 35000,
          ev_cum: 28000,
          spi: 0.90,
          cpi: 0.88,
        },
        {
          code: 'WP-322',
          name: 'Torque Tuning',
          dates: '07/15–12/15',
          method: 'PERCENT',
          bac: 25000,
          ev_cum: 10000,
          spi: 0.78,
          cpi: 0.85,
        },
        {
          code: 'WP-401',
          name: 'Nav Core',
          dates: '04/01–10/31',
          method: 'PERCENT',
          bac: 60000,
          ev_cum: 54000,
          spi: 1.06,
          cpi: 1.04,
        },
        {
          code: 'WP-402',
          name: 'Safety Module',
          dates: '06/01–12/31',
          method: 'PERCENT',
          bac: 40000,
          ev_cum: 14000,
          spi: 0.92,
          cpi: 0.95,
        },
      ],
      children: [
        {
          id: '1.1',
          name: 'Flight Controls',
          type: 'WBS',
          bac: 150000,
          pv_cum: 108000,
          ev_cum: 100000,
          ac_cum: 105000,
          series: {
            pv: [8500, 9100, 9800, 10200, 10600, 11100, 11600, 12100, 12800, 13600, 14400, 15500],
            ev: [8200, 8400, 8900, 9200, 9400, 9800, 10100, 10600, 11200, 11800, 12500, 13200],
            ac: [8700, 9200, 9800, 10200, 10400, 10700, 11100, 11600, 12100, 12800, 13500, 14100],
          },
          wps: [
            {
              code: 'WP-301',
              name: 'Guidance Logic',
              dates: '07/01–11/30',
              method: 'PERCENT',
              bac: 80000,
              ev_cum: 62000,
              spi: 0.93,
              cpi: 0.96,
            },
            {
              code: 'WP-302',
              name: 'Sensor Fusion',
              dates: '06/01–10/31',
              method: 'FIFTY_FIFTY',
              bac: 10000,
              ev_cum: 0,
              spi: 0.75,
              cpi: 0.80,
            },
            {
              code: 'WP-321',
              name: 'Servo Control',
              dates: '05/01–09/30',
              method: 'MILESTONE_WEIGHT',
              bac: 35000,
              ev_cum: 28000,
              spi: 0.90,
              cpi: 0.88,
            },
            {
              code: 'WP-322',
              name: 'Torque Tuning',
              dates: '07/15–12/15',
              method: 'PERCENT',
              bac: 25000,
              ev_cum: 10000,
              spi: 0.78,
              cpi: 0.85,
            },
          ],
          children: [
            {
              id: 'CA-101',
              name: 'Sensors',
              type: 'CA',
              bac: 90000,
              pv_cum: 65000,
              ev_cum: 62000,
              ac_cum: 68000,
              spi: 0.95,
              cpi: 0.91,
              series: {
                pv: [5400, 5700, 6100, 6300, 6400, 6700, 6900, 7100, 7500, 7900, 8300, 9000],
                ev: [5200, 5300, 5600, 5800, 5900, 6100, 6200, 6500, 6800, 7100, 7500, 8000],
                ac: [5500, 5900, 6300, 6500, 6600, 6800, 7000, 7300, 7600, 8000, 8400, 8800],
              },
              wps: [
                {
                  code: 'WP-301',
                  name: 'Guidance Logic',
                  dates: '07/01–11/30',
                  method: 'PERCENT',
                  bac: 80000,
                  ev_cum: 62000,
                  spi: 0.93,
                  cpi: 0.96,
                },
                {
                  code: 'WP-302',
                  name: 'Sensor Fusion',
                  dates: '06/01–10/31',
                  method: 'FIFTY_FIFTY',
                  bac: 10000,
                  ev_cum: 0,
                  spi: 0.75,
                  cpi: 0.80,
                },
              ],
            },
            {
              id: 'CA-102',
              name: 'Actuators',
              type: 'CA',
              bac: 60000,
              pv_cum: 43000,
              ev_cum: 38000,
              ac_cum: 37000,
              spi: 0.88,
              cpi: 1.03,
              series: {
                pv: [3100, 3400, 3700, 3900, 4200, 4400, 4700, 5000, 5300, 5700, 6100, 6500],
                ev: [3000, 3100, 3300, 3400, 3500, 3700, 3900, 4100, 4400, 4700, 5000, 5200],
                ac: [3200, 3300, 3500, 3700, 3800, 3900, 4100, 4300, 4500, 4800, 5100, 5300],
              },
              wps: [
                {
                  code: 'WP-321',
                  name: 'Servo Control',
                  dates: '05/01–09/30',
                  method: 'MILESTONE_WEIGHT',
                  bac: 35000,
                  ev_cum: 28000,
                  spi: 0.90,
                  cpi: 0.88,
                },
                {
                  code: 'WP-322',
                  name: 'Torque Tuning',
                  dates: '07/15–12/15',
                  method: 'PERCENT',
                  bac: 25000,
                  ev_cum: 10000,
                  spi: 0.78,
                  cpi: 0.85,
                },
              ],
            },
          ],
        },
        {
          id: '1.2',
          name: 'Software',
          type: 'WBS',
          bac: 100000,
          pv_cum: 72000,
          ev_cum: 68000,
          ac_cum: 71000,
          series: {
            pv: [6000, 6500, 7000, 7500, 8000, 8400, 8800, 9200, 9700, 10200, 10900, 11500],
            ev: [5500, 6100, 6400, 6900, 7500, 7900, 8200, 8700, 9100, 9600, 10200, 10800],
            ac: [6100, 6300, 6700, 7200, 7800, 8100, 8600, 9000, 9300, 9900, 10500, 11100],
          },
          wps: [
            {
              code: 'WP-401',
              name: 'Nav Core',
              dates: '04/01–10/31',
              method: 'PERCENT',
              bac: 60000,
              ev_cum: 54000,
              spi: 1.06,
              cpi: 1.04,
            },
            {
              code: 'WP-402',
              name: 'Safety Module',
              dates: '06/01–12/31',
              method: 'PERCENT',
              bac: 40000,
              ev_cum: 14000,
              spi: 0.92,
              cpi: 0.95,
            },
          ],
          children: [
            {
              id: 'CA-105',
              name: 'Navigation SW',
              type: 'CA',
              bac: 100000,
              pv_cum: 72000,
              ev_cum: 68000,
              ac_cum: 71000,
              spi: 0.94,
              cpi: 0.96,
              series: {
                pv: [6000, 6500, 7000, 7500, 8000, 8400, 8800, 9200, 9700, 10200, 10900, 11500],
                ev: [5500, 6100, 6400, 6900, 7500, 7900, 8200, 8700, 9100, 9600, 10200, 10800],
                ac: [6100, 6300, 6700, 7200, 7800, 8100, 8600, 9000, 9300, 9900, 10500, 11100],
              },
              wps: [
                {
                  code: 'WP-401',
                  name: 'Nav Core',
                  dates: '04/01–10/31',
                  method: 'PERCENT',
                  bac: 60000,
                  ev_cum: 54000,
                  spi: 1.06,
                  cpi: 1.04,
                },
                {
                  code: 'WP-402',
                  name: 'Safety Module',
                  dates: '06/01–12/31',
                  method: 'PERCENT',
                  bac: 40000,
                  ev_cum: 14000,
                  spi: 0.92,
                  cpi: 0.95,
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const mockCADetails: Record<string, CADetail> = {
  'CA-101': {
    id: 'CA-101',
    name: 'Sensors',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    manager: 'Jennifer Wu',
    startDate: '2025-01-15',
    endDate: '2025-11-30',
    status: 'Watch',
    asOf: '2025-10',
    kpis: {
      bac: 90000,
      pv_cum: 65000,
      ev_cum: 62000,
      ac_cum: 68000,
      sv_cum: -3000,
      cv_cum: -6000,
      spi: 0.95,
      cpi: 0.91,
      eac: 98900,
      etc: 30900,
      vac: -8900,
      tcpi: 1.12,
    },
    series: [
      { period: '2024-11', pv: 5400, ev: 5200, ac: 5500 },
      { period: '2024-12', pv: 5700, ev: 5300, ac: 5900 },
      { period: '2025-01', pv: 6100, ev: 5600, ac: 6300 },
      { period: '2025-02', pv: 6300, ev: 5800, ac: 6500 },
      { period: '2025-03', pv: 6400, ev: 5900, ac: 6600 },
      { period: '2025-04', pv: 6700, ev: 6100, ac: 6800 },
      { period: '2025-05', pv: 6900, ev: 6200, ac: 7000 },
      { period: '2025-06', pv: 7100, ev: 6500, ac: 7300 },
      { period: '2025-07', pv: 7500, ev: 6800, ac: 7600 },
      { period: '2025-08', pv: 7900, ev: 7100, ac: 8000 },
      { period: '2025-09', pv: 8300, ev: 7500, ac: 8400 },
      { period: '2025-10', pv: 9000, ev: 8000, ac: 8800 },
    ],
    workPackages: [
      {
        code: 'WP-301',
        name: 'Guidance Logic',
        dates: '07/01–11/30',
        method: 'PERCENT',
        bac: 80000,
        ev_cum: 62000,
        spi: 0.93,
        cpi: 0.96,
      },
      {
        code: 'WP-302',
        name: 'Sensor Fusion',
        dates: '06/01–10/31',
        method: 'FIFTY_FIFTY',
        bac: 10000,
        ev_cum: 0,
        spi: 0.75,
        cpi: 0.80,
      },
    ],
    variances: [
      {
        metric: 'Schedule Performance (SPI)',
        value: 0.95,
        threshold: 0.95,
        status: 'warning',
        comment: 'Slightly behind schedule due to test equipment delays',
      },
      {
        metric: 'Cost Performance (CPI)',
        value: 0.91,
        threshold: 0.95,
        status: 'critical',
        comment: 'Cost overrun on WP-301, additional senior engineer hours required',
      },
      {
        metric: 'Schedule Variance (SV)',
        value: -3000,
        threshold: -5000,
        status: 'warning',
        comment: 'Behind by ~1 week on sensor integration',
      },
      {
        metric: 'Cost Variance (CV)',
        value: -6000,
        threshold: -5000,
        status: 'critical',
        comment: 'Over budget due to rework and additional testing cycles',
      },
    ],
    feed: [
      {
        date: '2025-10-28',
        type: 'update',
        message: 'Actuals uploaded for October (+$8.8K total costs)',
      },
      {
        date: '2025-10-25',
        type: 'issue',
        message: 'WP-301: Test environment delay pushed completion by 5 days',
      },
      {
        date: '2025-10-20',
        type: 'milestone',
        message: 'WP-301 reached 75% completion milestone',
      },
      {
        date: '2025-10-15',
        type: 'bcr',
        message: 'BCR-005 approved: Additional $3K for sensor calibration tooling',
      },
      {
        date: '2025-10-10',
        type: 'update',
        message: 'Monthly status review completed with PM',
      },
    ],
  },
  'CA-102': {
    id: 'CA-102',
    name: 'Actuators',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    manager: 'Marcus Thompson',
    startDate: '2025-02-01',
    endDate: '2025-12-15',
    status: 'Watch',
    asOf: '2025-10',
    kpis: {
      bac: 60000,
      pv_cum: 43000,
      ev_cum: 38000,
      ac_cum: 37000,
      sv_cum: -5000,
      cv_cum: 1000,
      spi: 0.88,
      cpi: 1.03,
      eac: 58250,
      etc: 21250,
      vac: 1750,
      tcpi: 0.98,
    },
    series: [
      { period: '2024-11', pv: 3100, ev: 3000, ac: 3200 },
      { period: '2024-12', pv: 3400, ev: 3100, ac: 3300 },
      { period: '2025-01', pv: 3700, ev: 3300, ac: 3500 },
      { period: '2025-02', pv: 3900, ev: 3400, ac: 3700 },
      { period: '2025-03', pv: 4200, ev: 3500, ac: 3800 },
      { period: '2025-04', pv: 4400, ev: 3700, ac: 3900 },
      { period: '2025-05', pv: 4700, ev: 3900, ac: 4100 },
      { period: '2025-06', pv: 5000, ev: 4100, ac: 4300 },
      { period: '2025-07', pv: 5300, ev: 4400, ac: 4500 },
      { period: '2025-08', pv: 5700, ev: 4700, ac: 4800 },
      { period: '2025-09', pv: 6100, ev: 5000, ac: 5100 },
      { period: '2025-10', pv: 6500, ev: 5200, ac: 5300 },
    ],
    workPackages: [
      {
        code: 'WP-321',
        name: 'Servo Control',
        dates: '05/01–09/30',
        method: 'MILESTONE_WEIGHT',
        bac: 35000,
        ev_cum: 28000,
        spi: 0.90,
        cpi: 0.88,
      },
      {
        code: 'WP-322',
        name: 'Torque Tuning',
        dates: '07/15–12/15',
        method: 'PERCENT',
        bac: 25000,
        ev_cum: 10000,
        spi: 0.78,
        cpi: 0.85,
      },
    ],
    variances: [
      {
        metric: 'Schedule Performance (SPI)',
        value: 0.88,
        threshold: 0.95,
        status: 'critical',
        comment: 'Behind schedule due to mechanical design iterations',
      },
      {
        metric: 'Cost Performance (CPI)',
        value: 1.03,
        threshold: 0.95,
        status: 'good',
        comment: 'Under budget through efficient resource allocation',
      },
      {
        metric: 'Schedule Variance (SV)',
        value: -5000,
        threshold: -5000,
        status: 'critical',
        comment: 'Behind by ~2 weeks on actuator testing',
      },
      {
        metric: 'Cost Variance (CV)',
        value: 1000,
        threshold: -5000,
        status: 'good',
        comment: 'Cost savings from in-house testing',
      },
    ],
    feed: [
      {
        date: '2025-10-27',
        type: 'update',
        message: 'Progress report: WP-321 at 80% complete',
      },
      {
        date: '2025-10-22',
        type: 'milestone',
        message: 'WP-322 initiated, team ramping up',
      },
      {
        date: '2025-10-18',
        type: 'issue',
        message: 'Design review found issues requiring rework on servo mounts',
      },
      {
        date: '2025-10-12',
        type: 'update',
        message: 'Actuals updated for September',
      },
    ],
  },
  'CA-105': {
    id: 'CA-105',
    name: 'Navigation SW',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    manager: 'Rachel Kim',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    status: 'On Track',
    asOf: '2025-10',
    kpis: {
      bac: 100000,
      pv_cum: 72000,
      ev_cum: 68000,
      ac_cum: 71000,
      sv_cum: -4000,
      cv_cum: -3000,
      spi: 0.94,
      cpi: 0.96,
      eac: 104200,
      etc: 33200,
      vac: -4200,
      tcpi: 1.06,
    },
    series: [
      { period: '2024-11', pv: 6000, ev: 5500, ac: 6100 },
      { period: '2024-12', pv: 6500, ev: 6100, ac: 6300 },
      { period: '2025-01', pv: 7000, ev: 6400, ac: 6700 },
      { period: '2025-02', pv: 7500, ev: 6900, ac: 7200 },
      { period: '2025-03', pv: 8000, ev: 7500, ac: 7800 },
      { period: '2025-04', pv: 8400, ev: 7900, ac: 8100 },
      { period: '2025-05', pv: 8800, ev: 8200, ac: 8600 },
      { period: '2025-06', pv: 9200, ev: 8700, ac: 9000 },
      { period: '2025-07', pv: 9700, ev: 9100, ac: 9300 },
      { period: '2025-08', pv: 10200, ev: 9600, ac: 9900 },
      { period: '2025-09', pv: 10900, ev: 10200, ac: 10500 },
      { period: '2025-10', pv: 11500, ev: 10800, ac: 11100 },
    ],
    workPackages: [
      {
        code: 'WP-401',
        name: 'Nav Core',
        dates: '04/01–10/31',
        method: 'PERCENT',
        bac: 60000,
        ev_cum: 54000,
        spi: 1.06,
        cpi: 1.04,
      },
      {
        code: 'WP-402',
        name: 'Safety Module',
        dates: '06/01–12/31',
        method: 'PERCENT',
        bac: 40000,
        ev_cum: 14000,
        spi: 0.92,
        cpi: 0.95,
      },
    ],
    variances: [
      {
        metric: 'Schedule Performance (SPI)',
        value: 0.94,
        threshold: 0.95,
        status: 'warning',
        comment: 'Slightly behind due to integration testing delays',
      },
      {
        metric: 'Cost Performance (CPI)',
        value: 0.96,
        threshold: 0.95,
        status: 'good',
        comment: 'Within acceptable cost variance',
      },
      {
        metric: 'Schedule Variance (SV)',
        value: -4000,
        threshold: -5000,
        status: 'warning',
        comment: 'About 1 week behind on Safety Module',
      },
      {
        metric: 'Cost Variance (CV)',
        value: -3000,
        threshold: -5000,
        status: 'good',
        comment: 'Minor overrun, within tolerance',
      },
    ],
    feed: [
      {
        date: '2025-10-29',
        type: 'milestone',
        message: 'WP-401 Nav Core completed successfully',
      },
      {
        date: '2025-10-26',
        type: 'update',
        message: 'October actuals loaded (+$11.1K)',
      },
      {
        date: '2025-10-20',
        type: 'update',
        message: 'Code review completed for navigation algorithms',
      },
      {
        date: '2025-10-15',
        type: 'issue',
        message: 'WP-402: Integration test failures, fix in progress',
      },
      {
        date: '2025-10-08',
        type: 'update',
        message: 'Sprint 12 completed, 94% of planned stories done',
      },
    ],
  },
};

const mockWPDetails: Record<string, WPDetail> = {
  'WP-301': {
    code: 'WP-301',
    name: 'Guidance Logic',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    caId: 'CA-101',
    caName: 'Sensors',
    manager: 'Tom Anderson',
    startDate: '2025-07-01',
    endDate: '2025-11-30',
    status: 'Watch',
    percentComplete: 77.5,
    asOf: '2025-10',
    schedule: {
      plannedStart: '2025-07-01',
      plannedFinish: '2025-11-30',
      actualStart: '2025-07-08',
      actualFinish: null,
      forecastFinish: '2025-12-05',
    },
    evMethod: {
      type: 'PERCENT',
      description: 'Percent Complete - EV is earned based on estimated percent complete of work',
    },
    kpis: {
      bac: 80000,
      pv_cum: 66500,
      ev_cum: 62000,
      ac_cum: 64600,
      sv_cum: -4500,
      cv_cum: -2600,
      spi: 0.93,
      cpi: 0.96,
      eac: 83300,
      etc: 18700,
      vac: -3300,
    },
    series: [
      { period: '2025-07', pv: 8000, ev: 6500, ac: 7200 },
      { period: '2025-08', pv: 16000, ev: 14000, ac: 15100 },
      { period: '2025-09', pv: 24000, ev: 21500, ac: 22300 },
      { period: '2025-10', pv: 18500, ev: 20000, ac: 20000 },
    ],
    actuals: [
      { period: '2025-07', laborHours: 95, laborCost: 6800, materialCost: 200, otherCost: 200, totalCost: 7200 },
      { period: '2025-08', laborHours: 110, laborCost: 7500, materialCost: 300, otherCost: 300, totalCost: 8100 },
      { period: '2025-09', laborHours: 98, laborCost: 6800, materialCost: 250, otherCost: 150, totalCost: 7200 },
      { period: '2025-10', laborHours: 105, laborCost: 7200, materialCost: 400, otherCost: 400, totalCost: 8000 },
    ],
    feed: [
      {
        date: '2025-10-28',
        type: 'update',
        message: 'Progress update: 77.5% complete, on track for December delivery',
      },
      {
        date: '2025-10-25',
        type: 'issue',
        message: 'Test environment delay - impacts completion by 5 days',
      },
      {
        date: '2025-10-20',
        type: 'milestone',
        message: 'Reached 75% completion milestone',
      },
      {
        date: '2025-10-15',
        type: 'actual',
        message: 'October actuals loaded: 105 hours, $8.0K total',
      },
      {
        date: '2025-10-01',
        type: 'update',
        message: 'Code review passed, moving to integration testing phase',
      },
    ],
  },
  'WP-302': {
    code: 'WP-302',
    name: 'Sensor Fusion',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    caId: 'CA-101',
    caName: 'Sensors',
    manager: 'Lisa Chen',
    startDate: '2025-06-01',
    endDate: '2025-10-31',
    status: 'At Risk',
    percentComplete: 0,
    asOf: '2025-10',
    schedule: {
      plannedStart: '2025-06-01',
      plannedFinish: '2025-10-31',
      actualStart: '2025-06-15',
      actualFinish: null,
      forecastFinish: '2025-11-30',
    },
    evMethod: {
      type: 'FIFTY_FIFTY',
      description: '50/50 Method - 50% EV at start, 50% at completion',
      milestones: [
        { name: 'Start', date: '2025-06-15', weight: 50, status: 'complete' },
        { name: 'Complete', date: '2025-10-31', weight: 50, status: 'pending' },
      ],
    },
    kpis: {
      bac: 10000,
      pv_cum: 10000,
      ev_cum: 5000,
      ac_cum: 6250,
      sv_cum: -5000,
      cv_cum: -1250,
      spi: 0.50,
      cpi: 0.80,
      eac: 12500,
      etc: 6250,
      vac: -2500,
    },
    series: [
      { period: '2025-06', pv: 2000, ev: 5000, ac: 1500 },
      { period: '2025-07', pv: 2000, ev: 0, ac: 1250 },
      { period: '2025-08', pv: 2000, ev: 0, ac: 1500 },
      { period: '2025-09', pv: 2000, ev: 0, ac: 1000 },
      { period: '2025-10', pv: 2000, ev: 0, ac: 1000 },
    ],
    actuals: [
      { period: '2025-06', laborHours: 18, laborCost: 1400, materialCost: 50, otherCost: 50, totalCost: 1500 },
      { period: '2025-07', laborHours: 16, laborCost: 1150, materialCost: 50, otherCost: 50, totalCost: 1250 },
      { period: '2025-08', laborHours: 20, laborCost: 1400, materialCost: 50, otherCost: 50, totalCost: 1500 },
      { period: '2025-09', laborHours: 12, laborCost: 900, materialCost: 50, otherCost: 50, totalCost: 1000 },
      { period: '2025-10', laborHours: 12, laborCost: 900, materialCost: 50, otherCost: 50, totalCost: 1000 },
    ],
    feed: [
      {
        date: '2025-10-28',
        type: 'issue',
        message: 'Critical: Work package stalled, escalated to CA manager',
      },
      {
        date: '2025-10-15',
        type: 'actual',
        message: 'October actuals: 12 hours, $1.0K',
      },
      {
        date: '2025-09-20',
        type: 'issue',
        message: 'Resource conflict - engineer reassigned to higher priority task',
      },
      {
        date: '2025-08-10',
        type: 'update',
        message: 'Work delayed due to dependencies on WP-301',
      },
    ],
  },
  'WP-401': {
    code: 'WP-401',
    name: 'Nav Core',
    projectId: 'alpha',
    projectName: 'Project Alpha',
    caId: 'CA-105',
    caName: 'Navigation SW',
    manager: 'Kevin Park',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    status: 'Complete',
    percentComplete: 100,
    asOf: '2025-10',
    schedule: {
      plannedStart: '2025-04-01',
      plannedFinish: '2025-10-31',
      actualStart: '2025-04-01',
      actualFinish: '2025-10-29',
      forecastFinish: '2025-10-29',
    },
    evMethod: {
      type: 'PERCENT',
      description: 'Percent Complete - EV earned based on estimated percent complete',
    },
    kpis: {
      bac: 60000,
      pv_cum: 51000,
      ev_cum: 54000,
      ac_cum: 51900,
      sv_cum: 3000,
      cv_cum: 2100,
      spi: 1.06,
      cpi: 1.04,
      eac: 57700,
      etc: 0,
      vac: 2300,
    },
    series: [
      { period: '2025-04', pv: 6000, ev: 6500, ac: 6200 },
      { period: '2025-05', pv: 7000, ev: 7500, ac: 7100 },
      { period: '2025-06', pv: 8000, ev: 8500, ac: 8000 },
      { period: '2025-07', pv: 9000, ev: 9500, ac: 9100 },
      { period: '2025-08', pv: 10000, ev: 10500, ac: 10200 },
      { period: '2025-09', pv: 11000, ev: 11500, ac: 11300 },
    ],
    actuals: [
      { period: '2025-04', laborHours: 82, laborCost: 5900, materialCost: 150, otherCost: 150, totalCost: 6200 },
      { period: '2025-05', laborHours: 96, laborCost: 6800, materialCost: 150, otherCost: 150, totalCost: 7100 },
      { period: '2025-06', laborHours: 108, laborCost: 7700, materialCost: 150, otherCost: 150, totalCost: 8000 },
      { period: '2025-07', laborHours: 122, laborCost: 8800, materialCost: 150, otherCost: 150, totalCost: 9100 },
      { period: '2025-08', laborHours: 136, laborCost: 9900, materialCost: 150, otherCost: 150, totalCost: 10200 },
      { period: '2025-09', laborHours: 151, laborCost: 11000, materialCost: 150, otherCost: 150, totalCost: 11300 },
    ],
    feed: [
      {
        date: '2025-10-29',
        type: 'milestone',
        message: 'Work package completed successfully - 2 days early!',
      },
      {
        date: '2025-10-25',
        type: 'update',
        message: 'Final testing complete, documentation wrapped up',
      },
      {
        date: '2025-10-15',
        type: 'update',
        message: 'Integration testing passed all test cases',
      },
      {
        date: '2025-09-30',
        type: 'milestone',
        message: 'Code complete milestone achieved',
      },
      {
        date: '2025-09-15',
        type: 'actual',
        message: 'September actuals: 151 hours, $11.3K',
      },
    ],
  },
};

export const mockApi = {
  getPortfolio: (): Promise<ProjectRow[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPortfolio), 300);
    });
  },

  getProject: (id: string): Promise<ProjectRow | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = mockPortfolio.find((p) => p.id === id);
        resolve(project || null);
      }, 300);
    });
  },

  getProjectDetail: (id: string): Promise<ProjectDetail | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProjectDetails[id] || null);
      }, 300);
    });
  },

  getWBSData: (projectId: string): Promise<WBSData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockWBSData[projectId] || null);
      }, 300);
    });
  },

  getCADetail: (caId: string): Promise<CADetail | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCADetails[caId] || null);
      }, 300);
    });
  },

  getWPDetail: (wpCode: string): Promise<WPDetail | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockWPDetails[wpCode] || null);
      }, 300);
    });
  },
};
