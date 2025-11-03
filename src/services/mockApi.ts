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

  // Add more API methods as needed
};
