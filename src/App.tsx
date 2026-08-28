import React, { useState } from 'react';
import { ScanProvider } from './context/ScanContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBar } from './components/common/DemoBar';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { EmailScannerPage } from './pages/EmailScannerPage';
import { CallAnalysisPage } from './pages/CallAnalysisPage';
import { ThreatEnginePage } from './pages/ThreatEnginePage';
import { ThreatReportsPage } from './pages/ThreatReportsPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { PreventionCenterPage } from './pages/PreventionCenterPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ScanResult } from './types';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [reportScan, setReportScan] = useState<ScanResult | null>(null);

  const handleViewReport = (scan: ScanResult) => {
    setReportScan(scan);
    setCurrentPage('reports');
  };

  const handleSelectChannel = (channel: 'url' | 'email' | 'call') => {
    setCurrentPage(channel);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onViewReport={handleViewReport} onNavigate={setCurrentPage} />;
      case 'url':
        return <UrlScannerPage onViewReport={handleViewReport} />;
      case 'email':
        return <EmailScannerPage onViewReport={handleViewReport} />;
      case 'call':
        return <CallAnalysisPage onViewReport={handleViewReport} />;
      case 'engine':
        return <ThreatEnginePage />;
      case 'reports':
        return <ThreatReportsPage selectedScan={reportScan} />;
      case 'history':
        return <ScanHistoryPage onViewReport={handleViewReport} />;
      case 'prevention':
        return <PreventionCenterPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ScanProvider>
      <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <DemoBar onSelectChannel={handleSelectChannel} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>

        <Footer />
      </div>
    </ScanProvider>
  );
};

export default App;
