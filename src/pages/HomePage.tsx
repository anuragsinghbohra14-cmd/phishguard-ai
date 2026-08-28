import React from 'react';
import { Globe, Mail, PhoneCall, Shield, ShieldCheck, Zap, Activity, Cpu, ArrowRight, Lock, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { useScanContext } from '../context/ScanContext';
import { ThreatEngineDiagram } from '../components/architecture/ThreatEngineDiagram';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { stats } = useScanContext();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SMART INDIA HACKATHON 2026 PROTOTYPE
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 font-mono mb-4 leading-tight">
          "Detect Phishing <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Before It Detects You."
          </span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          AI/ML-powered real-time phishing detection and prevention across websites, emails, SMS messages, and phone call transcripts.
        </p>

        {/* Live Threat Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-center font-mono">
          <div className="bg-[#0B132B]/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400">TOTAL SCANS</div>
            <div className="text-xl font-bold text-cyan-400">{stats.totalScans}</div>
          </div>
          <div className="bg-[#0B132B]/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400">PHISHING INTERCEPTED</div>
            <div className="text-xl font-bold text-rose-400">{stats.phishingCount}</div>
          </div>
          <div className="bg-[#0B132B]/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400">SAFE VERIFIED</div>
            <div className="text-xl font-bold text-emerald-400">{stats.safeCount}</div>
          </div>
          <div className="bg-[#0B132B]/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400">AVG RISK SCORE</div>
            <div className="text-xl font-bold text-amber-400">{stats.averageRiskScore}/100</div>
          </div>
        </div>
      </section>

      {/* Central "What would you like to analyze?" Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
            What would you like to analyze?
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Select a threat vector below for instant AI/ML heuristic evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Website / URL */}
          <div className="bg-[#0B132B]/90 border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-5 glow-cyan group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                CHANNEL 01
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1 mb-2 font-mono">
                🌐 WEBSITE / URL
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Analyze suspicious links and websites. Inspects Shannon entropy, SSL protocols, deceptive subdomains, and zero-day credential harvesting kits.
              </p>
            </div>
            <button
              onClick={() => onNavigate('url')}
              className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors font-mono"
            >
              Analyze Website URL
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Email / Message */}
          <div className="bg-[#0B132B]/90 border border-blue-500/30 hover:border-blue-400 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
                CHANNEL 02
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1 mb-2 font-mono">
                📧 EMAIL / MESSAGE
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Detect phishing, social engineering, coercive urgency, and malicious links in emails, SMS alerts, and direct messages using NLP semantics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('email')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors font-mono"
            >
              Analyze Email / SMS
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Phone Call */}
          <div className="bg-[#0B132B]/90 border border-purple-500/30 hover:border-purple-400 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <PhoneCall size={28} />
              </div>
              <span className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">
                CHANNEL 03
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1 mb-2 font-mono">
                📞 PHONE CALL
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Analyze call transcripts for vishing scam indicators, bank authority impersonation, and live OTP extortion attempts with safety checklists.
              </p>
            </div>
            <button
              onClick={() => onNavigate('call')}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors font-mono"
            >
              Analyze Call Transcript
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="text-cyan-400 mb-3"><Activity size={24} /></div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 font-mono">Real-Time Detection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-second classification latency for rapid automated triage before users engage with dangerous payloads.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="text-blue-400 mb-3"><Cpu size={24} /></div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 font-mono">AI/ML + NLP Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-layered model ensembles evaluating lexical structure, semantic sentiment, and social engineering patterns.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="text-amber-400 mb-3"><Eye size={24} /></div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 font-mono">Explainable Risk Scoring</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box guesses. Granular 0-100 threat scoring with transparent reason codes and severity tags.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="text-emerald-400 mb-3"><ShieldCheck size={24} /></div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 font-mono">Proactive Prevention</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-Trust defensive guardrails: sandbox warnings, quarantine recommendations, and DO-NOT-SHARE OTP guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Unified Architecture Diagram */}
      <section className="max-w-6xl mx-auto px-4">
        <ThreatEngineDiagram />
      </section>
    </div>
  );
};
