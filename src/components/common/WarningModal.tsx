import React from 'react';
import { ScanResult } from '../../types';
import { ShieldAlert, AlertTriangle, ArrowLeft, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface WarningModalProps {
  scan: ScanResult | null;
  onClose: () => void;
  onViewReport: (scan: ScanResult) => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  scan,
  onClose,
  onViewReport,
}) => {
  if (!scan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B132B] border-2 border-rose-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative glow-rose">
        <div className="flex items-center gap-3 text-rose-400 mb-4">
          <div className="p-2.5 bg-rose-950/70 border border-rose-500/40 rounded-xl">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Potential Phishing Website Intercepted</h3>
            <p className="text-xs text-rose-400 font-mono uppercase tracking-wider">Zero-Trust Safe Navigation Shield</p>
          </div>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-5">
          <div className="text-xs text-slate-400 font-mono mb-1">SUSPICIOUS DESTINATION TARGET:</div>
          <div className="text-sm font-mono text-rose-300 break-all select-all font-semibold bg-rose-950/30 p-2 rounded border border-rose-900/50">
            {scan.targetInput}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="font-bold text-rose-400 ml-1.5 font-mono">{scan.riskScore}/100</span>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span>
              <span className="font-bold text-cyan-400 ml-1.5 font-mono">{(scan.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-400" />
            Security Defensive Notice:
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            PhishGuard AI detected severe credential harvesting and brand impersonation indicators. Navigating to this website may compromise your passwords, OTPs, or financial accounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/50"
          >
            <ArrowLeft size={16} />
            Go Back (Safe)
          </button>

          <button
            onClick={() => {
              onClose();
              onViewReport(scan);
            }}
            className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <FileText size={16} />
            View Full Threat Report
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-500">
            For security, live navigation to flagged phishing targets is disabled in this defensive sandbox.
          </span>
        </div>
      </div>
    </div>
  );
};
