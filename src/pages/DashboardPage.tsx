import React from 'react';
import { useScanContext } from '../context/ScanContext';
import { ThreatDistributionChart } from '../components/charts/ThreatDistributionChart';
import { RiskHistogram } from '../components/charts/RiskHistogram';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { ScanResult } from '../types';
import { Shield, Globe, Mail, PhoneCall, Activity, AlertTriangle, ShieldCheck, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface DashboardPageProps {
  onViewReport: (scan: ScanResult) => void;
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onViewReport, onNavigate }) => {
  const { stats, history } = useScanContext();

  return (
    <div className="space-y-8 py-4">
      {/* Top Metrics Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">SOC Threat Intelligence Dashboard</h2>
          <p className="text-xs text-slate-400">Live multi-channel telemetry and threat distribution metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Live SOC Feed: Nominal</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-mono">TOTAL SCANS</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{stats.totalScans}</div>
          <div className="text-[10px] text-slate-500 mt-1">Across all 3 channels</div>
        </div>

        <div className="bg-[#0B132B] border border-emerald-500/20 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-mono">SAFE TARGETS</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.safeCount}</div>
          <div className="text-[10px] text-emerald-400/70 mt-1">Verified legitimate</div>
        </div>

        <div className="bg-[#0B132B] border border-amber-500/20 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-mono">SUSPICIOUS</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{stats.suspiciousCount}</div>
          <div className="text-[10px] text-amber-400/70 mt-1">Elevated risk</div>
        </div>

        <div className="bg-[#0B132B] border border-rose-500/20 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-mono">PHISHING DETECTED</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{stats.phishingCount}</div>
          <div className="text-[10px] text-rose-400/70 mt-1">Blocked / Quarantined</div>
        </div>

        <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
          <div className="text-slate-400 text-xs font-mono">AVG RISK SCORE</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">{stats.averageRiskScore}<span className="text-xs text-slate-400">/100</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Normalized severity</div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatDistributionChart
          safeCount={stats.safeCount}
          suspiciousCount={stats.suspiciousCount}
          phishingCount={stats.phishingCount}
        />
        <RiskHistogram scans={history} />
      </div>

      {/* Channel Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('url')}
          className="bg-[#0B132B] border border-cyan-500/30 hover:border-cyan-400 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Globe size={18} />
              <h4 className="text-sm font-bold font-mono">Website / URL</h4>
            </div>
            <ArrowRight size={14} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{stats.channelCounts.url}</div>
          <p className="text-xs text-slate-400 mt-1">Lexical structure & DNS entropy checks</p>
        </div>

        <div
          onClick={() => onNavigate('email')}
          className="bg-[#0B132B] border border-blue-500/30 hover:border-blue-400 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Mail size={18} />
              <h4 className="text-sm font-bold font-mono">Email & SMS</h4>
            </div>
            <ArrowRight size={14} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{stats.channelCounts.email}</div>
          <p className="text-xs text-slate-400 mt-1">NLP urgency & credential harvest detection</p>
        </div>

        <div
          onClick={() => onNavigate('call')}
          className="bg-[#0B132B] border border-purple-500/30 hover:border-purple-400 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-purple-400">
              <PhoneCall size={18} />
              <h4 className="text-sm font-bold font-mono">Phone Call Transcripts</h4>
            </div>
            <ArrowRight size={14} className="text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{stats.channelCounts.call}</div>
          <p className="text-xs text-slate-400 mt-1">Vishing heuristics & OTP extortion protection</p>
        </div>
      </div>

      {/* Recent Threats Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-100 font-mono">Recent Threat Interceptions</h4>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            View Full Scan History
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5">TIME</th>
                <th className="pb-2.5">CHANNEL</th>
                <th className="pb-2.5">TARGET / PAYLOAD</th>
                <th className="pb-2.5">RISK SCORE</th>
                <th className="pb-2.5">STATUS</th>
                <th className="pb-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.slice(0, 6).map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 text-slate-500">{scan.timestamp.slice(11)}</td>
                  <td className="py-3 uppercase font-semibold">
                    {scan.channel === 'url' ? '🌐 URL' : scan.channel === 'email' ? '📧 Email' : '📞 Call'}
                  </td>
                  <td className="py-3 truncate max-w-xs text-slate-200" title={scan.targetInput}>
                    {scan.targetInput}
                  </td>
                  <td className="py-3 font-bold">
                    <span className={scan.riskScore >= 70 ? 'text-rose-400' : scan.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                      {scan.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3">
                    <ThreatBadge classification={scan.classification} size="sm" />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onViewReport(scan)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 text-[11px]"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
