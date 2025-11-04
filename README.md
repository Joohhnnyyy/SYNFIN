# SYNFIN

AI-driven loan advisory frontend with a multi-agent FastAPI backend. The frontend (Vite + React + TypeScript) provides a conversational interface that captures user intent (loan amount, tenure, PAN, Aadhar, salary) and sends structured updates to the backend. The backend (in `AI-Loan-Advisor-main/`) orchestrates specialized agents to guide users from initial discussion through verification, underwriting, eligibility, and PDF sanction letter generation.

## Overview

- Frontend: Vite React SPA with intent parsing and agent-aware messaging.
- Backend: FastAPI service with agents: Master, Sales, Verification, Underwriting, Eligibility, PDF.
- Deployment: Vercel-ready frontend; backend can run locally or be hosted on Render/Railway.

## Repository Structure

```
├── src/                      # Frontend source (React + TS)
├── public/                   # Static assets
├── vercel.json               # Vercel build/output/env and SPA rewrites
├── AI-Loan-Advisor-main/     # Backend (FastAPI + agents)
│   ├── app.py                # FastAPI app
│   ├── loan_advisor/
│   │   ├── agents/           # Master, Sales, Verification, Underwriting, Eligibility, PDF
│   │   ├── models/           # LoanApplication, Customer, enums
│   │   └── services/         # Orchestrator and LLM service
│   ├── sanction_letters/     # Generated PDFs
│   ├── tests/                # Test clients and scenarios
│   └── README.md             # Backend-specific docs
└── README.md                 # This document
```

## Backend Architecture (from AI-Loan-Advisor)

### Agents
- Master Agent: initial interaction and interest generation
- Sales Agent: loan amount, rate, tenure discussion and EMI
- Verification Agent: KYC (PAN, Aadhar) via mock APIs
- Underwriting Agent: credit score and pre-approved limits
- Eligibility Agent: approval decision (instant/conditional/reject)
- PDF Agent: sanction letter generation

### Workflow
1. Master welcomes, Sales discusses amount/tenure
2. Verification collects PAN/Aadhar
3. Underwriting sets `credit_score`, `pre_approved_limit`
4. Eligibility makes decision; may ask for monthly salary
5. PDF generates the sanction letter on approval

### Key Endpoints
- `POST /chat` — Start/continue conversation; accepts `data_update` to set fields
- `GET /application/{app_id}` — Retrieve application details
- `GET /sanction-letter/{app_id}` — Download sanction letter PDF
- `GET /health` — Health check

### Decision Logic
- Instant approval: `loan_amount ≤ pre_approved_limit` AND `credit_score ≥ 700`
- Conditional approval: requires `salary` and checks `emi ≤ 50% of salary`
- Rejection: KYC failure, `emi > 50%`, low credit

## Frontend Intent Handling

- Extracts and normalizes: loan amount (supports `lakh`/`crore`), tenure (`years`→months), salary (monthly rupees), name.
- Avoids misreads: ignores 12-digit Aadhar as amount; only captures salary in explicit contexts.
- Sends structured updates in `data_update` with each chat message:
  - `loan_amount`, `tenure_months`, `salary`, and optional `status` to guide backend agent selection.

## Quick Start (Local)

### 1) Backend
```bash
cd AI-Loan-Advisor-main
uv sync
uvicorn app:app --reload
# Optional: uv run python tests/test_client.py
```

### 2) Frontend
```bash
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
# Open http://localhost:8081/
```

## Deployment (Frontend)

- Vercel is preconfigured via `vercel.json`:
  - `buildCommand`: `npm run build`
  - `outputDirectory`: `dist`
  - `framework`: `vite`
  - SPA rewrites: all routes → `/index.html`
  - env: `VITE_API_URL`, `VITE_SUPABASE_PROJECT_ID`

### Deploy via CLI
```bash
npm run build
npx vercel --prod
```

### Deploy via GitHub
- Import repo in Vercel, set env vars (`VITE_API_URL`, etc.), and deploy.

## Example Usage

```python
import requests

# Start
r = requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "message": "Hello, I need a loan"
})
app_id = r.json()["application_id"]

# Provide details
requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "application_id": app_id,
  "message": "I need 10 lakh for 2 years"
})

# KYC
requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "application_id": app_id,
  "message": "ABCDE1234F"
})
requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "application_id": app_id,
  "message": "123456789012"
})

# Underwriting → Eligibility → Salary if needed
requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "application_id": app_id,
  "message": "Continue"
})
requests.post("http://localhost:8000/chat", json={
  "customer_id": "CUST001",
  "application_id": app_id,
  "message": "My salary is 60000"
})
```

## Sanction Letters

- Approved loans generate PDFs under `AI-Loan-Advisor-main/sanction_letters/`.
- Download via `GET /sanction-letter/{app_id}`.

## Notes

- Ensure backend CORS allows your Vercel domain when deploying.
- Frontend bundles are large; consider code-splitting for performance.
- Do not commit secrets. `.gitignore` excludes `.env`, `node_modules`, `dist`, and caches.

We welcome contributions to improve Savify. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all contributions follow our coding standards and include appropriate tests.

## License

This project is proprietary software. All rights reserved.

---

**Savify** - Transforming financial wellness through intelligent, personalized AI coaching.

For more information, visit our documentation or contact our development team.
