import React, { useState } from 'react';
import { useScanContext } from '../context/ScanContext';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { ScanResult, ThreatClassification, ScanChannel } from '../types';
import { History, Search, Trash2, Download, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import { exportReportAsJson } from '../utils/reportGenerator';

interface ScanHistoryPageProps {
  onViewReport: (scan: ScanResult) => void;
}

export const ScanHistoryPage: React.FC<ScanHistoryPageProps> = ({ onViewReport }) => {
  const { history, clearHistory } = useScanContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.targetInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = filterChannel === 'ALL' || item.channel.toUpperCase() === filterChannel;
    const matchesClass = filterClass === 'ALL' || item.classification === filterClass;
    return matchesSearch && matchesChannel && matchesClass;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100 font-mono">Scan History & Audit Log</h2>
            <p className="text-xs text-slate-400">Chronological telemetry records of all evaluated threats</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Clear Log
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search target, domain, ID..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
        </div>

        <div>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Channels (URL, Email, Call)</option>
            <option value="URL">Website / URL</option>
            <option value="EMAIL">Email / Message</option>
            <option value="CALL">Phone Call</option>
          </select>
        </div>

        <div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Classifications</option>
            <option value="SAFE">Safe Only</option>
            <option value="SUSPICIOUS">Suspicious Only</option>
            <option value="PHISHING">Phishing Only</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="p-4">DATE & TIME</th>
                <th className="p-4">CHANNEL</th>
                <th className="p-4">TARGET INPUT</th>
                <th className="p-4">RISK SCORE</th>
                <th className="p-4">CLASSIFICATION</th>
                <th className="p-4">CONFIDENCE</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No scan history matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 text-slate-500 whitespace-nowrap">{scan.timestamp}</td>
                    <td className="p-4 uppercase font-semibold">
                      {scan.channel === 'url' ? '🌐 URL' : scan.channel === 'email' ? '📧 Email' : '📞 Call'}
                    </td>
                    <td className="p-4 max-w-xs truncate font-medium text-slate-200" title={scan.targetInput}>
                      {scan.targetInput}
                    </td>
                    <td className="p-4 font-bold">
                      <span className={scan.riskScore >= 70 ? 'text-rose-400' : scan.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                        {scan.riskScore}/100
                      </span>
                    </td>
                    <td className="p-4">
                      <ThreatBadge classification={scan.classification} size="sm" />
                    </td>
                    <td className="p-4 text-slate-400">{(scan.confidence * 100).toFixed(0)}%</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewReport(scan)}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 text-[11px] mr-1.5"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => exportReportAsJson(scan)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
                        title="Download JSON"
                      >
                        <Download size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
