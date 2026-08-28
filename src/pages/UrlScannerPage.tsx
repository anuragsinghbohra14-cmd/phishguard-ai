import React, { useState } from 'react';
import { Globe, Search, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Lock, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { useScanContext } from '../context/ScanContext';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { ThreatReasons } from '../components/common/ThreatReasons';
import { LoadingScanner } from '../components/common/LoadingScanner';
import { WarningModal } from '../components/common/WarningModal';

interface UrlScannerPageProps {
  onViewReport: (scan: ScanResult) => void;
}

export const UrlScannerPage: React.FC<UrlScannerPageProps> = ({ onViewReport }) => {
  const { addScanResult } = useScanContext();
  const [urlInput, setUrlInput] = useState('http://paypal.com.verify-user-security-update.top/auth/signin?token=938210');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);

  const sampleUrls = [
    { label: 'Safe Bank Portal', url: 'https://netbanking.hdfcbank.com/netbanking/' },
    { label: 'PayPal Spoof Phish', url: 'http://paypal.com.verify-user-security-update.top/auth/signin?token=938210' },
    { label: 'Raw IP Phish Host', url: 'http://192.168.1.104:8080/secure_update.html' },
    { label: 'Google Search', url: 'https://www.google.com' }
  ];

  const handleScan = async (targetUrl = urlInput) => {
    if (!targetUrl.trim()) {
      setErrorMessage('Please enter a website URL to analyze.');
      return;
    }
    setErrorMessage('');
    setIsScanning(true);
    setResult(null);

    try {
      const scanRes = await api.scanUrl(targetUrl);
      setResult(scanRes);
      addScanResult(scanRes);
      if (scanRes.classification === 'PHISHING') {
        setShowWarningModal(true);
      }
    } catch (err) {
      setErrorMessage('Scan failed. Please check network connection.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
          <Globe size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Website & URL Scanner</h2>
          <p className="text-xs text-slate-400">
            Real-time lexical structure, entropy, domain reputation, and SSL threat analysis
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-[#0B132B] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider block">
          Enter Website URL:
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://example.com or suspicious-link.top"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl py-3 pl-4 pr-10 text-sm text-slate-100 font-mono focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          <button
            disabled={isScanning}
            onClick={() => handleScan(urlInput)}
            className="py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all font-mono shadow-lg shadow-cyan-950 disabled:opacity-50"
          >
            {isScanning ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            Analyze URL
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 font-mono mt-1">{errorMessage}</p>
        )}

        {/* Quick Samples */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Quick Samples:</span>
          {sampleUrls.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setUrlInput(s.url);
                handleScan(s.url);
              }}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-[11px] font-mono transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && <LoadingScanner channel="url" />}

      {/* Results View */}
      {result && !isScanning && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Threat Banner */}
          <div className={`rounded-2xl p-6 border ${
            result.classification === 'PHISHING'
              ? 'bg-rose-950/30 border-rose-500/50 glow-rose'
              : result.classification === 'SUSPICIOUS'
              ? 'bg-amber-950/30 border-amber-500/50 glow-amber'
              : 'bg-emerald-950/30 border-emerald-500/40 glow-emerald'
          }`}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <RiskScoreGauge score={result.riskScore} confidence={result.confidence} size={150} />
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5">
                    <ThreatBadge classification={result.classification} size="lg" />
                    <span className="text-xs text-slate-400 font-mono">
                      Latency: {result.executionTimeMs}ms
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 font-mono break-all max-w-xl">
                    {result.targetInput}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Evaluated by <span className="text-cyan-400 font-mono">{result.modelVersion}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-48 shrink-0">
                <button
                  onClick={() => onViewReport(result)}
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-mono transition-colors shadow-lg"
                >
                  View Full Threat Report
                </button>
                {result.classification === 'PHISHING' && (
                  <button
                    onClick={() => setShowWarningModal(true)}
                    className="w-full py-2.5 px-4 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-mono transition-colors"
                  >
                    Open Safety Shield
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Granular URL Features Table */}
          {result.urlFeatures && (
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-200 font-mono mb-4 flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                Extracted Heuristic & Lexical Features
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Domain Host:</span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5" title={result.urlFeatures.domain}>
                    {result.urlFeatures.domain}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Protocol & SSL:</span>
                  <span className={`font-semibold mt-0.5 block ${result.urlFeatures.isHttps ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.urlFeatures.protocol.toUpperCase()} ({result.urlFeatures.isHttps ? 'Valid HTTPS' : 'Insecure HTTP'})
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Shannon Entropy:</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{result.urlFeatures.entropy} bits</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">URL Length:</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{result.urlFeatures.length} characters</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Subdomain Depth:</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{result.urlFeatures.subdomainDepth} level(s)</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Raw IP Target:</span>
                  <span className={`font-semibold mt-0.5 block ${result.urlFeatures.hasIpAddress ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.urlFeatures.hasIpAddress ? 'YES (High Risk)' : 'NO (Clean)'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Suspicious Keywords:</span>
                  <span className="text-cyan-300 font-semibold mt-0.5 block">
                    {result.urlFeatures.suspiciousTokens.length > 0 ? result.urlFeatures.suspiciousTokens.join(', ') : 'None'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Domain Age Risk:</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">
                    {result.urlFeatures.domainAgeDays ? `${result.urlFeatures.domainAgeDays} days` : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Explainable Reasons */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <ThreatReasons reasons={result.reasons} title="Why was this URL flagged?" />
          </div>

          {/* Prevention Recommended Actions */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-200 font-mono mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Recommended Security Actions
            </h4>
            <div className="space-y-2">
              {result.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interception Warning Modal */}
      {showWarningModal && result && (
        <WarningModal
          scan={result}
          onClose={() => setShowWarningModal(false)}
          onViewReport={onViewReport}
        />
      )}
    </div>
  );
};
