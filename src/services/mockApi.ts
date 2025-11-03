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

  // Add more API methods as needed
};
