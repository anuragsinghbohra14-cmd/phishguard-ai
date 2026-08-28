import React from 'react';
import { ThreatReason } from '../../types';
import { AlertCircle, AlertOctagon, ShieldAlert, Info } from 'lucide-react';

interface ThreatReasonsProps {
  reasons: ThreatReason[];
  title?: string;
}

export const ThreatReasons: React.FC<ThreatReasonsProps> = ({
  reasons,
  title = "Why was this flagged?"
}) => {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-center">
        <p className="text-sm text-emerald-400 font-medium">✓ No suspicious flags or malicious heuristics triggered.</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: ThreatReason['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
          icon: <AlertOctagon size={16} className="text-rose-400 shrink-0 mt-0.5" />,
          tag: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      case 'high':
        return {
          border: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
          icon: <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />,
          tag: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'medium':
        return {
          border: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
          icon: <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />,
          tag: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        };
      default:
        return {
          border: 'border-slate-700 bg-slate-900/50 text-slate-300',
          icon: <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />,
          tag: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ShieldAlert size={16} className="text-cyan-400" />
          {title}
        </h4>
        <span className="text-xs text-slate-400 font-mono">{reasons.length} indicator(s) identified</span>
      </div>

      <div className="space-y-2.5">
        {reasons.map((r) => {
          const style = getSeverityBadge(r.severity);
          return (
            <div
              key={r.id}
              className={`border rounded-lg p-3.5 ${style.border} transition-all duration-200 hover:border-opacity-80`}
            >
              <div className="flex items-start gap-2.5">
                {style.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h5 className="text-sm font-semibold text-slate-100">{r.title}</h5>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${style.tag}`}>
                        {r.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                        {r.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
