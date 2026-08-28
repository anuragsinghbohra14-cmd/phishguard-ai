# PhishGuard AI — Real-Time Phishing Detection & Prevention System

> **TAGLINE:** *"Detect Phishing Before It Detects You."*  
> **PROJECT:** Real-Time AI/ML-Based Phishing Detection and Prevention Framework.  
> **CONTEXT:** Software prototype engineered for the **Smart India Hackathon (SIH)**.

---

## 🛡️ Overview

PhishGuard AI provides a unified, explainable defense framework against social engineering and phishing threats across three critical attack surfaces:

1. 🌐 **Websites & URLs:** Real-time lexical analysis, Shannon entropy scoring, Punycode/homograph detection, raw IP identification, and safe navigation shields.
2. 📧 **Emails & SMS Messages:** NLP-based urgency detection, sensitive credential solicitation detection, sender address anomaly evaluation, and automatic redirect extraction.
3. 📞 **Phone Calls (Vishing):** Speech transcript analysis for live OTP extortion, banking authority impersonation, coercion triggers, and **DO NOT SHARE** safety checklists.

---

## ⚡ Key Highlights for SIH Judges

- **Dual Backend Architecture:** Runs 100% offline out-of-the-box using the smart client-side heuristic engine, or seamlessly connects to the Python Flask backend with a single click.
- **Explainable AI (XAI):** Provides transparent 0–100 risk scoring, model confidence ratings, and granular reason codes instead of black-box outputs.
- **1-Click SIH Presentation Mode:** Pre-configured demo buttons on top of the UI for instant judge demonstrations (Legitimate banking portal, PayPal zero-day spoof, Bank KYC OTP extortion call).
- **Zero-Trust Prevention:** Includes actionable defensive protocols, threat report exports (JSON & formatted text), and audit telemetry history.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **Python:** 3.9+ (Optional, for running companion Flask API)

### 2. Frontend Installation & Run
```bash
# Navigate to project directory
cd phishguard-ai

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at: `http://localhost:5173`

---

### 3. Optional: Running the Python Flask API

PhishGuard AI includes a companion Flask API ready to connect:

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask API server
python app.py
```

The API will listen on `http://localhost:5000`. In the frontend navbar, the API status badge will automatically detect and show **"Flask API (Port 5000)"**.

---

## 📡 API Endpoints Specification

### 1. URL Analysis: `POST /predict/url`
**Request:**
```json
{
  "url": "http://paypal.com.verify-security-update.top/auth"
}
```
**Response:**
```json
{
  "prediction": "phishing",
  "risk_score": 94,
  "confidence": 0.96,
  "reasons": [
    "Unauthorized brand impersonation: 'paypal' prefix on third-party host",
    "Insecure HTTP transport protocol",
    "High-risk top-level domain (.top)"
  ],
  "model": "PhishGuard-Ensemble-Flask-v1.0"
}
```

### 2. Email / Text Analysis: `POST /predict/text`
**Request:**
```json
{
  "text": "URGENT: Your account will be suspended today. Click link to verify debit card.",
  "sender": "security-alert@update-service247.net"
}
```
**Response:**
```json
{
  "prediction": "phishing",
  "risk_score": 91,
  "confidence": 0.93,
  "reasons": [
    "High-pressure psychological urgency triggers: urgent, immediately, suspended",
    "Explicit credential solicitation: debit card, verify"
  ],
  "model": "PhishGuard-NLP-Flask-v1.0"
}
```

### 3. Call Transcript Analysis: `POST /predict/call`
**Request:**
```json
{
  "transcript": "Hello sir, I am calling from SBI card department. Share the 6-digit OTP sent to your phone."
}
```
**Response:**
```json
{
  "prediction": "scam",
  "risk_score": 96,
  "confidence": 0.95,
  "reasons": [
    "Direct verbal demand for one-time authentication code (OTP)",
    "Financial institution authority impersonation pretext"
  ],
  "model": "PhishGuard-Vishing-Flask-v1.0"
}
```

---

## 🧠 Connecting Custom / Production ML Models

To replace the heuristic extractors with custom trained weights (e.g. Scikit-Learn Random Forest, XGBoost, or HuggingFace Transformers):

1. Open `backend/app.py`.
2. Load your serialized model pipeline:
   ```python
   import joblib
   url_model = joblib.load('models/url_classifier.pkl')
   ```
3. Pass extracted feature vector into `url_model.predict_proba(features)` inside `predict_url()` endpoint.
4. Return the computed risk score and confidence.

---

## 📂 Project Directory Structure

```
phishguard-ai/
├── backend/
│   ├── app.py                 # Python Flask API with /predict endpoints & CORS
│   └── requirements.txt       # Flask dependencies
├── src/
│   ├── components/
│   │   ├── architecture/      # Unified Threat Engine Pipeline Diagram
│   │   ├── charts/            # SVG Threat Ratio & Risk Histograms
│   │   └── common/            # Navbar, Footer, Badges, Gauges, Warnings
│   ├── context/               # ScanContext with LocalStorage synchronization
│   ├── data/                  # SIH Judge presets & initial telemetry history
│   ├── pages/                 # Home, Dashboard, URL, Email, Call, Reports, History, Prevention
│   ├── services/              # API Client (Flask connector + smart heuristic engine)
│   ├── types/                 # TypeScript type interfaces
│   ├── utils/                 # Feature extraction & report export utilities
│   ├── App.tsx                # Main view router
│   ├── main.tsx               # Root React entrypoint
│   └── index.css              # Dark cybersecurity styling & glow effects
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## ⚖️ Ethical & Security Disclaimer

PhishGuard AI is an educational and defensive security software prototype created for the Smart India Hackathon. It does not execute live untrusted links, does not record confidential user secrets, and transparently notes that results are probabilistic AI/ML risk assessments.
