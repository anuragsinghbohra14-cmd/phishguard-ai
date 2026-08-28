import React from 'react';
import { ScanResult } from '../../types';

interface RiskHistogramProps {
  scans: ScanResult[];
}

export const RiskHistogram: React.FC<RiskHistogramProps> = ({ scans }) => {
  const buckets = [
    { label: '0–25 (Low)', count: 0, color: 'bg-emerald-500', barColor: 'from-emerald-600 to-emerald-400' },
    { label: '26–50 (Med)', count: 0, color: 'bg-cyan-500', barColor: 'from-cyan-600 to-cyan-400' },
    { label: '51–75 (High)', count: 0, color: 'bg-amber-500', barColor: 'from-amber-600 to-amber-400' },
    { label: '76–100 (Critical)', count: 0, color: 'bg-rose-500', barColor: 'from-rose-600 to-rose-400' },
  ];

  scans.forEach(s => {
    if (s.riskScore <= 25) buckets[0].count++;
    else if (s.riskScore <= 50) buckets[1].count++;
    else if (s.riskScore <= 75) buckets[2].count++;
    else buckets[3].count++;
  });

  const maxCount = Math.max(1, ...buckets.map(b => b.count));

  return (
    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-200 font-mono">Risk Score Distribution</h4>
        <span className="text-xs text-slate-400 font-mono">Density Curve</span>
      </div>

      <div className="space-y-3">
        {buckets.map((b, i) => {
          const widthPct = Math.round((b.count / maxCount) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{b.label}</span>
                <span className="text-slate-400 font-bold">{b.count} events</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  style={{ width: `${Math.max(6, widthPct)}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${b.barColor} transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
