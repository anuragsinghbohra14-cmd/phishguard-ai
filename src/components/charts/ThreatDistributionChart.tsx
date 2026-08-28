import React from 'react';

interface ThreatDistributionChartProps {
  safeCount: number;
  suspiciousCount: number;
  phishingCount: number;
}

export const ThreatDistributionChart: React.FC<ThreatDistributionChartProps> = ({
  safeCount,
  suspiciousCount,
  phishingCount,
}) => {
  const total = Math.max(1, safeCount + suspiciousCount + phishingCount);
  const safePct = Math.round((safeCount / total) * 100);
  const suspiciousPct = Math.round((suspiciousCount / total) * 100);
  const phishingPct = Math.round((phishingCount / total) * 100);

  return (
    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-200 font-mono">Threat Classification Ratio</h4>
        <span className="text-xs text-slate-400 font-mono">{total} total scans</span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-800 mb-5">
        <div
          style={{ width: `${safePct}%` }}
          className="bg-emerald-500 rounded-l-full transition-all duration-500 hover:opacity-80"
          title={`Safe: ${safeCount} (${safePct}%)`}
        />
        <div
          style={{ width: `${suspiciousPct}%` }}
          className="bg-amber-500 transition-all duration-500 hover:opacity-80"
          title={`Suspicious: ${suspiciousCount} (${suspiciousPct}%)`}
        />
        <div
          style={{ width: `${phishingPct}%` }}
          className="bg-rose-500 rounded-r-full transition-all duration-500 hover:opacity-80"
          title={`Phishing: ${phishingCount} (${phishingPct}%)`}
        />
      </div>

      {/* Legend Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Safe
          </div>
          <div className="text-lg font-bold font-mono text-slate-100">{safeCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">{safePct}%</div>
        </div>

        <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-semibold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Suspicious
          </div>
          <div className="text-lg font-bold font-mono text-slate-100">{suspiciousCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">{suspiciousPct}%</div>
        </div>

        <div className="bg-rose-950/40 border border-rose-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1.5 text-rose-400 font-semibold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Phishing
          </div>
          <div className="text-lg font-bold font-mono text-slate-100">{phishingCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">{phishingPct}%</div>
        </div>
      </div>
    </div>
  );
};
