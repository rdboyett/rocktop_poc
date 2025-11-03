# Rocktop EVMS - React/MUI Implementation Plan

**Version:** 1.0  
**Date:** 2025-11-03  
**Scope:** Convert static HTML EVMS prototype to React + Material-UI SPA

---

## Executive Summary

This document outlines the plan to transform the Rocktop EVMS static HTML prototype into a modern React application using Material-UI components. **The EVMS application will replace the current MUI dashboard template entirely.** The implementation will preserve all PRD requirements while leveraging MUI's component library for consistency, accessibility, and maintainability.

**Key Point:** We are NOT keeping the existing dashboard. The Portfolio page from the EVMS static HTML becomes the new default home page.

---

## 1. Architecture Overview

### Current State
- **Static HTML**: 15 HTML pages with inline styles and vanilla JavaScript
- **Dark theme**: Custom CSS variables
- **Navigation**: Fixed top nav + collapsible side nav
- **Data**: Mock data in JavaScript objects
- **Charts**: Vanilla Canvas API

### Target State
- **React SPA**: Component-based architecture with React Router
- **MUI Components**: Replace custom HTML/CSS with MUI equivalents
- **TypeScript**: Type-safe development
- **Mock Data Layer**: Centralized mock API service
- **Charts**: Recharts or MUI X Charts (already in use)
- **State Management**: React Context for global state (theme, navigation, filters)
- **Local Storage**: Preserved for scenarios, commits, audit notes

---

## 2. Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Main layout wrapper (EVMS design)
│   │   ├── TopNav.tsx             # Top navigation bar (EVMS design)
│   │   ├── SideNav.tsx            # Collapsible side navigation (EVMS design)
│   │   └── Breadcrumbs.tsx        # Page breadcrumbs
│   ├── evms/
│   │   ├── portfolio/
│   │   │   ├── PortfolioTable.tsx
│   │   │   ├── PortfolioFilters.tsx
│   │   │   └── AlertsSummary.tsx
│   │   ├── project/
│   │   │   ├── ProjectOverview.tsx
│   │   │   ├── KPITiles.tsx
│   │   │   └── PVEVACChart.tsx
│   │   ├── wbs/
│   │   │   ├── WBSTree.tsx
│   │   │   ├── WBSDetail.tsx
│   │   │   └── WorkPackageTable.tsx
│   │   ├── workpackage/
│   │   │   └── WorkPackageDetail.tsx
│   │   ├── uploads/
│   │   │   ├── UploadWizard.tsx
│   │   │   ├── ColumnMapper.tsx
│   │   │   ├── ValidationPanel.tsx
│   │   │   └── PreviewChart.tsx
│   │   ├── progress/
│   │   │   └── BulkProgressGrid.tsx
│   │   ├── forecast/
│   │   │   ├── ForecastSandbox.tsx
│   │   │   ├── ForecastControls.tsx
│   │   │   ├── ScenarioComparison.tsx
│   │   │   └── CommitModal.tsx
│   │   ├── baselines/
│   │   │   ├── BaselineCompare.tsx
│   │   │   └── BCRLog.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboard.tsx
│   │   ├── alerts/
│   │   │   └── AlertsTable.tsx
│   │   ├── vendors/
│   │   │   ├── VendorsTable.tsx
│   │   │   └── CostClassesTable.tsx
│   │   ├── admin/
│   │   │   ├── AdminSettings.tsx
│   │   │   ├── IntegrationsPanel.tsx
│   │   │   └── ValidationRules.tsx
│   │   ├── reports/
│   │   │   └── ReportsLibrary.tsx
│   │   └── shared/
│   │       ├── AuditModal.tsx      # Reusable audit modal
│   │       ├── KPIPill.tsx         # SPI/CPI indicator
│   │       ├── SparkLine.tsx       # Inline sparkline
│   │       └── ExportButton.tsx    # CSV export
├── pages/
│   ├── PortfolioPage.tsx
│   ├── ProjectOverviewPage.tsx
│   ├── WBSPage.tsx
│   ├── WorkPackageDetailPage.tsx
│   ├── UploadsPage.tsx
│   ├── BulkProgressPage.tsx
│   ├── ForecastPage.tsx
│   ├── BaselinesPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── AlertsPage.tsx
│   ├── VendorsPage.tsx
│   ├── AdminPage.tsx
│   └── ReportsPage.tsx
├── services/
│   ├── mockApi.ts                 # Mock data service
│   ├── localStorage.ts            # LocalStorage utilities
│   └── calculations.ts            # EVMS calculations (EAC, TCPI, etc.)
├── types/
│   ├── evms.ts                    # EVMS data types
│   ├── project.ts
│   └── forecast.ts
├── context/
│   ├── EVMSContext.tsx            # Global EVMS state
│   └── ThemeContext.tsx           # Theme toggle
├── hooks/
│   ├── useEVMSData.ts
│   ├── useLocalStorage.ts
│   └── useExportCSV.ts
└── utils/
    ├── formatters.ts              # Currency, date, number formatters
    ├── validators.ts              # Upload validation logic
    └── chartHelpers.ts            # Chart data transformation

```

---

## 3. Page-by-Page Conversion Strategy

### 3.1 Portfolio (index.html)
**MUI Components:**
- `Box`, `Container` - Layout
- `DataGrid` from `@mui/x-data-grid` - Main table with sort/filter
- `TextField` with `InputAdornment` - Search
- `Chip` - Filter pills (SPI<1, CPI<1)
- `Select`, `MenuItem` - Saved views dropdown
- `Button` - Export CSV
- `Alert` - Alerts summary section
- `SparkLineChart` from `@mui/x-charts` - Inline trends

**Key Features:**
- Replace vanilla table with MUI DataGrid
- Custom cell renderers for SPI/CPI pills and sparklines
- Client-side filtering and sorting
- Link project names to Project Overview page with React Router

---

### 3.2 Project Overview (project-overview.html)
**MUI Components:**
- `Card`, `CardContent` - Section containers
- `Grid2` - Responsive tile layout for KPIs
- `Typography` - Headers and labels
- `Chip` - Status indicators
- `LineChart` from `@mui/x-charts` - PV/EV/AC time series
- `Table`, `TableRow` - Variance table
- `List`, `ListItem` - Activity feed
- `IconButton` - Audit icon

**Key Features:**
- KPI tiles with conditional coloring (OK/Warn/Bad)
- Interactive chart with time window selector
- "What Changed" feed with timestamps
- Quick links to WBS, Uploads, Forecast, Baselines

---

### 3.3 WBS & Control Accounts (wbs.html)
**MUI Components:**
- `TreeView` from `@mui/x-tree-view` - WBS hierarchy (already available!)
- `TextField` - Tree search/filter
- `Breadcrumbs` - Navigation path
- `Card` - Detail panels
- `Chip` - SPI/CPI badges on tree nodes
- `DataGrid` - Work packages table
- `LineChart` - Time-phased chart

**Key Features:**
- Expandable/collapsible tree with search
- Selected node highlights
- Aggregated metrics roll-up
- Click WP to navigate to detail page

---

### 3.4 Work Package Detail (wp-detail.html)
**MUI Components:**
- `Card` with `CardHeader` - WP info header
- `Grid2` - KPI tiles
- `LineChart` - Time-phased PV/EV/AC
- `Table` - Monthly data rows
- `IconButton` + `Tooltip` - Audit button
- `Badge` - Baseline/commit markers on chart

**Key Features:**
- Similar to Project Overview but WP-scoped
- Cumulative and period metrics
- Audit modal integration

---

### 3.5 Time-Phased Uploads (uploads.html)
**MUI Components:**
- `Tabs`, `Tab` - PV vs AC toggle
- `Stepper` - Upload wizard steps
- `Button` with `input type="file"` - File picker
- `Select` - Column mapping dropdowns
- `Alert`, `AlertTitle` - Validation messages
- `DataGrid` - Preview grid with row errors
- `LinearProgress` - Upload progress
- `LineChart` - Before/after comparison

**Key Features:**
- Multi-step wizard (Upload → Map → Validate → Preview → Apply)
- Inline validation with error highlighting
- CSV parsing client-side
- Month-end enforcement
- Download template button

---

### 3.6 Bulk Progress Entry (bulk-progress.html)
**MUI Components:**
- `DataGrid` with editable cells - Main grid
- `TextField` type="number" - Inline % editing
- `Button` - Save/Confirm actions
- `Dialog` - Confirmation modal
- `Alert` - Success/error messages

**Key Features:**
- Inline editing with validation (0-100%)
- Highlight invalid cells
- Draft → Confirm flow
- Show count of updated WPs

---

### 3.7 Forecasting & EAC Sandbox (forecast.html)
**MUI Components:**
- `Grid2` - Two-column layout (controls | results)
- `TextField` type="number" - Input fields
- `Select` - Method dropdown
- `Slider` - Future CPI/SPI sliders
- `Card` - KPI tiles
- `LineChart` - Forecast trend
- `List`, `ListItem` - Saved scenarios
- `Table` - Scenario comparison
- `Dialog` - Commit modal
- `Snackbar` - Success toast

**Key Features:**
- Real-time EAC calculation
- Scenario save/load from localStorage
- Compare multiple scenarios
- Commit modal with version metadata
- Export scenarios to CSV/JSON

---

### 3.8 Baselines & BCRs (baselines.html)
**MUI Components:**
- `Select` - Baseline selector
- `BarChart` - BAC delta by WBS
- `DataGrid` - BCR log table
- `Button` - Export CSV

**Key Features:**
- Compare current vs prior baseline
- BCR status tracking (Pending, Approved, Rejected)
- Export baseline diff

---

### 3.9 Analytics & Reports (analytics.html)
**MUI Components:**
- `Grid2` - Widget layout
- `LineChart`, `BarChart` - Trend charts
- `DateRangePicker` from `@mui/x-date-pickers` - Date filters
- `Select` - Program/project filters
- `Card` - Chart containers

**Key Features:**
- Portfolio-level trend analysis
- Interactive filters
- Export chart data

---

### 3.10 Alerts Center (alerts.html)
**MUI Components:**
- `DataGrid` - Alerts table
- `Chip` - Severity badges
- `Link` - Deep links to affected items
- `Checkbox` - Select alerts (future)

**Key Features:**
- Sortable/filterable alerts
- Click to navigate to problem area
- Severity color coding

---

### 3.11 Vendors & Cost Classes (vendors.html)
**MUI Components:**
- `Tabs` - Vendors vs Cost Classes
- `DataGrid` - Both tables
- `Button` - Add/Edit actions
- `Dialog` - Add/Edit forms
- `TextField` - Form inputs

**Key Features:**
- CRUD operations (UI only, no backend)
- CSV export

---

### 3.12 Admin Settings (admin.html)
**MUI Components:**
- `Tabs` - Settings sections
- `Accordion` - Collapsible sections
- `Switch` - Toggle settings
- `TextField` - Text inputs
- `Select` - Dropdowns
- `Button` - Save actions

**Key Features:**
- Integration settings
- Validation rules config
- Roles management (placeholder)
- Org settings

---

### 3.13 Reports Library (reports.html)
**MUI Components:**
- `DataGrid` - Reports table
- `Button` - Run/Export actions
- `IconButton` - Action icons
- `Chip` - Report type badges

**Key Features:**
- Saved reports list
- Run → navigate to Analytics with filters
- CSV/PDF export (PDF placeholder)

---

### 3.14 Audit & Lineage Modal (audit-modal.html)
**MUI Components:**
- `Dialog` - Modal container
- `DialogTitle`, `DialogContent`, `DialogActions`
- `Stepper` (horizontal) - Lineage flow
- `Timeline` from `@mui/lab` - Event log
- `LineChart` - Value sparkline
- `TextField` multiline - Notes textarea
- `Button` - Copy permalink, Save note

**Key Features:**
- Reusable modal component
- `openAudit(payload)` API preserved
- Lineage visualization
- Event log table
- Persistent notes in localStorage
- Permalink generation
- Esc to close

---

## 4. Shared Component Library

### 4.1 KPIPill Component
```tsx
<KPIPill 
  label="SPI" 
  value={0.92} 
  threshold={{ ok: 1.0, warn: 0.9 }} 
/>
```
**Renders:** MUI `Chip` with conditional color

---

### 4.2 SparkLine Component
```tsx
<SparkLine 
  data={[0.91, 0.93, 0.89, 0.92]} 
  trend="up" | "down" | "neutral"
  width={68} 
  height={22} 
/>
```
**Renders:** MUI `SparkLineChart` or custom SVG

---

### 4.3 ExportButton Component
```tsx
<ExportButton 
  data={rows} 
  filename="portfolio.csv" 
  format="csv" | "json" 
/>
```
**Renders:** MUI `Button` with download logic

---

### 4.4 AuditButton Component
```tsx
<AuditButton 
  payload={auditPayload} 
  onOpen={() => openAudit(payload)} 
/>
```
**Renders:** MUI `IconButton` with audit icon

---

## 5. Routing Structure

```tsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<PortfolioPage />} />
    <Route path="project/:projectId" element={<ProjectOverviewPage />} />
    <Route path="project/:projectId/wbs" element={<WBSPage />} />
    <Route path="project/:projectId/wbs/:wpCode" element={<WorkPackageDetailPage />} />
    <Route path="uploads" element={<UploadsPage />} />
    <Route path="bulk-progress" element={<BulkProgressPage />} />
    <Route path="forecast" element={<ForecastPage />} />
    <Route path="baselines" element={<BaselinesPage />} />
    <Route path="analytics" element={<AnalyticsPage />} />
    <Route path="alerts" element={<AlertsPage />} />
    <Route path="vendors" element={<VendorsPage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="reports" element={<ReportsPage />} />
  </Route>
</Routes>
```

---

## 6. Theme & Styling Strategy

### 6.1 MUI Theme Customization
- Extend existing MUI dashboard theme
- Add EVMS-specific color tokens:
  - `evms.ok` → #16a34a (green)
  - `evms.warn` → #f59e0b (amber)
  - `evms.bad` → #ef4444 (red)
  - `evms.brand` → #0e7afe (blue)
- Dark mode support (toggle in TopNav)

### 6.2 Style Approach
- **Prefer MUI components**: Use `sx` prop for overrides
- **Avoid custom CSS**: Leverage theme tokens
- **Responsive**: Use MUI Grid2 and breakpoints
- **Accessibility**: ARIA labels, keyboard nav, focus management

---

## 7. Data Architecture

### 7.1 Mock Data Service
```tsx
// services/mockApi.ts
export const mockApi = {
  getPortfolio: () => Promise<ProjectRow[]>,
  getProject: (id) => Promise<Project>,
  getWBS: (projectId) => Promise<WBSNode>,
  getWorkPackage: (wpCode) => Promise<WorkPackage>,
  uploadData: (file, type) => Promise<UploadResult>,
  ...
}
```

### 7.2 Local Storage Keys
- `rocktop_commits` - Forecast commits array
- `rocktop_audit_notes` - Audit notes map
- `rocktop_theme` - Theme preference
- `rocktop_nav_pinned` - Sidenav state
- `rocktop_scenarios` - Saved forecast scenarios

### 7.3 EVMS Calculations
```tsx
// services/calculations.ts
export const calculateSPI = (ev: number, pv: number): number
export const calculateCPI = (ev: number, ac: number): number
export const calculateEAC = (method: string, params: EACParams): number
export const calculateTCPI = (bac: number, ev: number, eac: number, ac: number): number
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up routing with React Router
- [ ] Create AppLayout with TopNav and SideNav
- [ ] Implement theme toggle (light/dark)
- [ ] Build mock data service
- [ ] Create shared components (KPIPill, SparkLine, ExportButton)
- [ ] Implement AuditModal component

### Phase 2: Core Pages (Week 2-3)
- [ ] Portfolio page with DataGrid
- [ ] Project Overview page
- [ ] WBS page with TreeView
- [ ] Work Package Detail page
- [ ] Wire up navigation and routing

### Phase 3: Data Management (Week 4)
- [ ] Uploads page with wizard
- [ ] Bulk Progress grid with inline editing
- [ ] CSV parsing and validation
- [ ] Preview chart integration

### Phase 4: Forecasting & Analysis (Week 5)
- [ ] Forecast sandbox with calculations
- [ ] Scenario save/compare
- [ ] Commit modal
- [ ] Baselines page with comparison
- [ ] Analytics dashboard

### Phase 5: Supporting Pages (Week 6)
- [ ] Alerts page
- [ ] Vendors & Cost Classes
- [ ] Admin settings
- [ ] Reports library
- [ ] Polish and bug fixes

### Phase 6: Testing & Documentation (Week 7)
- [ ] End-to-end user flows
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] User documentation
- [ ] Deployment guide

---

## 9. Key Design Decisions

### 9.1 Use MUI X Data Grid
- **Why**: Powerful table with built-in sort/filter/export
- **Trade-off**: Heavier bundle, but saves custom implementation
- **Decision**: Use for Portfolio, WBS, Vendors, Admin tables

### 9.2 Use MUI X Charts
- **Why**: Already in dashboard, consistent API
- **Trade-off**: Less flexible than D3, but good enough for EVMS charts
- **Decision**: Use for all PV/EV/AC time series, sparklines

### 9.3 Keep Calculations Client-Side
- **Why**: POC with no backend, fast iteration
- **Trade-off**: Limited scalability, but acceptable for prototype
- **Decision**: All EVMS math in `services/calculations.ts`

### 9.4 Preserve LocalStorage Keys
- **Why**: PRD specifies keys, enables future migration
- **Trade-off**: None
- **Decision**: Keep all localStorage contracts from PRD

### 9.5 Use React Context for Global State
- **Why**: Lightweight, built-in, sufficient for POC
- **Trade-off**: Not Redux, but avoids complexity
- **Decision**: EVMSContext for filters, nav state, theme

---

## 10. Migration from Static HTML

### 10.1 HTML → JSX Conversion
1. Copy HTML structure from static files
2. Convert class → className
3. Replace inline styles with `sx` prop
4. Replace `<div>` with MUI components
5. Extract event handlers to functions
6. Add TypeScript types

### 10.2 CSS → MUI Theme
1. Map CSS variables to theme tokens
2. Convert utility classes to `sx` props
3. Remove custom CSS files
4. Use theme breakpoints for responsive

### 10.3 JavaScript → React Hooks
1. Convert DOM queries to refs
2. Replace event listeners with props
3. Move state to useState/useReducer
4. Extract calculations to services
5. Replace fetch with mock API calls

---

## 11. Success Criteria

- [ ] All 15 pages functional with React Router navigation
- [ ] MUI components used throughout (no custom HTML tables)
- [ ] Dark/light theme toggle works
- [ ] All PRD user flows work end-to-end
- [ ] Audit modal opens from any metric
- [ ] Forecast commit saves to localStorage and downloads CSV/JSON
- [ ] Uploads wizard validates and previews data
- [ ] Bulk progress grid allows inline editing
- [ ] Export CSV works on all tables
- [ ] No TypeScript errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] ARIA labels for accessibility

---

## 12. Out of Scope (Future Work)

- Real backend API integration
- Authentication/authorization
- Server-side pagination
- PDF export generation
- Real-time collaboration
- Role-based access control
- Multi-tenant support
- Internationalization (i18n)
- Automated testing (unit/integration)
- CI/CD pipeline

---

## 13. Open Questions

1. **Charting Library**: Stick with MUI X Charts or add Recharts for more flexibility?
   - **Recommendation**: MUI X Charts for consistency

2. **DataGrid Edition**: Use free `@mui/x-data-grid` or Pro with advanced features?
   - **Recommendation**: Start with free, upgrade if needed

3. **TreeView Depth**: How many levels deep should WBS tree render?
   - **Recommendation**: Lazy load beyond 3 levels

4. **Mobile UX**: Should we support full mobile experience or desktop-first?
   - **Recommendation**: Desktop-first, mobile-friendly but limited

5. **State Management**: Context sufficient or add Zustand/Redux?
   - **Recommendation**: Context for POC, revisit if complexity grows

---

## 14. Next Steps

1. **Review this plan** with stakeholders
2. **Set up project structure** (folders, routing, layout)
3. **Start Phase 1** (Foundation)
4. **Daily standups** to track progress
5. **Iterate based on feedback**

---

**End of Implementation Plan**  
© 2025 Rocktop Systems – EVMS React/MUI Migration
