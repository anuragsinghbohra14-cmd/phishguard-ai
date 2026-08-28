import React, { useState } from 'react';
import { useScanContext } from '../context/ScanContext';
import { ScanResult } from '../types';
import { exportReportAsJson, exportReportAsText } from '../utils/reportGenerator';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge';
import { ThreatReasons } from '../components/common/ThreatReasons';
import { FileText, Download, Printer, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface ThreatReportsPageProps {
  selectedScan: ScanResult | null;
}

export const ThreatReportsPage: React.FC<ThreatReportsPageProps> = ({ selectedScan }) => {
  const { history, latestScan } = useScanContext();
  const [activeScan, setActiveScan] = useState<ScanResult | null>(selectedScan || latestScan || history[0] || null);

  if (!activeScan) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <FileText size={48} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-300 font-mono">No Threat Reports Generated Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Run a scan on any URL, message, or call to generate a detailed intelligence report.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              OFFICIAL INCIDENT REPORT
            </span>
            <span className="text-xs font-mono text-slate-500">#{activeScan.id}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Threat Intelligence Report</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportReportAsJson(activeScan)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            Export JSON
          </button>
          <button
            onClick={() => exportReportAsText(activeScan)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Download size={14} />
            Download Summary (TXT)
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {/* Select Report Dropdown if multiple exist */}
      {history.length > 1 && (
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Select Report Record:</span>
          <select
            value={activeScan.id}
            onChange={(e) => {
              const found = history.find(s => s.id === e.target.value);
              if (found) setActiveScan(found);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none"
          >
            {history.map(h => (
              <option key={h.id} value={h.id}>
                {h.id} — [{h.channel.toUpperCase()}] {h.classification} ({h.timestamp})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Report Document Container */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 print:bg-white print:text-black">
        {/* Metadata Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">THREAT ID</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{activeScan.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">TIMESTAMP</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{activeScan.timestamp}</span>
          </div>
          <div>
            <span className="text-slate-500 block">CHANNEL VECTOR</span>
            <span className="text-cyan-400 font-bold mt-0.5 block uppercase">{activeScan.channel}</span>
          </div>
          <div>
            <span className="text-slate-500 block">ENGINE VERSION</span>
            <span className="text-slate-200 font-bold mt-0.5 block">{activeScan.modelVersion}</span>
          </div>
        </div>

        {/* Executive Threat Assessment */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <RiskScoreGauge score={activeScan.riskScore} confidence={activeScan.confidence} size={150} />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <ThreatBadge classification={activeScan.classification} size="lg" />
            <div className="text-xs text-slate-400 font-mono">TARGET PAYLOAD:</div>
            <div className="text-sm font-mono text-slate-100 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {activeScan.targetInput}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Mitigation Status: <span className="text-rose-400 font-bold">{activeScan.preventionStatus}</span> • Model Latency: {activeScan.executionTimeMs}ms
            </div>
          </div>
        </div>

        {/* Explainable Reasons */}
        <div className="border-t border-slate-800 pt-6">
          <ThreatReasons reasons={activeScan.reasons} title="Detailed Threat Indicators & Heuristics" />
        </div>

        {/* Defensive Actions */}
        <div className="border-t border-slate-800 pt-6">
          <h4 className="text-sm font-bold text-slate-200 font-mono mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Recommended Defensive Mitigation Protocol
          </h4>
          <div className="space-y-2">
            {activeScan.recommendedActions.map((action, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="text-cyan-400 font-mono font-bold">0{i + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
