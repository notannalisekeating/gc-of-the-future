import React from 'react';
import { kpiData } from '../data';

const KPICard = ({ label, value, change, changeType }) => {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-500',
  }[changeType] || 'text-slate-500';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">
        {value}
      </div>
      <div className={`text-sm ${changeColorClass}`}>
        {change}
      </div>
    </div>
  );
};

const KPIGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <KPICard
        label="ACTIVE CONTRACTS"
        value={kpiData.activeContracts.value}
        change={kpiData.activeContracts.change}
        changeType={kpiData.activeContracts.changeType}
      />
      <KPICard
        label="AT SLA RISK"
        value={kpiData.atSlaRisk.value}
        change={kpiData.atSlaRisk.change}
        changeType={kpiData.atSlaRisk.changeType}
      />
      <KPICard
        label="PENDING MARKUPS"
        value={kpiData.pendingMarkups.value}
        change={kpiData.pendingMarkups.change}
        changeType={kpiData.pendingMarkups.changeType}
      />
      <KPICard
        label="AVG. DEVIATION"
        value={kpiData.avgDeviation.value}
        change={kpiData.avgDeviation.change}
        changeType={kpiData.avgDeviation.changeType}
      />
    </div>
  );
};

export default KPIGrid;
