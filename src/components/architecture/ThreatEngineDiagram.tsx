import React, { useState } from 'react';
import { Globe, Mail, PhoneCall, Cpu, ArrowDown, ShieldCheck, Zap, Database, Search, Lock, AlertTriangle, Layers, ChevronRight } from 'lucide-react';

export const ThreatEngineDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const pipelineStages = [
    {
      id: 1,
      title: "1. Multi-Channel Ingestion",
      subtitle: "URL / Email / Call Transcripts",
      icon: Layers,
      color: "border-cyan-500/40 bg-cyan-950/30 text-cyan-300",
      description: "Normalizes incoming payload across websites, message bodies, SPF/DKIM headers, and speech transcripts into structured data payloads."
    },
    {
      id: 2,
      title: "2. Input Identification & Sanitization",
      subtitle: "Payload Tokenization & Encoding",
      icon: Search,
      color: "border-blue-500/40 bg-blue-950/30 text-blue-300",
      description: "Strips malicious executable characters, resolves redirections, decodes Punycode/hex representations, and isolates embedded URLs."
    },
    {
      id: 3,
      title: "3. Feature Extraction Pipeline",
      subtitle: "Lexical, Semantic & Behavioral Signals",
      icon: Cpu,
      color: "border-purple-500/40 bg-purple-950/30 text-purple-300",
      description: "Extracts 40+ lexical URL attributes (Shannon entropy, TLD risk, token clustering) and NLP indicators (urgency, credential harvest, panic inducing pretexts)."
    },
    {
      id: 4,
      title: "4. AI/ML + NLP Classification Ensemble",
      subtitle: "Gradient Boosted Trees + Transformer Weights",
      icon: Zap,
      color: "border-emerald-500/40 bg-emerald-950/30 text-emerald-300",
      description: "Combines tree-based decision ensembles with text semantic transformers to evaluate multi-vector evasion patterns."
    },
    {
      id: 5,
      title: "5. Explainable Risk Scoring Engine",
      subtitle: "0–100 Normalized Score + Confidence",
      icon: Lock,
      color: "border-amber-500/40 bg-amber-950/30 text-amber-300",
      description: "Translates ML activations into human-interpretable severity weights, highlighting explicit phishing triggers and confidence metrics."
    },
    {
      id: 6,
      title: "6. Zero-Trust Defensive Enforcement",
      subtitle: "Block / Warn / Quarantine / Report",
      icon: ShieldCheck,
      color: "border-rose-500/40 bg-rose-950/30 text-rose-300",
      description: "Instantly enforces perimeter mitigation: DNS blocking for URLs, mailbox quarantine for emails, and DO-NOT-SHARE lockouts for vishing calls."
    }
  ];

  return (
    <div className="bg-[#0B132B]/80 border border-slate-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
          <Cpu size={14} />
          UNIFIED AI ARCHITECTURE
        </div>
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
          Unified AI Threat Engine Pipeline
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          All three attack channels feed into a centralized, explainable machine learning threat analysis pipeline. Click any module to inspect data flow.
        </p>
      </div>

      {/* Input Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-cyan-950/60 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Globe size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono">CHANNEL 1: URL / WEB</h4>
            <p className="text-[11px] text-slate-400">Lexical, domain age & entropy analysis</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-950/60 rounded-xl text-blue-400 border border-blue-500/30">
            <Mail size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono">CHANNEL 2: EMAIL / SMS</h4>
            <p className="text-[11px] text-slate-400">NLP urgency & credential harvest detection</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-purple-950/60 rounded-xl text-purple-400 border border-purple-500/30">
            <PhoneCall size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono">CHANNEL 3: CALL TRANSCRIPT</h4>
            <p className="text-[11px] text-slate-400">Vishing heuristic & OTP extortion detector</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs bg-slate-900/80 px-4 py-1.5 rounded-full border border-cyan-500/20">
          <ArrowDown size={14} className="animate-bounce" />
          Feeds into Unified Threat Engine
        </div>
      </div>

      {/* Sequential Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipelineStages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = activeStep === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStep(isSelected ? null : stage.id)}
              className={`border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${stage.color} ${
                isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-xl' : 'hover:border-opacity-100 hover:bg-opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} />
                <span className="text-[10px] font-mono font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  STAGE 0{stage.id}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">{stage.title}</h4>
              <p className="text-[11px] text-slate-400 font-mono mb-2">{stage.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{stage.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
