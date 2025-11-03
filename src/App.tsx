import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import PortfolioPage from './pages/PortfolioPage';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import WBSPage from './pages/WBSPage';
import CADetailPage from './pages/CADetailPage';
import WPDetailPage from './pages/WPDetailPage';

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<PortfolioPage />} />
            <Route path="project/:projectId" element={<ProjectOverviewPage />} />
            <Route path="project/:projectId/wbs" element={<WBSPage />} />
            <Route path="project/:projectId/ca/:caId" element={<CADetailPage />} />
            <Route path="project/:projectId/wp/:wpCode" element={<WPDetailPage />} />
            {/* More routes will be added as pages are implemented */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
