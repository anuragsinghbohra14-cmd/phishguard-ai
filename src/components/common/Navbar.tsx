import React, { useState } from 'react';
import { Shield, Globe, Mail, PhoneCall, LayoutDashboard, FileText, History, Info, Cpu, ToggleLeft, ToggleRight, Server } from 'lucide-react';
import { useScanContext } from '../../context/ScanContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { apiMode, isFlaskConnected, setApiMode } = useScanContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'url', label: 'URL Scanner', icon: Globe },
    { id: 'email', label: 'Email & Message', icon: Mail },
    { id: 'call', label: 'Call Analysis', icon: PhoneCall },
    { id: 'engine', label: 'Threat Engine', icon: Cpu },
    { id: 'reports', label: 'Threat Reports', icon: FileText },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'prevention', label: 'Prevention Center', icon: Shield },
    { id: 'how-it-works', label: 'How It Works', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/95 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 font-mono">
                  PhishGuard<span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  SIH PROTOTYPE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                Detect Phishing Before It Detects You.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 glow-cyan font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* API Backend Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs">
              <Server size={13} className={isFlaskConnected ? 'text-emerald-400' : 'text-slate-500'} />
              <span className="text-slate-400">API Engine:</span>
              <button
                onClick={() => setApiMode(apiMode === 'MOCK' ? 'FLASK_API' : 'MOCK')}
                className="flex items-center gap-1 font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Click to toggle between Client Heuristic Engine & Flask API Server"
              >
                <span>{apiMode === 'FLASK_API' ? 'Flask API (Port 5000)' : 'Smart Heuristics (Active)'}</span>
                {apiMode === 'FLASK_API' ? (
                  <span className={`w-2 h-2 rounded-full ${isFlaskConnected ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-800 grid grid-cols-2 gap-1.5 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-xs font-medium text-left flex items-center gap-2 ${
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
