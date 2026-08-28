import React, { useState, useEffect } from 'react';
import { Cpu, Shield, Activity, CheckCircle2 } from 'lucide-react';

interface LoadingScannerProps {
  channel: 'url' | 'email' | 'call';
  onComplete?: () => void;
}

export const LoadingScanner: React.FC<LoadingScannerProps> = ({ channel }) => {
  const stepsByChannel = {
    url: [
      "Checking URL structure & Shannon entropy...",
      "Extracting lexical & domain reputation features...",
      "Analyzing SSL/TLS certificates & TLD risks...",
      "Running ML Ensemble threat classification...",
      "Generating explainable risk score & report..."
    ],
    email: [
      "Parsing email headers & sender SPF/DKIM...",
      "Extracting embedded URLs & attachment signatures...",
      "Running NLP semantic urgency & coercion analysis...",
      "Evaluating credential harvesting heuristics...",
      "Synthesizing threat intelligence scoring..."
    ],
    call: [
      "Ingesting conversational audio/transcript feed...",
      "Tokenizing speech patterns & intent boundaries...",
      "Analyzing social engineering & OTP extortion keywords...",
      "Evaluating authority impersonation pretexts...",
      "Formulating defensive fraud mitigation actions..."
    ]
  };

  const steps = stepsByChannel[channel];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 140);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden text-center shadow-2xl">
      {/* Radar scanner glow effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-cyan-400 animate-ping" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-6 relative glow-cyan">
          <Activity size={32} className="animate-spin" />
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2 font-mono">
          <Shield size={20} className="text-cyan-400" />
          PhishGuard AI Analyzing...
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-6">REAL-TIME MULTI-CHANNEL THREAT ENGINE</p>

        {/* Progress Steps */}
        <div className="w-full space-y-2.5 text-left bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                {isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className={`font-mono transition-colors duration-200 ${
                  isDone ? 'text-slate-400 line-through' : isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-600'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
