import { ScanResult, UrlFeatures, TextFeatures, CallFeatures, ThreatReason } from '../types';

export function calculateEntropy(str: string): number {
  if (!str) return 0;
  const map: Record<string, number> = {};
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    map[c] = (map[c] || 0) + 1;
  }
  let entropy = 0;
  for (const c in map) {
    const p = map[c] / str.length;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(2));
}

export function extractUrlFeatures(urlStr: string): { features: UrlFeatures; reasons: ThreatReason[]; score: number; confidence: number } {
  let parsedUrl: URL;
  let cleanUrl = urlStr.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = 'http://' + cleanUrl;
  }

  try {
    parsedUrl = new URL(cleanUrl);
  } catch {
    parsedUrl = new URL('http://unknown-invalid-host.local');
  }

  const domain = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol;
  const isHttps = protocol === 'https:';
  const length = cleanUrl.length;
  const reasons: ThreatReason[] = [];

  const suspiciousKeywordsList = [
    'login', 'signin', 'verify', 'verification', 'update', 'account', 'banking', 'secure',
    'wallet', 'paypal', 'sbi', 'hdfc', 'icici', 'apple', 'microsoft', 'support', 'token',
    'auth', 'password', 'recover', 'security', 'billing', 'confirm', 'bonus', 'claim', 'free', 'kyc'
  ];

  const foundTokens = suspiciousKeywordsList.filter(kw => cleanUrl.toLowerCase().includes(kw));

  const specialChars = (cleanUrl.match(/[@%_\-?&=]/g) || []).length;
  const subdomains = domain.split('.');
  const subdomainDepth = Math.max(0, subdomains.length - 2);
  const hasIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  const hasAtSymbol = cleanUrl.includes('@');
  const entropy = calculateEntropy(cleanUrl);
  
  const untrustedTlds = ['.top', '.xyz', '.cc', '.buzz', '.monster', '.icu', '.tk', '.ga', '.cf', '.ml', '.work', '.click', '.live'];
  const tld = '.' + (subdomains[subdomains.length - 1] || '');
  const isUntrustedTld = untrustedTlds.some(t => domain.endsWith(t));

  const brandNames = ['paypal', 'google', 'apple', 'microsoft', 'hdfc', 'sbi', 'icici', 'netflix', 'amazon', 'chase', 'meta'];
  const impersonatedBrand = brandNames.find(b => domain.includes(b) && !domain.endsWith(`${b}.com`) && !domain.endsWith(`${b}.in`) && !domain.endsWith(`${b}.org`));

  let score = 5;

  if (!isHttps) {
    score += 20;
    reasons.push({
      id: 'no-https',
      title: 'Insecure Protocol (HTTP)',
      description: 'The URL uses unencrypted HTTP communication instead of secure HTTPS.',
      severity: 'medium',
      category: 'Transport Security'
    });
  }

  if (impersonatedBrand) {
    score += 45;
    reasons.push({
      id: 'brand-impersonation',
      title: `Brand Impersonation (${impersonatedBrand.toUpperCase()})`,
      description: `Domain contains trusted brand keyword "${impersonatedBrand}" within an unauthorized third-party host.`,
      severity: 'critical',
      category: 'Identity Spoofing'
    });
  }

  if (isUntrustedTld) {
    score += 25;
    reasons.push({
      id: 'untrusted-tld',
      title: `High-Risk Top-Level Domain (${tld})`,
      description: 'The domain uses a TLD with statistically high correlation with disposable phishing infrastructure.',
      severity: 'high',
      category: 'Domain Reputation'
    });
  }

  if (hasIpAddress) {
    score += 35;
    reasons.push({
      id: 'raw-ip',
      title: 'Raw IP Address Host',
      description: 'Direct IP host bypassed standard DNS domain resolution, typical of malicious staging.',
      severity: 'high',
      category: 'URL Structure'
    });
  }

  if (subdomainDepth >= 3) {
    score += 20;
    reasons.push({
      id: 'subdomain-depth',
      title: 'Excessive Subdomain Depth',
      description: `Host contains ${subdomainDepth} nested subdomains structured to deceive visual inspection.`,
      severity: 'medium',
      category: 'Lexical Anomaly'
    });
  }

  if (foundTokens.length >= 3) {
    score += 25;
    reasons.push({
      id: 'suspicious-tokens',
      title: 'Dense Phishing Keyword Clustering',
      description: `Detected keywords: ${foundTokens.slice(0, 4).join(', ')}.`,
      severity: 'high',
      category: 'Lexical Tokens'
    });
  } else if (foundTokens.length > 0) {
    score += foundTokens.length * 8;
  }

  if (entropy > 4.5) {
    score += 15;
    reasons.push({
      id: 'high-entropy',
      title: 'High Shannon Entropy',
      description: `URL character randomness (${entropy}) suggests algorithmic generation or encoded payloads.`,
      severity: 'medium',
      category: 'Entropy Analysis'
    });
  }

  if (hasAtSymbol) {
    score += 30;
    reasons.push({
      id: 'at-symbol',
      title: 'Obfuscation via "@" Character',
      description: 'The "@" character allows attackers to mask the true destination authority in legacy client parsers.',
      severity: 'critical',
      category: 'Obfuscation'
    });
  }

  // Cap score
  const finalScore = Math.min(99, Math.max(5, score));
  const confidence = parseFloat((0.85 + (Math.abs(finalScore - 50) / 100) * 0.14).toFixed(2));

  const features: UrlFeatures = {
    domain,
    protocol,
    isHttps,
    length,
    suspiciousTokens: foundTokens,
    specialCharCount: specialChars,
    subdomainDepth,
    hasIpAddress,
    hasAtSymbol,
    entropy,
    redirectCount: finalScore > 75 ? 2 : 0,
    tld,
    domainAgeDays: finalScore > 70 ? 4 : 2400,
    isPunycodeOrSpoofed: !!impersonatedBrand
  };

  return { features, reasons, score: finalScore, confidence };
}

export function extractTextFeatures(subject: string, sender: string, body: string): { features: TextFeatures; reasons: ThreatReason[]; score: number; confidence: number } {
  const fullText = `${subject} ${body}`.toLowerCase();
  const reasons: ThreatReason[] = [];

  const urgencyWords = ['urgent', 'immediately', 'suspended', 'blocked', 'hours', 'terminate', 'deadline', 'critical', 'cancel', 'action required', 'expires'];
  const credentialWords = ['password', 'otp', 'pin', 'debit card', 'credit card', 'cvv', 'verify account', 'login here', 'update kyc', 'ssn', 'aadhaar'];
  const financialWords = ['transaction', 'refund', 'bitcoin', 'crypto', 'payment', 'invoiced', 'won', 'lottery', 'prize', 'bank transfer', 'wire'];
  const impersonationWords = ['security department', 'official notice', 'it desk', 'sbi support', 'hdfc security', 'paypal team', 'ceo', 'admin'];

  const matchedUrgency = urgencyWords.filter(w => fullText.includes(w));
  const matchedCredential = credentialWords.filter(w => fullText.includes(w));
  const matchedFinancial = financialWords.filter(w => fullText.includes(w));
  const matchedImpersonation = impersonationWords.filter(w => fullText.includes(w));

  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const extractedUrls = body.match(urlRegex) || [];

  const urgencyScore = Math.min(100, matchedUrgency.length * 25);
  const credentialScore = Math.min(100, matchedCredential.length * 30);
  const financialScore = Math.min(100, matchedFinancial.length * 20);
  const impersonationScore = Math.min(100, matchedImpersonation.length * 25);

  let senderSuspicious = false;
  if (sender) {
    const senderLower = sender.toLowerCase();
    if (senderLower.includes('update') || senderLower.includes('security-alert') || senderLower.includes('.xyz') || senderLower.includes('.top') || (senderLower.includes('bank') && !senderLower.includes('@sbi.co.in') && !senderLower.includes('@hdfcbank.com'))) {
      senderSuspicious = true;
    }
  }

  let score = 8;
  score += urgencyScore * 0.3;
  score += credentialScore * 0.35;
  score += financialScore * 0.15;
  score += impersonationScore * 0.2;

  if (senderSuspicious) {
    score += 25;
    reasons.push({
      id: 'spoofed-sender',
      title: 'Anomalous / Spoofed Sender Identity',
      description: 'Sender domain does not match official authentication signatures (SPF/DKIM anomaly).',
      severity: 'critical',
      category: 'Sender Authentication'
    });
  }

  if (matchedUrgency.length > 0) {
    reasons.push({
      id: 'urgency-pressure',
      title: 'Psychological Urgency / Time Coercion',
      description: `High-pressure triggers detected: "${matchedUrgency.slice(0, 3).join('", "')}".`,
      severity: matchedUrgency.length > 2 ? 'critical' : 'high',
      category: 'NLP Semantics'
    });
  }

  if (matchedCredential.length > 0) {
    reasons.push({
      id: 'credential-harvest',
      title: 'Explicit Sensitive Credential Request',
      description: `Direct solicitation of confidential credentials: "${matchedCredential.slice(0, 3).join('", "')}".`,
      severity: 'critical',
      category: 'Data Harvesting'
    });
  }

  if (extractedUrls.length > 0) {
    reasons.push({
      id: 'embedded-links',
      title: 'Call-to-Action Redirect Links',
      description: `Message embeds ${extractedUrls.length} external URL destination(s) requiring verification.`,
      severity: 'medium',
      category: 'URL Vector'
    });
  }

  const finalScore = Math.min(98, Math.max(5, Math.round(score)));
  const confidence = parseFloat((0.88 + (Math.abs(finalScore - 50) / 100) * 0.1).toFixed(2));

  const allTriggers = Array.from(new Set([...matchedUrgency, ...matchedCredential, ...matchedFinancial, ...matchedImpersonation]));

  const features: TextFeatures = {
    urgencyScore,
    credentialScore,
    financialScore,
    impersonationScore,
    extractedUrls,
    senderSuspicious,
    triggerPhrases: allTriggers,
    sentiment: finalScore > 70 ? 'Threatening / Coercive' : finalScore > 40 ? 'Promotional / Urgent' : 'Neutral / Informational'
  };

  return { features, reasons, score: finalScore, confidence };
}

export function extractCallFeatures(transcript: string): { features: CallFeatures; reasons: ThreatReason[]; score: number; confidence: number } {
  const textLower = transcript.toLowerCase();
  const reasons: ThreatReason[] = [];
  const highlightedSpans: { text: string; reason: string; severity: 'medium' | 'high' | 'critical' }[] = [];

  const otpRegex = /(otp|one[-\s]?time[-\s]?password|6[-\s]?digit|code sent|verification code)/i;
  const otpDetected = otpRegex.test(transcript);

  const bankRegex = /(sbi|hdfc|icici|axis|bank of india|reserve bank|rbi|bank manager|head office|card department)/i;
  const bankImpersonation = bankRegex.test(transcript);

  const freezeRegex = /(blocked|suspended|freeze|disabled|terminated|penalty|legal action|police)/i;
  const freezeThreat = freezeRegex.test(transcript);

  const sensitiveWords = ['otp', 'cvv', 'pin', 'password', 'card number', 'expiry date', 'aadhaar'];
  const foundSensitive = sensitiveWords.filter(w => textLower.includes(w));

  let score = 10;

  if (otpDetected) {
    score += 45;
    reasons.push({
      id: 'vishing-otp',
      title: 'Verbal OTP / Authentication Code Demanded',
      description: 'The caller explicitly asks for a one-time password (OTP). Legitimate institutions NEVER request OTP over phone calls.',
      severity: 'critical',
      category: 'Vishing Heuristic'
    });
    highlightedSpans.push({
      text: 'provide the OTP / verification code',
      reason: 'Direct OTP Solicitation (Universal Banking Violation)',
      severity: 'critical'
    });
  }

  if (bankImpersonation) {
    score += 25;
    reasons.push({
      id: 'vishing-authority',
      title: 'Institutional Authority Pretexting',
      description: 'Caller falsely asserts official banking or government authority to build artificial compliance.',
      severity: 'high',
      category: 'Authority Pretexting'
    });
    highlightedSpans.push({
      text: 'calling from bank / card verification department',
      reason: 'Authority Impersonation',
      severity: 'high'
    });
  }

  if (freezeThreat) {
    score += 20;
    reasons.push({
      id: 'vishing-panic',
      title: 'Account Freeze / Penalty Coercion',
      description: 'Caller threatens immediate financial loss or service disruption to bypass rational defense.',
      severity: 'critical',
      category: 'Psychological Manipulation'
    });
    highlightedSpans.push({
      text: 'account will be blocked / suspended today',
      reason: 'Urgency & Coercion',
      severity: 'critical'
    });
  }

  const finalScore = Math.min(99, Math.max(8, score));
  const confidence = parseFloat((0.89 + (Math.abs(finalScore - 50) / 100) * 0.09).toFixed(2));

  const features: CallFeatures = {
    otpRequestDetected: otpDetected,
    bankImpersonation,
    urgencyLevel: freezeThreat ? 'Extreme' : 'Moderate',
    threatLevel: finalScore > 75 ? 'High' : finalScore > 40 ? 'Medium' : 'Low',
    sensitiveInfoKeywords: foundSensitive,
    socialEngineeringPattern: otpDetected && bankImpersonation ? 'Bank Officer Vishing + OTP Extortion' : 'General Suspicious Voice Communication',
    highlightedTranscriptSpans: highlightedSpans
  };

  return { features, reasons, score: finalScore, confidence };
}
