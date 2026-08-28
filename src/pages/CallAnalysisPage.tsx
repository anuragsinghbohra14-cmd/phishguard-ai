import React, { useState } from 'react';
import { PhoneCall, PhoneOff, UploadCloud, Search, RefreshCw, ShieldAlert, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Lock, Mic, AlertOctagon } from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { useScanContext } from '../context/ScanContext';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge';
import { ThreatBadge } from '../components/common/ThreatBadge';
import { ThreatReasons } from '../components/common/ThreatReasons';
import { LoadingScanner } from '../components/common/LoadingScanner';

interface CallAnalysisPageProps {
  onViewReport: (scan: ScanResult) => void;
}

export const CallAnalysisPage: React.FC<CallAnalysisPageProps> = ({ onViewReport }) => {
  const { addScanResult } = useScanContext();
  const [transcript, setTranscript] = useState(
    'Hello sir, I am calling directly from SBI Head Office Card Verification Department. We have noticed an unauthorized transaction of 48,500 rupees on your account right now. To cancel this fraudulent charge and prevent your account from being permanently blocked today, I have triggered a security verification. Please provide the 6-digit OTP you just received on your mobile phone so I can verify and unblock your card.'
  );
  const [activeTab, setActiveTab] = useState<'transcript' | 'audio'>('transcript');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleCalls = [
    {
      label: 'Bank Officer OTP Extortion (Phishing)',
      text: 'Hello sir, I am calling directly from SBI Head Office Card Verification Department. We have noticed an unauthorized transaction of 48,500 rupees on your account right now. To cancel this fraudulent charge and prevent your account from being permanently blocked today, I have triggered a security verification. Please provide the 6-digit OTP you just received on your mobile phone so I can verify and unblock your card.'
    },
    {
      label: 'Tax Department Legal Threat (Scam)',
      text: 'This is an urgent notice from Income Tax Department Enforcement Division. An arrest warrant has been issued in your name regarding tax evasion penalty. Press 1 to connect with our legal officer and transfer immediate penalty settlement.'
    },
    {
      label: 'Customer Support Inquiry (Safe)',
      text: 'Good afternoon, this is customer service calling from Airtel regarding your broadband plan renewal inquiry submitted yesterday. I can confirm your 200 Mbps plan is active and running normally.'
    }
  ];

  const handleScan = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Please paste or enter a call transcript to analyze.');
      return;
    }
    setErrorMessage('');
    setIsScanning(true);
    setResult(null);

    try {
      const scanRes = await api.scanCall(transcript, audioFile?.name);
      setResult(scanRes);
      addScanResult(scanRes);
    } catch (err) {
      setErrorMessage('Call analysis failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Simulated speech-to-text transcript generation for demonstration
      setTranscript(`[Simulated ASR Transcription from "${file.name}"]\nHello sir, I am calling from card security department. Please share the OTP sent to your phone to prevent account block.`);
      setActiveTab('transcript');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
          <PhoneCall size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Phone Call & Vishing Analysis</h2>
          <p className="text-xs text-slate-400">
            Transcript-based NLP scam detection, authority impersonation, and live OTP solicitation defense
          </p>
        </div>
      </div>

      {/* Prototype Disclosure Banner */}
      <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300 font-mono">SIH Prototype Transparency Note: </span>
          PhishGuard AI analyzes conversational text transcripts and uploaded audio records. Live cellular telecommunication interception is not claimed in this software demo.
        </div>
      </div>

      {/* Tabs & Input */}
      <div className="bg-[#0B132B] border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'transcript'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={14} />
            Option 1: Paste Call Transcript
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'audio'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud size={14} />
            Option 2: Upload Audio (.wav, .mp3)
          </button>
        </div>

        {activeTab === 'transcript' ? (
          <div>
            <label className="text-xs font-mono text-slate-300 font-bold uppercase block mb-1.5">
              Call Transcript Text:
            </label>
            <textarea
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste recorded call transcript, speech-to-text log, or voicenote transcription..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 font-mono focus:border-purple-400 focus:outline-none leading-relaxed"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-700 hover:border-purple-400 rounded-2xl p-8 text-center bg-slate-950/40">
            <UploadCloud size={36} className="mx-auto text-purple-400 mb-2" />
            <p className="text-xs font-bold text-slate-200 font-mono">Upload Call Audio File</p>
            <p className="text-[11px] text-slate-500 mb-4">Supports .mp3, .wav, .m4a recordings</p>
            <label className="inline-block py-2 px-4 bg-purple-950 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 rounded-xl text-xs font-mono font-semibold cursor-pointer">
              Choose Audio File
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
            {audioFile && (
              <p className="text-xs text-emerald-400 mt-3 font-mono">
                ✓ Loaded: {audioFile.name} (Simulating transcription...)
              </p>
            )}
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-400 font-mono">{errorMessage}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Scenarios:</span>
            {sampleCalls.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(s.text);
                  setActiveTab('transcript');
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-400 hover:border-purple-500/40 text-[11px] font-mono transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            disabled={isScanning}
            onClick={handleScan}
            className="w-full sm:w-auto py-2.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all font-mono shadow-lg disabled:opacity-50"
          >
            {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            Analyze Call
          </button>
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && <LoadingScanner channel="call" />}

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
                      Vishing Confidence: {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 font-mono">
                    {result.classification === 'PHISHING' ? '🔴 Potential Scam / Phishing Call Detected' : 'Voice Communication Verified'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Pattern: <span className="font-mono text-purple-300">{result.callFeatures?.socialEngineeringPattern || 'General Speech Analysis'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewReport(result)}
                className="w-full lg:w-48 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs font-mono transition-colors shadow-lg"
              >
                View Full Threat Report
              </button>
            </div>
          </div>

          {/* CRITICAL DO NOT SHARE CHECKLIST */}
          <div className="bg-rose-950/40 border-2 border-rose-500/50 rounded-2xl p-6 glow-rose">
            <h4 className="text-sm font-bold text-rose-300 font-mono uppercase mb-3 flex items-center gap-2">
              <PhoneOff size={18} className="text-rose-400" />
              RECOMMENDED ACTION: DO NOT SHARE UNDER ANY CIRCUMSTANCES
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono font-bold">
              <div className="bg-rose-900/40 border border-rose-500/40 p-3 rounded-xl text-rose-200 text-center">
                ⛔ OTP / Verification Codes
              </div>
              <div className="bg-rose-900/40 border border-rose-500/40 p-3 rounded-xl text-rose-200 text-center">
                ⛔ Bank Password / Netbanking
              </div>
              <div className="bg-rose-900/40 border border-rose-500/40 p-3 rounded-xl text-rose-200 text-center">
                ⛔ ATM PIN / UPI PIN
              </div>
              <div className="bg-rose-900/40 border border-rose-500/40 p-3 rounded-xl text-rose-200 text-center">
                ⛔ CVV / Expiry Date
              </div>
            </div>
          </div>

          {/* Highlighted Transcript Trigger Spans */}
          {result.callFeatures && result.callFeatures.highlightedTranscriptSpans.length > 0 && (
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase mb-3 flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-rose-400" />
                Transcript Portions That Triggered Fraud Detection:
              </h4>
              <div className="space-y-2">
                {result.callFeatures.highlightedTranscriptSpans.map((span, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-mono text-rose-300 font-medium">"{span.text}"</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-[10px] font-mono uppercase text-rose-400 shrink-0">
                      {span.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasons */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <ThreatReasons reasons={result.reasons} title="Why was this call flagged?" />
          </div>

          {/* Recommended Actions */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-200 font-mono mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Incident Response & Reporting Steps
            </h4>
            <div className="space-y-2">
              {result.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
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
