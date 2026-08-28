import React from 'react';
import { Info, Cpu, Layers, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
          <Info size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">How PhishGuard AI Works</h2>
          <p className="text-xs text-slate-400">
            Transparent technology blueprint: Current MVP implementation vs Future Advanced Modules
          </p>
        </div>
      </div>

      {/* Current MVP Section */}
      <div className="bg-[#0B132B] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 size={16} />
          CURRENT WORKING MVP (SIH DEMONSTRATION PROTOTYPE)
        </div>
        <h3 className="text-xl font-bold text-slate-100 font-mono">
          Explainable Heuristic & ML Ensemble Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 font-mono">1. URL / Website Module</h4>
            <p className="text-slate-300 leading-relaxed">
              Lexical feature extraction: Shannon character entropy, TLD risk correlation, brand homograph spoofing, protocol inspection, subdomain nesting, and suspicious keyword density.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-blue-300 font-mono">2. Email / SMS Module</h4>
            <p className="text-slate-300 leading-relaxed">
              NLP semantic analysis: Identifies urgency/panic cues, credential harvest keywords, sender address anomalies, and automatically extracts nested redirect URLs.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-300 font-mono">3. Phone Call Module</h4>
            <p className="text-slate-300 leading-relaxed">
              Transcript-based NLP: Detects verbal one-time password (OTP) extortion, financial authority impersonation, and flags highlighted speech excerpts.
            </p>
          </div>
        </div>
      </div>

      {/* Future Roadmap Section */}
      <div className="bg-[#0B132B] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles size={16} />
          FUTURE / ADVANCED MODULES ROADMAP
        </div>
        <h3 className="text-xl font-bold text-slate-100 font-mono">
          Planned Scalability & Advanced AI Extensions
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The following components are designed for full production rollout and represent future research extensions beyond the current hackathon MVP:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">BERT / RoBERTa Models:</strong>
            Fine-tuned contextual transformer models for complex multi-lingual phishing nuances.
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">CNN Webpage Vision:</strong>
            Convolutional neural networks evaluating visual webpage screenshot similarity against legitimate portals.
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">Graph Neural Networks (GNN):</strong>
            Domain relationship and infrastructure graph mapping for tracking adversary botnet clusters.
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">Threat Intel Integrations:</strong>
            Live bidirectional feeds with AlienVault OTX, MISP, VirusTotal, and CERT-In.
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">Browser Extension:</strong>
            Real-time client endpoint protection overlay for Chrome, Firefox, and Edge.
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-purple-300 block mb-1">Continuous Active Learning:</strong>
            Automated model retraining pipeline incorporating flagged user telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
