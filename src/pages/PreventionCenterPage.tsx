import React from 'react';
import { ShieldCheck, ShieldAlert, Globe, Mail, PhoneCall, Lock, AlertTriangle, CheckCircle2, Ban, Eye } from 'lucide-react';

export const PreventionCenterPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-emerald">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-mono">Prevention & Defense Center</h2>
          <p className="text-xs text-slate-400">
            "Detection is only the first step. PhishGuard AI helps users prevent interaction with suspicious content."
          </p>
        </div>
      </div>

      {/* Prevention Policy Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Website Card */}
        <div className="bg-[#0B132B] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-cyan-950/60 rounded-xl text-cyan-400 border border-cyan-500/30">
              <Globe size={22} />
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-500/40">
              BLOCK / WARN
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-mono">Website URL Shield</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Zero-Trust DNS and client navigation intercepter prevents credential entry on spoofed domains.
          </p>
          <div className="space-y-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-rose-400">
              <Ban size={14} />
              <span>BLOCK: Known phishing kits</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Eye size={14} />
              <span>WARN: High-entropy raw IP hosts</span>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-[#0B132B] border border-blue-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-950/60 rounded-xl text-blue-400 border border-blue-500/30">
              <Mail size={22} />
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-400 px-2 py-1 rounded border border-blue-500/40">
              WARN / QUARANTINE
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-mono">Email & SMS Quarantine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Flags coercive urgency and extracts embedded malicious redirect links before user engagement.
          </p>
          <div className="space-y-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-rose-400">
              <Ban size={14} />
              <span>QUARANTINE: Credential harvesters</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Eye size={14} />
              <span>WARN: Lookalike sender domains</span>
            </div>
          </div>
        </div>

        {/* Call Card */}
        <div className="bg-[#0B132B] border border-purple-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-950/60 rounded-xl text-purple-400 border border-purple-500/30">
              <PhoneCall size={22} />
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-400 px-2 py-1 rounded border border-purple-500/40">
              WARN / REPORT
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-mono">Vishing & OTP Defense</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Identifies bank authority pretexts and prompts users to disconnect and contact official helplines.
          </p>
          <div className="space-y-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-rose-400">
              <Ban size={14} />
              <span>WARN: Live OTP demand calls</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={14} />
              <span>REPORT: National Cyber Portal 1930</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices Checklist */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
          <Lock size={18} className="text-emerald-400" />
          Critical End-User Security Guidelines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Never share OTPs:</strong> Banks, telecom, or government officers will NEVER ask for an OTP over a phone call.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Verify Sender Identity:</strong> Inspect email addresses beyond display names to identify lookalike spoofing.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Check URLs Carefully:</strong> Look for deceptive subdomains like `bank.com.verify-login.top`.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Avoid Urgent Pressure:</strong> Coercive deadlines ("2 hours left to unblock") are universal red flags.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Do Not Download Unsolicited Files:</strong> Avoid opening unknown attachments (.exe, .scr, .zip, .html).
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Report Suspected Incidents:</strong> Report fraudulent SMS, links, and calls to <span className="text-cyan-300">cybercrime.gov.in</span> or dial <span className="text-cyan-300 font-bold">1930</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
