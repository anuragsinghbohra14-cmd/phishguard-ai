import { ScanResult, ThreatClassification } from '../types';
import { extractUrlFeatures, extractTextFeatures, extractCallFeatures } from '../utils/featureExtractor';

export type ApiMode = 'MOCK' | 'FLASK_API';

class ApiService {
  private mode: ApiMode = 'MOCK';
  private baseUrl = 'http://localhost:5000';

  setMode(mode: ApiMode) {
    this.mode = mode;
  }

  getMode(): ApiMode {
    return this.mode;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async checkFlaskHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET', mode: 'cors' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async scanUrl(url: string): Promise<ScanResult> {
    const startTime = performance.now();

    if (this.mode === 'FLASK_API') {
      try {
        const res = await fetch(`${this.baseUrl}/predict/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (res.ok) {
          const data = await res.json();
          const classification: ThreatClassification = 
            data.prediction === 'phishing' ? 'PHISHING' : data.prediction === 'suspicious' ? 'SUSPICIOUS' : 'SAFE';
          
          const localAnalysis = extractUrlFeatures(url);
          const executionTime = Math.round(performance.now() - startTime);

          return {
            id: `SCAN-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            channel: 'url',
            targetInput: url,
            classification,
            riskScore: data.risk_score ?? localAnalysis.score,
            confidence: data.confidence ?? 0.94,
            reasons: data.reasons?.map((r: string, i: number) => ({
              id: `api-r-${i}`,
              title: r,
              description: `Flagged by Flask ML engine: ${r}`,
              severity: (data.risk_score > 75 ? 'critical' : 'medium') as 'critical' | 'medium',
              category: 'Flask Model'
            })) || localAnalysis.reasons,
            urlFeatures: localAnalysis.features,
            recommendedActions: classification === 'PHISHING' ? [
              'Block domain across perimeter firewall',
              'Do NOT enter credentials',
              'Report URL to CERT-In / Cyber Crime portal'
            ] : [
              'Safe destination verified',
              'Check TLS lock icon'
            ],
            preventionStatus: classification === 'PHISHING' ? 'BLOCKED' : classification === 'SUSPICIOUS' ? 'WARNED' : 'ALLOWED',
            executionTimeMs: executionTime,
            modelVersion: 'PhishGuard-Flask-Live-v1'
          };
        }
      } catch (err) {
        console.warn('Flask API unreachable, falling back to smart local heuristic engine', err);
      }
    }

    // Local smart heuristic engine (Always works offline & for SIH demo)
    await new Promise(r => setTimeout(r, 600)); // realistic async processing
    const { features, reasons, score, confidence } = extractUrlFeatures(url);
    const classification: ThreatClassification = score >= 70 ? 'PHISHING' : score >= 40 ? 'SUSPICIOUS' : 'SAFE';
    const executionTime = Math.round(performance.now() - startTime);

    return {
      id: `SCAN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      channel: 'url',
      targetInput: url,
      classification,
      riskScore: score,
      confidence,
      reasons,
      urlFeatures: features,
      recommendedActions: classification === 'PHISHING' ? [
        'Domain blocked by PhishGuard DNS Shield',
        'Do NOT submit passwords, bank credentials, or OTPs',
        'Submit URL to national threat database'
      ] : classification === 'SUSPICIOUS' ? [
        'Proceed with extreme caution',
        'Verify SSL certificate validity in browser bar',
        'Avoid downloading unsolicited attachments'
      ] : [
        'Verified safe website architecture',
        'No malicious signatures detected'
      ],
      preventionStatus: classification === 'PHISHING' ? 'BLOCKED' : classification === 'SUSPICIOUS' ? 'WARNED' : 'ALLOWED',
      executionTimeMs: executionTime,
      modelVersion: 'PhishGuard-Ensemble-v2.4'
    };
  }

  async scanText(subject: string, sender: string, body: string): Promise<ScanResult> {
    const startTime = performance.now();

    if (this.mode === 'FLASK_API') {
      try {
        const res = await fetch(`${this.baseUrl}/predict/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `${subject} ${body}`, sender })
        });
        if (res.ok) {
          const data = await res.json();
          const classification: ThreatClassification = 
            data.prediction === 'phishing' ? 'PHISHING' : data.prediction === 'suspicious' ? 'SUSPICIOUS' : 'SAFE';
          const localAnalysis = extractTextFeatures(subject, sender, body);

          return {
            id: `SCAN-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            channel: 'email',
            targetInput: subject || body.slice(0, 60),
            secondaryInput: { subject, sender },
            classification,
            riskScore: data.risk_score ?? localAnalysis.score,
            confidence: data.confidence ?? 0.92,
            reasons: localAnalysis.reasons,
            textFeatures: localAnalysis.features,
            recommendedActions: classification === 'PHISHING' ? [
              'Quarantine email immediately',
              'Block sender domain across email security gateway',
              'Report phishing attempt to IT Security Desk'
            ] : [
              'Transactional message verified',
              'Ensure sender matches expected contact'
            ],
            preventionStatus: classification === 'PHISHING' ? 'QUARANTINED' : classification === 'SUSPICIOUS' ? 'WARNED' : 'ALLOWED',
            executionTimeMs: Math.round(performance.now() - startTime),
            modelVersion: 'PhishGuard-Flask-NLP-v1'
          };
        }
      } catch (err) {
        console.warn('Flask API unreachable, using local NLP engine', err);
      }
    }

    await new Promise(r => setTimeout(r, 650));
    const { features, reasons, score, confidence } = extractTextFeatures(subject, sender, body);
    const classification: ThreatClassification = score >= 70 ? 'PHISHING' : score >= 40 ? 'SUSPICIOUS' : 'SAFE';

    return {
      id: `SCAN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      channel: 'email',
      targetInput: subject || body.slice(0, 60),
      secondaryInput: { subject, sender },
      classification,
      riskScore: score,
      confidence,
      reasons,
      textFeatures: features,
      recommendedActions: classification === 'PHISHING' ? [
        'Move message to Quarantine Sandbox',
        'Do NOT click embedded links or download attachments',
        'Block sender address at perimeter gateway'
      ] : classification === 'SUSPICIOUS' ? [
        'Examine links closely before clicking',
        'Confirm request with sender through secondary trusted channel'
      ] : [
        'Legitimate communication profile detected',
        'No malicious social engineering signatures found'
      ],
      preventionStatus: classification === 'PHISHING' ? 'QUARANTINED' : classification === 'SUSPICIOUS' ? 'WARNED' : 'ALLOWED',
      executionTimeMs: Math.round(performance.now() - startTime),
      modelVersion: 'PhishGuard-NLP-v2.1'
    };
  }

  async scanCall(transcript: string, audioFileName?: string): Promise<ScanResult> {
    const startTime = performance.now();

    if (this.mode === 'FLASK_API') {
      try {
        const res = await fetch(`${this.baseUrl}/predict/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript })
        });
        if (res.ok) {
          const data = await res.json();
          const classification: ThreatClassification = 
            data.prediction === 'scam' || data.prediction === 'phishing' ? 'PHISHING' : 'SAFE';
          const localAnalysis = extractCallFeatures(transcript);

          return {
            id: `SCAN-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            channel: 'call',
            targetInput: transcript.slice(0, 80) + '...',
            secondaryInput: { audioFileName },
            classification,
            riskScore: data.risk_score ?? localAnalysis.score,
            confidence: data.confidence ?? 0.95,
            reasons: localAnalysis.reasons,
            callFeatures: localAnalysis.features,
            recommendedActions: [
              'DISCONNECT CALL IMMEDIATELY',
              'NEVER disclose OTP, PIN, password, or CVV',
              'Report number to National Cyber Fraud Helpline (1930)'
            ],
            preventionStatus: classification === 'PHISHING' ? 'WARNED' : 'ALLOWED',
            executionTimeMs: Math.round(performance.now() - startTime),
            modelVersion: 'PhishGuard-Flask-Call-v1'
          };
        }
      } catch (err) {
        console.warn('Flask API unreachable, using local vishing engine', err);
      }
    }

    await new Promise(r => setTimeout(r, 700));
    const { features, reasons, score, confidence } = extractCallFeatures(transcript);
    const classification: ThreatClassification = score >= 65 ? 'PHISHING' : score >= 35 ? 'SUSPICIOUS' : 'SAFE';

    return {
      id: `SCAN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      channel: 'call',
      targetInput: transcript.slice(0, 80) + '...',
      secondaryInput: { audioFileName },
      classification,
      riskScore: score,
      confidence,
      reasons,
      callFeatures: features,
      recommendedActions: classification === 'PHISHING' ? [
        'TERMINATE CALL IMMEDIATELY',
        'NEVER share OTP, CVV, Card Numbers, or Banking passwords',
        'Contact your bank directly via the phone number printed on the back of your card',
        'File a report at cybercrime.gov.in or dial 1930'
      ] : [
        'No active fraud indicators identified in transcript',
        'Always maintain vigilance against unsolicited verification requests'
      ],
      preventionStatus: classification === 'PHISHING' ? 'WARNED' : 'ALLOWED',
      executionTimeMs: Math.round(performance.now() - startTime),
      modelVersion: 'PhishGuard-Vishing-v1.8'
    };
  }
}

export const api = new ApiService();
