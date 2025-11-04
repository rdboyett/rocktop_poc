# Rocktop EVMS - Frontend POC

A modern Earned Value Management System (EVMS) built with React, TypeScript, and Material-UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Project Overview

Rocktop EVMS is a comprehensive proof-of-concept for an enterprise-grade Earned Value Management System. It provides project managers, control account managers, and executives with real-time insights into project performance, cost tracking, and schedule adherence.

### Key Features

- **Portfolio Dashboard** - Multi-project overview with KPIs, filtering, and drill-down capabilities
- **Project Management** - Detailed project views with WBS hierarchy and performance metrics
- **Work Package Tracking** - Granular work package and control account management
- **Data Import/Export** - CSV upload capabilities for PV and AC data with validation
- **Bulk Operations** - Spreadsheet-style progress entry for multiple work packages
- **Forecasting Tools** - Interactive EAC sandbox with scenario modeling
- **Baseline Management** - Version control and change request tracking
- **Analytics & Reporting** - Portfolio trends, heatmaps, and executive reports
- **Alert Center** - Centralized alert management with severity filtering
- **Settings & Configuration** - Comprehensive application and integration settings

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v6
- **Routing**: React Router v6
- **Charts**: MUI X Charts
- **Data Grid**: MUI X Data Grid
- **Build Tool**: Vite
- **Styling**: MUI's styled components and sx prop

## 📁 Project Structure

```
src/
├── components/
│   ├── evms/
│   │   └── shared/        # Shared EVMS components (KPIPill, SparkLine, etc.)
│   └── layout/            # Layout components (AppLayout, PageHeader, SideNav)
├── context/               # React contexts (Theme, SideNav)
├── pages/                 # Page components
│   ├── PortfolioPage.tsx
│   ├── ProjectOverviewPage.tsx
│   ├── WBSPage.tsx
│   ├── CADetailPage.tsx
│   ├── WPDetailPage.tsx
│   ├── ReportsPage.tsx
│   ├── UploadsPage.tsx
│   ├── BulkProgressPage.tsx
│   ├── ForecastPage.tsx
│   ├── BaselinesPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── AlertsPage.tsx
│   ├── SetupWizardPage.tsx
│   ├── VendorsPage.tsx
│   └── SettingsPage.tsx
├── services/              # API and data services
└── App.tsx               # Root component
```

## 🎯 Core Functionality

### Portfolio Management
- Multi-project dashboard with real-time KPIs
- Advanced filtering by program, status, SPI/CPI thresholds
- Searchable data grid with sorting and pagination
- Clickable project cards for drill-down navigation

### Project Tracking
- Hierarchical WBS tree with expandable nodes
- Control Account and Work Package detail views
- Performance charts (cumulative, variance, forecasts)
- Activity feeds and milestone tracking
- Cost breakdown by vendor and cost class

### Data Management
- **PV Upload**: Upload planned value data with date/amount validation
- **AC Upload**: Upload actual cost data with column mapping
- **Bulk Progress Entry**: Spreadsheet-style interface for updating multiple work packages
- **Validation**: Configurable rules (month-end dates, negative amounts, WBS mapping)
- **Export**: CSV export for all major data views

### Forecasting & Analytics
- **EAC Sandbox**: Interactive "what-if" scenario simulator
  - Multiple forecast methods (CPI, SPI×CPI, Hybrid, Manual)
  - Adjustable future performance assumptions
  - Risk adders and management reserve
  - Scenario save/compare functionality
- **Portfolio Analytics**: Trend analysis and performance heatmaps
- **Baseline Comparison**: Version control with delta tracking
- **BCR Management**: Baseline change request workflow

### Reporting
- Executive summary reports
- CPR Format 1 (Cumulative performance by WBS)
- Variance analysis reports
- Forecast reports
- Status reports
- Configurable filters and CSV export

### System Configuration
- **Integrations**: ERP, Schedule System (P6/MSP), Notifications (Email/Slack)
- **Validation Rules**: Data quality controls and alert thresholds
- **User Preferences**: Theme, date format, default views
- **Organization Settings**: Fiscal year, timezone, data retention

## 🎨 Design Features

### Responsive Layout
- Collapsible sidebar navigation with hover/pin functionality
- Adaptive grid layouts for different screen sizes
- Mobile-friendly data tables with horizontal scroll

### Theme Support
- Light/Dark mode toggle
- System default option
- Persistent user preference
- Smooth transitions

### User Experience
- Breadcrumb navigation
- Loading states and skeletons
- Empty states with helpful actions
- Inline validation with real-time feedback
- Tooltips and help text
- Toast notifications

## 📊 Data Visualization

- **Line Charts**: Cumulative performance, trends over time
- **Bar Charts**: Variance analysis, baseline deltas
- **Sparklines**: Inline trend indicators in tables
- **KPI Pills**: Color-coded performance indicators (SPI, CPI, TCPI)
- **Heatmaps**: Project performance by program

## 🔒 Data Validation

- Month-end date enforcement
- Negative amount controls
- Required WBS mapping
- Performance threshold alerts
- Duplicate detection
- Missing data warnings

## 🚦 Status Indicators

- **Green**: On track (SPI/CPI ≥ 1.0)
- **Yellow**: At risk (SPI/CPI 0.95-0.99)
- **Red**: Critical (SPI/CPI < 0.95)

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Portfolio | Multi-project dashboard |
| `/project/:id` | Project Overview | Single project KPIs and navigation |
| `/project/:id/wbs` | WBS | Hierarchical work breakdown structure |
| `/project/:id/ca/:id` | Control Account | CA performance and work packages |
| `/project/:id/wp/:code` | Work Package | Detailed WP tracking |
| `/reports` | Reports | Report catalog |
| `/reports/cpr-format-1` | CPR Format 1 | Performance by WBS table |
| `/uploads` | Uploads | Data import (PV/AC) |
| `/bulk-progress` | Bulk Progress | Multi-WP progress entry |
| `/forecast` | Forecast Sandbox | EAC scenario modeling |
| `/baselines` | Baselines & BCRs | Version control and change requests |
| `/analytics` | Analytics | Portfolio trends and heatmaps |
| `/alerts` | Alerts Center | System alert management |
| `/setup` | Setup Wizard | New project onboarding |
| `/vendors` | Vendors & Cost Classes | Vendor and cost class management |
| `/settings` | Settings | Application configuration |

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Environment Setup
```bash
# Clone repository
git clone <repo-url>
cd rocktop_frontend_poc

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🎯 Future Enhancements

### API Integration
- Connect to Django backend
- Real-time data synchronization
- WebSocket support for live updates
- Authentication and authorization

### Advanced Features
- Role-based access control
- Custom report builder
- Automated email digests
- Mobile app
- Offline support
- Advanced charting (Gantt, PERT)

### Performance Optimization
- Virtual scrolling for large datasets
- Memoization and code splitting
- Service worker caching
- Progressive Web App (PWA)

## 📝 Mock Data

Currently uses mock data services (`src/services/mockApi.ts`) for demonstration. In production, these would be replaced with actual API calls to the Django backend.

## 🤝 Contributing

This is a proof-of-concept project. For production deployment:
1. Replace mock data with real API integration
2. Implement authentication/authorization
3. Add comprehensive error handling
4. Include unit and integration tests
5. Set up CI/CD pipeline
6. Configure environment variables

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built by the Rocktop EVMS development team.

---

**Version**: 0.1 POC  
**Last Updated**: November 2024
