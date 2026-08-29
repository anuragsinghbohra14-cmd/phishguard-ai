import math
import os
import re
from urllib.parse import urlparse
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))

app = Flask(__name__, static_folder=DIST_DIR if os.path.exists(DIST_DIR) else None)
CORS(app)

def calculate_entropy(s: str) -> float:
    if not s:
        return 0.0
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    entropy = 0.0
    for count in freq.values():
        p = count / len(s)
        entropy -= p * math.log2(p)
    return round(entropy, 2)

@app.route('/', methods=['GET'])
def index():
    # If production React build exists in dist, serve it directly on port 5000
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')

    # Otherwise serve a clean developer landing page with direct link to Vite port 5173
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PhishGuard AI — Flask API Server</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; background: #030712; color: #f1f5f9; padding: 40px; }
        .card { max-width: 650px; margin: 0 auto; background: #0B132B; border: 1px solid #06B6D4; padding: 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(6,182,212,0.2); }
        h1 { color: #06B6D4; margin-top: 0; font-size: 24px; }
        .btn { display: inline-block; background: #06B6D4; color: #030712; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
        .btn:hover { background: #22d3ee; }
        code { background: #030712; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
        ul { padding-left: 20px; line-height: 1.8; color: #cbd5e1; font-size: 14px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🛡️ PhishGuard AI — API Backend Active</h1>
        <p>You have connected to the <strong>Python Flask API Server</strong> on port <code>5000</code>.</p>
        <p>To view the interactive cybersecurity web UI, open the frontend:</p>
        <a class="btn" href="http://localhost:5173" target="_blank">Open React Web App (http://localhost:5173) →</a>
        <h3 style="margin-top: 25px; color: #94a3b8; font-size: 15px;">Available API Endpoints:</h3>
        <ul>
            <li><code>POST /predict/url</code> — Website & URL Threat Analysis</li>
            <li><code>POST /predict/text</code> — Email & SMS Semantic Scoring</li>
            <li><code>POST /predict/call</code> — Call Transcript Scam Detection</li>
            <li><code>GET /health</code> — Backend Health & Status</li>
        </ul>
    </div>
</body>
</html>'''

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    if os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return jsonify({"error": "Resource not found", "path": path}), 404

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "PhishGuard AI Backend",
        "version": "1.0.0-sih-prototype",
        "timestamp": "2026-08-28"
    })

@app.route('/predict/url', methods=['POST'])
def predict_url():
    data = request.get_json(force=True, silent=True) or {}
    url = data.get('url', '').strip()

    if not url:
        return jsonify({"error": "Missing URL parameter"}), 400

    if not re.match(r'^https?://', url, re.I):
        test_url = 'http://' + url
    else:
        test_url = url

    try:
        parsed = urlparse(test_url)
        domain = parsed.netloc.lower()
    except Exception:
        domain = url.lower()

    reasons = []
    score = 5

    # Protocol check
    is_https = test_url.lower().startswith('https://')
    if not is_https:
        score += 20
        reasons.append("Insecure HTTP transport protocol")

    # Keyword check
    suspicious_keywords = [
        'login', 'signin', 'verify', 'verification', 'update', 'account', 'banking', 'secure',
        'wallet', 'paypal', 'sbi', 'hdfc', 'icici', 'token', 'auth', 'password', 'bonus', 'kyc'
    ]
    found_tokens = [kw for kw in suspicious_keywords if kw in test_url.lower()]
    if len(found_tokens) >= 2:
        score += 30
        reasons.append(f"High-density phishing keywords detected: {', '.join(found_tokens[:3])}")

    # Impersonation heuristic
    brands = ['paypal', 'sbi', 'hdfc', 'google', 'apple', 'amazon', 'netflix', 'microsoft']
    for b in brands:
        if b in domain and not (domain.endswith(f"{b}.com") or domain.endswith(f"{b}.in") or domain.endswith(f"{b}.org")):
            score += 45
            reasons.append(f"Unauthorized brand impersonation: '{b}' prefix on third-party host")
            break

    # Entropy check
    entropy = calculate_entropy(test_url)
    if entropy > 4.5:
        score += 15
        reasons.append(f"Elevated Shannon entropy ({entropy}) suggesting encoded/randomized payload")

    # Raw IP check
    if re.match(r'^(\d{1,3}\.){3}\d{1,3}', domain):
        score += 35
        reasons.append("Raw IPv4 address host instead of registered domain name")

    # High-risk TLD check
    untrusted_tlds = ['.top', '.xyz', '.cc', '.buzz', '.monster', '.icu', '.tk', '.ga', '.work', '.click']
    if any(domain.endswith(t) for t in untrusted_tlds):
        score += 25
        reasons.append("High-risk top-level domain (TLD) commonly associated with throwaway phishing staging")

    final_score = min(99, max(5, score))
    prediction = "phishing" if final_score >= 70 else "suspicious" if final_score >= 40 else "safe"
    confidence = round(0.88 + (abs(final_score - 50) / 100) * 0.1, 2)

    return jsonify({
        "prediction": prediction,
        "risk_score": final_score,
        "confidence": confidence,
        "reasons": reasons if reasons else ["Standard domain structure", "No malicious patterns detected"],
        "model": "PhishGuard-Ensemble-Flask-v1.0"
    })

@app.route('/predict/text', methods=['POST'])
def predict_text():
    data = request.get_json(force=True, silent=True) or {}
    text = data.get('text', '')
    sender = data.get('sender', '')

    if not text:
        return jsonify({"error": "Missing text parameter"}), 400

    full_lower = f"{sender} {text}".lower()
    reasons = []
    score = 8

    # Urgency & coercion
    urgency_words = ['urgent', 'immediately', 'suspended', 'blocked', 'hours', 'terminate', 'deadline', 'critical', 'expires']
    found_urgency = [w for w in urgency_words if w in full_lower]
    if found_urgency:
        score += min(35, len(found_urgency) * 15)
        reasons.append(f"High-pressure psychological urgency triggers: {', '.join(found_urgency[:3])}")

    # Credential requests
    cred_words = ['password', 'otp', 'pin', 'debit card', 'credit card', 'cvv', 'verify account', 'login here', 'kyc']
    found_cred = [w for w in cred_words if w in full_lower]
    if found_cred:
        score += min(45, len(found_cred) * 20)
        reasons.append(f"Explicit credential solicitation: {', '.join(found_cred[:3])}")

    # Sender check
    if sender and any(term in sender.lower() for term in ['alert', 'security-update', '.xyz', '.top', 'service247']):
        score += 25
        reasons.append("Sender address exhibits lookalike impersonation markers")

    final_score = min(98, max(5, score))
    prediction = "phishing" if final_score >= 70 else "suspicious" if final_score >= 40 else "safe"
    confidence = round(0.87 + (abs(final_score - 50) / 100) * 0.1, 2)

    return jsonify({
        "prediction": prediction,
        "risk_score": final_score,
        "confidence": confidence,
        "reasons": reasons if reasons else ["Normal message tone", "No credential requests detected"],
        "model": "PhishGuard-NLP-Flask-v1.0"
    })

@app.route('/predict/call', methods=['POST'])
def predict_call():
    data = request.get_json(force=True, silent=True) or {}
    transcript = data.get('transcript', '')

    if not transcript:
        return jsonify({"error": "Missing transcript parameter"}), 400

    lower = transcript.lower()
    reasons = []
    score = 10

    # OTP Request detection
    if re.search(r'(otp|one[-\s]?time[-\s]?password|6[-\s]?digit|verification code)', lower):
        score += 45
        reasons.append("Direct verbal demand for one-time authentication code (OTP)")

    # Authority impersonation
    if re.search(r'(sbi|hdfc|icici|axis|bank of india|reserve bank|rbi|bank manager|head office|card department)', lower):
        score += 30
        reasons.append("Financial institution authority impersonation pretext")

    # Threat coercion
    if re.search(r'(blocked|suspended|freeze|disabled|penalty|police|arrest)', lower):
        score += 25
        reasons.append("Artificial urgency / emergency account freeze threat")

    final_score = min(99, max(8, score))
    prediction = "scam" if final_score >= 65 else "safe"
    confidence = round(0.90 + (abs(final_score - 50) / 100) * 0.08, 2)

    return jsonify({
        "prediction": prediction,
        "risk_score": final_score,
        "confidence": confidence,
        "reasons": reasons if reasons else ["No fraud markers detected in speech transcript"],
        "model": "PhishGuard-Vishing-Flask-v1.0"
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting PhishGuard AI Flask API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)