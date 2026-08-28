import React from 'react';
import { ThreatEngineDiagram } from '../components/architecture/ThreatEngineDiagram';
import { Cpu, Zap, Database, Layers, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ThreatEnginePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
          <Cpu size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Unified AI Threat Engine Architecture</h2>
          <p className="text-xs text-slate-400">
            End-to-end multi-channel data ingestion, feature normalization, and ML scoring pipeline
          </p>
        </div>
      </div>

      <ThreatEngineDiagram />

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-cyan-400 font-mono mb-3 flex items-center gap-2">
            <Zap size={16} />
            Feature Engineering Matrix
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>URL Lexical Entropy:</strong> Calculates Shannon bit-entropy on host and parameter strings.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Punycode & Spoofing Detection:</strong> Identifies homograph Cyrillic/Greek character replacements.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>NLP Coercion Vectors:</strong> Measures psychological pressure, artificial urgency, and time constraints.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Voice OTP Extortion Signatures:</strong> Detects unauthorized phone requests for 6-digit one-time passwords.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-emerald-400 font-mono mb-3 flex items-center gap-2">
            <ShieldCheck size={16} />
            Defensive Zero-Trust Guardrails
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero-Execution Sandbox:</strong> Malicious URLs are analyzed structurally without opening live attacker scripts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>No Credential Storage:</strong> PhishGuard AI never stores or logs user passwords, OTPs, or financial secrets.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Explainable Mitigations:</strong> Each detection outputs actionable prevention advice for end-users and SOC analysts.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
