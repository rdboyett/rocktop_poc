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

export interface WBSData {
  projectId: string;
  projectName: string;
  asOf: string;
  seriesMonths: string[];
  root: WBSNode;
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

  // Add more API methods as needed
};
