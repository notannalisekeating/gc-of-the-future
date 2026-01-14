import React from 'react';
import { heatmapData } from '../data';

const HeatmapCell = ({ value, risk }) => {
  const bgClass = {
    high: 'bg-red-100',
    medium: 'bg-yellow-50',
    low: 'bg-green-50',
  }[risk] || 'bg-slate-50';

  const textClass = {
    high: 'text-red-900',
    medium: 'text-yellow-900',
    low: 'text-slate-500',
  }[risk] || 'text-slate-500';

  return (
    <td className={`${bgClass} text-center font-bold py-4 px-4 border border-slate-200`}>
      <span className={textClass}>{value}%</span>
    </td>
  );
};

const ExposureHeatmap = () => {
  return (
    <section className="mb-6 md:mb-8 overflow-x-hidden">
      <div className="mb-4">
        <h2 className="text-sm uppercase tracking-wide text-slate-500 mb-2">Exposure Analysis</h2>
        <h3 className="text-lg md:text-xl font-semibold text-slate-900">Risk Heatmap</h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-600 font-semibold border border-slate-200"></th>
              {heatmapData.cols.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-center text-xs uppercase tracking-wide text-slate-600 font-semibold border border-slate-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.rows.map((row) => (
              <tr key={row}>
                <td className="px-4 py-3 font-medium text-slate-900 border border-slate-200 bg-slate-50">
                  {row}
                </td>
                {heatmapData.cols.map((col) => {
                  const key = `${row}-${col}`;
                  const cell = heatmapData.cells[key];
                  return (
                    <HeatmapCell
                      key={key}
                      value={cell.value}
                      risk={cell.risk}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {heatmapData.rows.map((row) => (
          <div
            key={row}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="font-semibold text-slate-900 mb-3 text-base">{row}</div>
            <div className="space-y-2">
              {heatmapData.cols.map((col) => {
                const key = `${row}-${col}`;
                const cell = heatmapData.cells[key];
                const bgClass = {
                  high: 'bg-red-100',
                  medium: 'bg-yellow-50',
                  low: 'bg-green-50',
                }[cell.risk] || 'bg-slate-50';

                const textClass = {
                  high: 'text-red-900',
                  medium: 'text-yellow-900',
                  low: 'text-slate-500',
                }[cell.risk] || 'text-slate-500';

                return (
                  <div
                    key={key}
                    className={`${bgClass} rounded-md p-3 flex items-center justify-between`}
                  >
                    <span className="text-sm font-medium text-slate-700">{col}</span>
                    <span className={`font-bold ${textClass}`}>{cell.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExposureHeatmap;
