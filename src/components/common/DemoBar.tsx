import React, { useState } from 'react';
import { useScanContext } from '../../context/ScanContext';
import { Play, Sparkles, Shield, ChevronRight, Activity, Terminal } from 'lucide-react';
import { ThreatBadge } from './ThreatBadge';

interface DemoBarProps {
  onSelectChannel: (channel: 'url' | 'email' | 'call') => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onSelectChannel }) => {
  const { demoScenarios, runDemoScenario } = useScanContext();
  const [isRunning, setIsRunning] = useState<string | null>(null);

  const handleRunDemo = async (scenarioId: string, channel: 'url' | 'email' | 'call') => {
    setIsRunning(scenarioId);
    onSelectChannel(channel);
    try {
      await runDemoScenario(scenarioId);
    } finally {
      setIsRunning(null);
    }
  };

  return (
    <div className="bg-[#0B132B]/90 border-y border-cyan-500/20 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-400" />
            SIH Judge Presentation Mode:
          </span>
          <span className="text-xs text-slate-400 hidden lg:inline">
            1-Click automated test scenarios
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              disabled={isRunning !== null}
              onClick={() => handleRunDemo(scenario.id, scenario.channel)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 font-medium ${
                scenario.badge === 'SAFE'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/40'
              } ${isRunning === scenario.id ? 'opacity-70 animate-pulse' : ''}`}
            >
              {isRunning === scenario.id ? (
                <Activity size={12} className="animate-spin" />
              ) : (
                <Play size={11} className="fill-current" />
              )}
              <span>{scenario.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
