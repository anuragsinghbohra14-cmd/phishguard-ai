import { DemoScenario, ScanResult } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-safe-url',
    name: 'Demo 1: Safe Website',
    channel: 'url',
    title: 'Legitimate Banking Portal',
    description: 'Official HDFC Bank Internet Banking Portal with valid SSL and clean domain reputation.',
    badge: 'SAFE',
    expectedScore: 12,
    payload: {
      url: 'https://netbanking.hdfcbank.com/netbanking/'
    }
  },
  {
    id: 'demo-phish-url',
    name: 'Demo 2: Phishing URL',
    channel: 'url',
    title: 'Zero-Day Credential Harvester',
    description: 'Deceptive domain spoofing PayPal security verification with excessive parameters and brand impersonation.',
    badge: 'PHISHING',
    expectedScore: 94,
    payload: {
      url: 'http://paypal.com.verify-user-security-update.top/auth/signin?token=938210&sec_code=8104'
    }
  },
  {
    id: 'demo-phish-email',
    name: 'Demo 3: Phishing Email',
    channel: 'email',
    title: 'Urgent Account Suspension Notice',
    description: 'High-pressure social engineering email demanding immediate verification to prevent account termination.',
    badge: 'PHISHING',
    expectedScore: 91,
    payload: {
      sender: 'security-alert@service-security-update247.net',
      subject: 'URGENT: Your account will be suspended today - Verify Now',
      body: 'Dear Valued Customer,\n\nWe detected unauthorized login attempts on your banking account. Your access will be suspended within 2 hours unless you confirm your identity.\n\nPlease click the secure link below to verify your password and debit card details immediately:\nhttp://secure-update-verify.top/login-portal\n\nFailure to do so will result in permanent account termination.\n\nSecurity Department'
    }
  },
  {
    id: 'demo-scam-call',
    name: 'Demo 4: Scam Call Transcript',
    channel: 'call',
    title: 'Bank Officer OTP Extortion Call',
    description: 'Vishing (voice phishing) attack where fraudster impersonates bank officer threatening account freeze to steal OTP.',
    badge: 'PHISHING',
    expectedScore: 96,
    payload: {
      transcript: 'Hello sir, I am calling directly from SBI Head Office Card Verification Department. We have noticed an unauthorized transaction of 48,500 rupees on your account right now. To cancel this fraudulent charge and prevent your account from being permanently blocked today, I have triggered a security verification. Please provide the 6-digit OTP you just received on your mobile phone so I can verify and unblock your card.'
    }
  }
];

export const INITIAL_SCAN_HISTORY: ScanResult[] = [
  {
    id: 'SCAN-2026-891',
    timestamp: '2026-08-28 22:15:04',
    channel: 'url',
    targetInput: 'http://paypal.com.verify-user-security-update.top/auth/signin?token=938210',
    classification: 'PHISHING',
    riskScore: 94,
    confidence: 0.96,
    executionTimeMs: 142,
    modelVersion: 'PhishGuard-Ensemble-v2.4',
    preventionStatus: 'BLOCKED',
    reasons: [
      { id: 'r1', title: 'Impersonation Indicator', description: 'Deceptive use of "paypal.com" prefix as a subdomain on untrusted ".top" TLD', severity: 'critical', category: 'Domain Lexical' },
      { id: 'r2', title: 'Insecure HTTP Transport', description: 'Sensitive authentication endpoint served over unencrypted HTTP', severity: 'high', category: 'Network Security' },
      { id: 'r3', title: 'Excessive Suspicious Parameters', description: 'High entropy query tokens matching automated credential harvesting kits', severity: 'medium', category: 'URL Structure' }
    ],
    urlFeatures: {
      domain: 'paypal.com.verify-user-security-update.top',
      protocol: 'http:',
      isHttps: false,
      length: 83,
      suspiciousTokens: ['paypal', 'verify', 'security', 'update', 'signin'],
      specialCharCount: 7,
      subdomainDepth: 4,
      hasIpAddress: false,
      hasAtSymbol: false,
      entropy: 4.82,
      redirectCount: 2,
      tld: '.top',
      domainAgeDays: 3,
      isPunycodeOrSpoofed: true
    },
    recommendedActions: [
      'Block domain at network firewall and DNS resolver',
      'Do NOT enter credentials, passwords, or personal details',
      'Submit domain to Google Safe Browsing and APWG threat feed'
    ]
  },
  {
    id: 'SCAN-2026-890',
    timestamp: '2026-08-28 21:40:12',
    channel: 'email',
    targetInput: 'URGENT: Your account will be suspended today - Verify Now',
    secondaryInput: {
      sender: 'security-alert@service-security-update247.net',
      subject: 'URGENT: Your account will be suspended today - Verify Now'
    },
    classification: 'PHISHING',
    riskScore: 91,
    confidence: 0.93,
    executionTimeMs: 168,
    modelVersion: 'PhishGuard-NLP-v2.1',
    preventionStatus: 'QUARANTINED',
    reasons: [
      { id: 'r4', title: 'High Urgency & Psychological Coercion', description: 'Contains 2-hour deadline ultimatum triggering panic reaction', severity: 'critical', category: 'NLP Semantics' },
      { id: 'r5', title: 'Sensitive Credential Solicitation', description: 'Explicit request for passwords and debit card information', severity: 'critical', category: 'Social Engineering' },
      { id: 'r6', title: 'Lookalike Sender Domain', description: 'Sender domain does not match any legitimate financial institution', severity: 'high', category: 'Sender Spoofing' }
    ],
    textFeatures: {
      urgencyScore: 95,
      credentialScore: 92,
      financialScore: 88,
      impersonationScore: 84,
      extractedUrls: ['http://secure-update-verify.top/login-portal'],
      senderSuspicious: true,
      triggerPhrases: ['suspended today', 'verify immediately', 'password and debit card', 'permanent account termination'],
      sentiment: 'Threatening / Coercive'
    },
    recommendedActions: [
      'Quarantine email from user mailbox',
      'Block sender domain across enterprise email gateway',
      'Educate user on zero-trust verification procedures'
    ]
  },
  {
    id: 'SCAN-2026-889',
    timestamp: '2026-08-28 20:12:45',
    channel: 'call',
    targetInput: 'Hello sir, I am calling from SBI Head Office Card Verification...',
    classification: 'PHISHING',
    riskScore: 96,
    confidence: 0.95,
    executionTimeMs: 195,
    modelVersion: 'PhishGuard-Vishing-v1.8',
    preventionStatus: 'WARNED',
    reasons: [
      { id: 'r7', title: 'Live OTP Solicitation', description: 'Direct verbal demand for one-time password (OTP), violation of all banking standards', severity: 'critical', category: 'Vishing Heuristics' },
      { id: 'r8', title: 'Bank Authority Impersonation', description: 'Claiming to represent SBI Head Office Card Verification Department', severity: 'critical', category: 'Impersonation' },
      { id: 'r9', title: 'False Panic Induction', description: 'Claiming fraudulent debit of Rs. 48,500 to induce panic submission', severity: 'high', category: 'Psychological Coercion' }
    ],
    callFeatures: {
      otpRequestDetected: true,
      bankImpersonation: true,
      urgencyLevel: 'Extreme',
      threatLevel: 'High',
      sensitiveInfoKeywords: ['OTP', 'Card Verification', 'Blocked today', '48,500 rupees'],
      socialEngineeringPattern: 'Authority Impersonation + Emergency Freeze Pretext',
      highlightedTranscriptSpans: [
        { text: 'calling directly from SBI Head Office Card Verification Department', reason: 'Bank Impersonation Pretext', severity: 'critical' },
        { text: 'unauthorized transaction of 48,500 rupees', reason: 'False Panic Trigger', severity: 'high' },
        { text: 'account will be permanently blocked today', reason: 'Urgency / Coercion', severity: 'critical' },
        { text: 'provide the 6-digit OTP you just received', reason: 'OTP Solicitation Violation', severity: 'critical' }
      ]
    },
    recommendedActions: [
      'IMMEDIATELY TERMINATE CALL',
      'NEVER SHARE: OTP, PIN, CVV, or passwords under any circumstances',
      'Report calling number to National Cyber Crime Reporting Portal (1930)'
    ]
  },
  {
    id: 'SCAN-2026-888',
    timestamp: '2026-08-28 19:30:20',
    channel: 'url',
    targetInput: 'https://netbanking.hdfcbank.com/netbanking/',
    classification: 'SAFE',
    riskScore: 12,
    confidence: 0.98,
    executionTimeMs: 95,
    modelVersion: 'PhishGuard-Ensemble-v2.4',
    preventionStatus: 'ALLOWED',
    reasons: [
      { id: 'r10', title: 'Legitimate Domain Reputation', description: 'Verified financial domain registered > 20 years with authentic EV SSL', severity: 'low', category: 'Domain Reputation' },
      { id: 'r11', title: 'Standard URL Architecture', description: 'Low entropy path with standard banking authentication hierarchy', severity: 'low', category: 'URL Structure' }
    ],
    urlFeatures: {
      domain: 'netbanking.hdfcbank.com',
      protocol: 'https:',
      isHttps: true,
      length: 42,
      suspiciousTokens: [],
      specialCharCount: 1,
      subdomainDepth: 2,
      hasIpAddress: false,
      hasAtSymbol: false,
      entropy: 3.12,
      redirectCount: 0,
      tld: '.com',
      domainAgeDays: 7850,
      isPunycodeOrSpoofed: false
    },
    recommendedActions: [
      'Verified safe navigation. Ensure lock icon is present in address bar.',
      'Maintain standard multi-factor authentication hygiene.'
    ]
  },
  {
    id: 'SCAN-2026-887',
    timestamp: '2026-08-28 18:05:11',
    channel: 'url',
    targetInput: 'http://192.168.1.104:8080/secure_update.html',
    classification: 'SUSPICIOUS',
    riskScore: 68,
    confidence: 0.88,
    executionTimeMs: 110,
    modelVersion: 'PhishGuard-Ensemble-v2.4',
    preventionStatus: 'WARNED',
    reasons: [
      { id: 'r12', title: 'Raw IP Address in URL', description: 'Host utilizes raw IP instead of registered domain name', severity: 'high', category: 'Network Structure' },
      { id: 'r13', title: 'Non-Standard Port', description: 'Traffic directed through auxiliary port 8080 without encryption', severity: 'medium', category: 'Port Security' }
    ],
    urlFeatures: {
      domain: '192.168.1.104',
      protocol: 'http:',
      isHttps: false,
      length: 46,
      suspiciousTokens: ['secure', 'update'],
      specialCharCount: 4,
      subdomainDepth: 0,
      hasIpAddress: true,
      hasAtSymbol: false,
      entropy: 3.95,
      redirectCount: 0,
      tld: 'ip',
      domainAgeDays: 0,
      isPunycodeOrSpoofed: false
    },
    recommendedActions: [
      'Exercise caution: Raw IP hosts commonly host staging phishing pages',
      'Do not download files or input authentication credentials'
    ]
  },
  {
    id: 'SCAN-2026-886',
    timestamp: '2026-08-28 16:45:00',
    channel: 'email',
    targetInput: 'Your Amazon Order #928-1092834 has been dispatched',
    secondaryInput: {
      sender: 'auto-confirm@amazon.in',
      subject: 'Your Amazon Order #928-1092834 has been dispatched'
    },
    classification: 'SAFE',
    riskScore: 8,
    confidence: 0.97,
    executionTimeMs: 124,
    modelVersion: 'PhishGuard-NLP-v2.1',
    preventionStatus: 'ALLOWED',
    reasons: [
      { id: 'r14', title: 'Authentic E-Commerce Structure', description: 'Sender SPF/DKIM aligned with legitimate Amazon infrastructure', severity: 'low', category: 'Email Authentication' },
      { id: 'r15', title: 'Informational Neutral Tone', description: 'Standard tracking notification without coercive urgency or credential prompts', severity: 'low', category: 'NLP Semantics' }
    ],
    textFeatures: {
      urgencyScore: 5,
      credentialScore: 0,
      financialScore: 10,
      impersonationScore: 2,
      extractedUrls: ['https://www.amazon.in/track/order/928-1092834'],
      senderSuspicious: false,
      triggerPhrases: [],
      sentiment: 'Neutral / Informational'
    },
    recommendedActions: [
      'Email classified as safe transactional communication',
      'Always verify package details in official mobile app'
    ]
  }
];
