import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ScanResult, ThreatStats, DemoScenario, ThreatClassification, ScanChannel } from '../types';
import { INITIAL_SCAN_HISTORY, DEMO_SCENARIOS } from '../data/mockData';
import { api, ApiMode } from '../services/api';

interface ScanContextType {
  history: ScanResult[];
  latestScan: ScanResult | null;
  stats: ThreatStats;
  apiMode: ApiMode;
  isFlaskConnected: boolean;
  setApiMode: (mode: ApiMode) => void;
  addScanResult: (result: ScanResult) => void;
  clearHistory: () => void;
  runDemoScenario: (scenarioId: string) => Promise<ScanResult | null>;
  demoScenarios: DemoScenario[];
  activeModalScan: ScanResult | null;
  setActiveModalScan: (scan: ScanResult | null) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('phishguard_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SCAN_HISTORY;
      }
    }
    return INITIAL_SCAN_HISTORY;
  });

  const [latestScan, setLatestScan] = useState<ScanResult | null>(history[0] || null);
  const [apiMode, setApiModeState] = useState<ApiMode>('MOCK');
  const [isFlaskConnected, setIsFlaskConnected] = useState<boolean>(false);
  const [activeModalScan, setActiveModalScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    localStorage.setItem('phishguard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval: any;
    const checkConnection = async () => {
      const ok = await api.checkFlaskHealth();
      setIsFlaskConnected(ok);
    };
    checkConnection();
    interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const setApiMode = (mode: ApiMode) => {
    api.setMode(mode);
    setApiModeState(mode);
  };

  const addScanResult = (result: ScanResult) => {
    setHistory(prev => [result, ...prev]);
    setLatestScan(result);
  };

  const clearHistory = () => {
    setHistory([]);
    setLatestScan(null);
  };

  const runDemoScenario = async (scenarioId: string): Promise<ScanResult | null> => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return null;

    let result: ScanResult;
    if (scenario.channel === 'url' && scenario.payload.url) {
      result = await api.scanUrl(scenario.payload.url);
    } else if (scenario.channel === 'email' && scenario.payload.body) {
      result = await api.scanText(scenario.payload.subject || '', scenario.payload.sender || '', scenario.payload.body);
    } else if (scenario.channel === 'call' && scenario.payload.transcript) {
      result = await api.scanCall(scenario.payload.transcript);
    } else {
      return null;
    }

    addScanResult(result);
    return result;
  };

  // Compute live dashboard stats
  const safeCount = history.filter(s => s.classification === 'SAFE').length;
  const suspiciousCount = history.filter(s => s.classification === 'SUSPICIOUS').length;
  const phishingCount = history.filter(s => s.classification === 'PHISHING').length;
  const totalScans = history.length;
  const averageRiskScore = totalScans > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans) 
    : 0;

  const channelCounts = {
    url: history.filter(s => s.channel === 'url').length,
    email: history.filter(s => s.channel === 'email').length,
    call: history.filter(s => s.channel === 'call').length,
  };

  const stats: ThreatStats = {
    totalScans,
    safeCount,
    suspiciousCount,
    phishingCount,
    averageRiskScore,
    channelCounts,
  };

  return (
    <ScanContext.Provider
      value={{
        history,
        latestScan,
        stats,
        apiMode,
        isFlaskConnected,
        setApiMode,
        addScanResult,
        clearHistory,
        runDemoScenario,
        demoScenarios: DEMO_SCENARIOS,
        activeModalScan,
        setActiveModalScan
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return context;
};
