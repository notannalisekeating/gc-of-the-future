import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import KPIGrid from './components/KPIGrid';
import ExposureHeatmap from './components/ExposureHeatmap';
import ContractTable from './components/ContractTable';
import DetailDrawer from './components/DetailDrawer';
import { contracts } from './data';

function App() {
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (contract) => {
    setSelectedContract(contract);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContract(null);
  };

  const handleThemeToggle = (isDark) => {
    // Theme toggle logic can be implemented here
    console.log('Theme toggled:', isDark);
  };

  const handleExport = () => {
    // Export logic can be implemented here
    console.log('Export clicked');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <HeaderBar onThemeToggle={handleThemeToggle} onExport={handleExport} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full max-w-full">
            {/* Page Title */}
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 mb-6 md:mb-8">
              Contract Dashboard
            </h1>

            {/* KPI Grid */}
            <KPIGrid />

            {/* Exposure Heatmap */}
            <ExposureHeatmap />

            {/* Contract Table */}
            <ContractTable contracts={contracts} onRowClick={handleRowClick} />
          </div>
        </main>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        contract={selectedContract}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default App;
