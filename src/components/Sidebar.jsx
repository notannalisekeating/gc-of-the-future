import React from 'react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Contract Repository' },
    { label: 'Clause Library' },
    { label: 'Risk Analytics' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-screen fixed left-0 top-0">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="font-serif text-xl font-semibold text-white">ContractOS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`block px-4 py-2 rounded-md transition-colors ${
                  item.active
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium">GC</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">General Counsel</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
