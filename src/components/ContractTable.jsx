import React from 'react';

const StatusPill = ({ status }) => {
  const statusStyles = {
    'In Review': 'bg-blue-100 text-blue-700',
    'Approved': 'bg-green-100 text-green-700',
    'Draft': 'bg-slate-100 text-slate-700',
    'Executed': 'bg-purple-100 text-purple-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ progress, daysRemaining }) => {
  const colorClass = progress >= 70 ? 'bg-green-500' : progress >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-slate-600 whitespace-nowrap">{daysRemaining}d remaining</span>
    </div>
  );
};

const RiskCircle = ({ score }) => {
  const colorClass = score >= 70 ? 'border-red-400' : score >= 40 ? 'border-orange-400' : 'border-green-400';
  
  return (
    <div className={`w-10 h-10 rounded-full border-2 ${colorClass} flex items-center justify-center font-semibold text-sm`}>
      {score}
    </div>
  );
};

const ContractTable = ({ contracts, onRowClick }) => {
  return (
    <section className="overflow-x-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Internal SLA
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Risk Score
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                onClick={() => onRowClick(contract)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-semibold text-slate-900">{contract.name}</div>
                    <div className="text-xs text-slate-500">{contract.id}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={contract.status} />
                </td>
                <td className="px-4 py-3">
                  <ProgressBar progress={contract.slaProgress} daysRemaining={contract.slaDaysRemaining} />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-900">
                      {contract.value > 0 ? `$${(contract.value / 1000).toFixed(0)}k` : 'N/A'}
                    </div>
                    <div className="text-xs text-slate-500">{contract.valueLabel}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RiskCircle score={contract.riskScore} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title="View"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(contract);
                      }}
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="p-2 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title="Edit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      className="p-2 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title="More"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            onClick={() => onRowClick(contract)}
            className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            {/* Name and ID */}
            <div className="mb-3">
              <div className="font-semibold text-slate-900 text-base mb-1">{contract.name}</div>
              <div className="text-xs text-slate-500">{contract.id}</div>
            </div>

            {/* Status and Value Row */}
            <div className="flex items-center justify-between mb-3">
              <StatusPill status={contract.status} />
              <div className="text-right">
                <div className="font-medium text-slate-900 text-base">
                  {contract.value > 0 ? `$${(contract.value / 1000).toFixed(0)}k` : 'N/A'}
                </div>
                <div className="text-xs text-slate-500">{contract.valueLabel}</div>
              </div>
            </div>

            {/* SLA Progress */}
            <div className="mb-3">
              <ProgressBar progress={contract.slaProgress} daysRemaining={contract.slaDaysRemaining} />
            </div>

            {/* Risk Score */}
            <div className="mb-3">
              <div className="text-xs text-slate-500 mb-1">Risk Score</div>
              <RiskCircle score={contract.riskScore} />
            </div>

            {/* Action Buttons - Single Row */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-200">
              <button
                className="p-3 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-1"
                title="View"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(contract);
                }}
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                className="p-3 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-1"
                title="Edit"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                className="p-3 hover:bg-slate-200 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-1"
                title="More"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContractTable;
