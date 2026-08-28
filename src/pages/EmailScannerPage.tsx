import React, { useState } from 'react';
import { Mail, Search, RefreshCw, ShieldAlert, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Link2, UserCheck, AlertOctagon } from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { useScanContext } from '../context/ScanContext';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { ThreatReasons } from '../components/common/ThreatReasons';
import { LoadingScanner } from '../components/common/LoadingScanner';

interface EmailScannerPageProps {
  onViewReport: (scan: ScanResult) => void;
}

export const EmailScannerPage: React.FC<EmailScannerPageProps> = ({ onViewReport }) => {
  const { addScanResult } = useScanContext();
  const [subject, setSubject] = useState('URGENT: Your account will be suspended today - Verify Now');
  const [sender, setSender] = useState('security-alert@service-security-update247.net');
  const [body, setBody] = useState(`Dear Valued Customer,

We detected unauthorized login attempts on your banking account. Your access will be suspended within 2 hours unless you confirm your identity.

Please click the secure link below to verify your password and debit card details immediately:
http://secure-update-verify.top/login-portal

Failure to do so will result in permanent account termination.

Security Department`);

  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleMessages = [
    {
      label: 'Urgent Account Suspension (Phish)',
      subject: 'URGENT: Your account will be suspended today - Verify Now',
      sender: 'security-alert@service-security-update247.net',
      body: 'Your account access will be blocked today. Please click the link to verify your password and debit card details immediately: http://secure-update.top/login'
    },
    {
      label: 'Lottery / Prize Claim (Scam)',
      subject: 'CONGRATULATIONS: You won Rs. 50,00,000 in Annual Lucky Draw',
      sender: 'rewards-dept@claim-bonus-gift2026.xyz',
      body: 'Dear Winner, Your mobile number has won Rs. 50 Lakhs. To transfer the prize money to your bank account, provide your Aadhaar, bank account number and pay processing fee.'
    },
    {
      label: 'Amazon Order Confirmation (Safe)',
      subject: 'Your Amazon Order #928-1092834 has been dispatched',
      sender: 'auto-confirm@amazon.in',
      body: 'Hello, your order containing Wireless Headphones has been dispatched via Amazon Logistics. Expected delivery tomorrow by 8 PM.'
    }
  ];

  const handleScan = async () => {
    if (!body.trim()) {
      setErrorMessage('Please enter the message body content to analyze.');
      return;
    }
    setErrorMessage('');
    setIsScanning(true);
    setResult(null);

    try {
      const scanRes = await api.scanText(subject, sender, body);
      setResult(scanRes);
      addScanResult(scanRes);
    } catch (err) {
      setErrorMessage('Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Email & Message Analysis</h2>
          <p className="text-xs text-slate-400">
            NLP semantic analysis, urgency triggers, credential solicitation, and sender spoofing heuristics
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#0B132B] border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-300 font-bold uppercase block mb-1.5">
              Sender Address (Optional):
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. alert@suspicious-bank-update.com"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-100 font-mono focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-300 font-bold uppercase block mb-1.5">
              Subject Line:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Action Required on Your Account"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-100 font-mono focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 font-bold uppercase block mb-1.5">
            Message Body Content:
          </label>
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste email text, SMS message, or WhatsApp message here..."
            className="w-full bg-slate-950/90 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 font-mono focus:border-blue-400 focus:outline-none leading-relaxed"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 font-mono">{errorMessage}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Presets:</span>
            {sampleMessages.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setSubject(s.subject);
                  setSender(s.sender);
                  setBody(s.body);
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 text-[11px] font-mono transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            disabled={isScanning}
            onClick={handleScan}
            className="w-full sm:w-auto py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all font-mono shadow-lg disabled:opacity-50"
          >
            {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            Analyze Message
          </button>
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && <LoadingScanner channel="email" />}

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
                      NLP Confidence: {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 font-mono">
                    {subject || 'Message Threat Assessment'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Sender: <span className="font-mono text-cyan-300">{sender || 'Unknown Sender'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewReport(result)}
                className="w-full lg:w-48 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs font-mono transition-colors shadow-lg"
              >
                View Full Threat Report
              </button>
            </div>
          </div>

          {/* Semantic Scores Breakdown */}
          {result.textFeatures && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs block font-mono">Urgency / Pressure:</span>
                <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
                  {result.textFeatures.urgencyScore}%
                </span>
              </div>
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs block font-mono">Credential Request:</span>
                <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                  {result.textFeatures.credentialScore}%
                </span>
              </div>
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs block font-mono">Financial Vector:</span>
                <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                  {result.textFeatures.financialScore}%
                </span>
              </div>
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 text-xs block font-mono">Sentiment Profile:</span>
                <span className="text-xs font-bold font-mono text-slate-200 mt-1 block truncate">
                  {result.textFeatures.sentiment}
                </span>
              </div>
            </div>
          )}

          {/* Extracted Trigger Phrases */}
          {result.textFeatures && result.textFeatures.triggerPhrases.length > 0 && (
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase mb-2 flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-rose-400" />
                Detected Coercive & Phishing Trigger Words:
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.textFeatures.triggerPhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono"
                  >
                    ⚠️ {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reasons */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <ThreatReasons reasons={result.reasons} title="Why was this message flagged?" />
          </div>

          {/* Recommended Actions */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-200 font-mono mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Recommended Defense Actions
            </h4>
            <div className="space-y-2">
              {result.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
