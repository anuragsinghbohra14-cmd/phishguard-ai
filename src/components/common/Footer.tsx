import React from 'react';
import { Shield, ShieldAlert, Cpu, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030712] border-t border-slate-800/80 py-8 px-4 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-200 font-mono">PhishGuard AI — Defense System</div>
            <div className="text-[11px] text-slate-500">Smart India Hackathon 2026 Prototype</div>
          </div>
        </div>

        <div className="text-center md:text-left text-[11px] text-slate-400 max-w-xl">
          <p className="font-mono text-cyan-400/80 mb-1">
            "Detect Phishing Before It Detects You."
          </p>
          <p className="text-slate-500 leading-relaxed">
            Defensive prototype designed for real-time multi-channel threat analysis across URLs, emails, SMS, and voice call transcripts. Results provide probabilistic threat scoring and explainable heuristic indicators.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Award size={14} className="text-amber-400" />
            SIH Prototype
          </span>
          <span>•</span>
          <span className="text-emerald-400">Zero-Trust Architecture</span>
        </div>
      </div>
    </footer>
  );
};
