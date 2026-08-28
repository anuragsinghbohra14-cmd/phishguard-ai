export type ScanChannel = 'url' | 'email' | 'call';

export type ThreatClassification = 'SAFE' | 'SUSPICIOUS' | 'PHISHING';

export interface ThreatReason {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

export interface UrlFeatures {
  domain: string;
  protocol: string;
  isHttps: boolean;
  length: number;
  suspiciousTokens: string[];
  specialCharCount: number;
  subdomainDepth: number;
  hasIpAddress: boolean;
  hasAtSymbol: boolean;
  entropy: number;
  redirectCount: number;
  tld: string;
  domainAgeDays?: number;
  isPunycodeOrSpoofed?: boolean;
}

export interface TextFeatures {
  urgencyScore: number;
  credentialScore: number;
  financialScore: number;
  impersonationScore: number;
  extractedUrls: string[];
  senderSuspicious: boolean;
  triggerPhrases: string[];
  sentiment: string;
}

export interface CallFeatures {
  otpRequestDetected: boolean;
  bankImpersonation: boolean;
  urgencyLevel: 'None' | 'Moderate' | 'High' | 'Extreme';
  threatLevel: 'Low' | 'Medium' | 'High';
  sensitiveInfoKeywords: string[];
  socialEngineeringPattern: string;
  highlightedTranscriptSpans: { text: string; reason: string; severity: 'medium' | 'high' | 'critical' }[];
}

export interface ScanResult {
  id: string;
  timestamp: string;
  channel: ScanChannel;
  targetInput: string;
  secondaryInput?: {
    subject?: string;
    sender?: string;
    audioFileName?: string;
  };
  classification: ThreatClassification;
  riskScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  reasons: ThreatReason[];
  urlFeatures?: UrlFeatures;
  textFeatures?: TextFeatures;
  callFeatures?: CallFeatures;
  recommendedActions: string[];
  preventionStatus: 'ALLOWED' | 'WARNED' | 'BLOCKED' | 'QUARANTINED';
  executionTimeMs: number;
  modelVersion: string;
}

export interface ThreatStats {
  totalScans: number;
  safeCount: number;
  suspiciousCount: number;
  phishingCount: number;
  averageRiskScore: number;
  channelCounts: {
    url: number;
    email: number;
    call: number;
  };
}

export interface DemoScenario {
  id: string;
  name: string;
  channel: ScanChannel;
  title: string;
  description: string;
  badge: ThreatClassification;
  expectedScore: number;
  payload: {
    url?: string;
    subject?: string;
    sender?: string;
    body?: string;
    transcript?: string;
  };
}
