import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import PortfolioPage from './pages/PortfolioPage';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import WBSPage from './pages/WBSPage';

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<PortfolioPage />} />
            <Route path="project/:projectId" element={<ProjectOverviewPage />} />
            <Route path="project/:projectId/wbs" element={<WBSPage />} />
            {/* More routes will be added as pages are implemented */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
