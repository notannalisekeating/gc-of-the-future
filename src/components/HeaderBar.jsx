import React, { useState } from 'react';

const HeaderBar = ({ onThemeToggle, onExport }) => {
  const [isDark, setIsDark] = useState(false);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    onThemeToggle?.(!isDark);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-600">
          <span className="text-slate-400">/</span> Dashboard
        </nav>

        {/* Search and Actions - Stacked on mobile */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:flex-1 md:justify-end gap-3 md:gap-0">
          {/* Search Input */}
          <div className="w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full px-4 py-3 md:py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-3 md:p-2 rounded-md hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="px-6 py-3 md:px-4 md:py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors min-h-[44px] font-medium"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
