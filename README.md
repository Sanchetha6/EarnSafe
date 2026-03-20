# 🛵 EarnSafe — AI-Powered Parametric Income Insurance for Q-Commerce Delivery Partners

## 📌 Problem Statement

Zepto and Blinkit delivery partners operate on a promise of 10-minute deliveries. Their income is entirely dependent on order volume and hours worked. However, external disruptions — extreme weather, civic curfews, zone-level shutdowns — can bring deliveries to a complete halt, causing gig workers to lose 20–30% of their weekly earnings with zero protection.

"EarnSafe" is an AI-enabled parametric income insurance platform that automatically detects disruptions, triggers claims, and pays out lost income all with zero paperwork and zero delays.

---

## 👤 Persona: Q-Commerce Delivery Partner (Zepto / Blinkit)

### Who We're Protecting
- **Name:** Ravi Kumar, 26, Bengaluru
- **Platform:** Zepto delivery partner
- **Earnings:** ₹600–900/day | ₹4,000–6,000/week
- **Working hours:** 7 AM – 10 PM, 6–7 days/week
- **Pain point:** A single rainy afternoon can wipe out ₹300–500 of income. There is no safety net.

### Why Q-Commerce is Unique
Unlike food delivery, Q-commerce partners operate hyper-locally (within 2–3 km dark store radius). This means:
- A single flooded road or zone closure can completely block their only operational area
- The 10-minute SLA means platform apps themselves pause order assignment during disruptions
- Income loss is near-instantaneous — no orders = no pay, within minutes of a disruption starting

### Persona-Specific Disruption Scenarios

| Scenario | Trigger | Estimated Income Loss |
|---|---|---|
| Heavy rainfall (>15mm/hr) | Weather API threshold breach | ₹300–600 per disrupted evening |
| AQI > 400 (Severe Pollution) | AQI API alert | ₹200–400 per affected day |
| Flash flood / waterlogging | Flood alert + location data | ₹500–900 per blocked day |
| Unplanned civic curfew | Government alert API / news trigger | ₹600–900 per day |
| Dark store zone closure | Platform API signal (simulated) | ₹400–700 per shift |
| Extreme heat (>44°C) | Weather API threshold | ₹200–400 per afternoon |

---

## 🔄 Application Workflow

```
[Worker Onboarding]
       ↓
[AI Risk Profiling] ← Location, tenure, platform, zone history
       ↓
[Weekly Policy Creation] ← Dynamic premium calculated by ML model
       ↓
[Real-Time Disruption Monitoring] ← Weather + AQI + Civic APIs (polling every 15 mins)
       ↓
[Parametric Trigger Detected] ← Threshold crossed in worker's active zone
       ↓
[Fraud Validation] ← GPS activity check, anomaly scoring, duplicate detection
       ↓
[Auto Claim Initiated] ← Zero-touch, no forms required
       ↓
[Instant Payout] ← UPI / wallet transfer within 60 seconds
       ↓
[Worker Dashboard Updated] ← Earnings protected, coverage status, payout history
```

---

## 💰 Weekly Premium Model

### Pricing Philosophy
Gig workers are paid weekly. A monthly premium creates a cash-flow mismatch. GigShield aligns insurance costs with the worker's earning rhythm — pay weekly, get protected weekly.

### Base Weekly Premium Tiers

| Coverage Tier | Weekly Premium | Max Weekly Payout | Best For |
|---|---|---|---|
| Basic Shield | ₹35/week | ₹1,000 | Part-time workers (<4 days/week) |
| Standard Shield | ₹60/week | ₹2,000 | Regular workers (5–6 days/week) |
| Pro Shield | ₹90/week | ₹3,500 | Full-time workers (7 days/week) |

### Dynamic Premium Adjustments (AI-Driven)

The ML model adjusts the base premium weekly based on:

- **Zone Risk Score** (-₹5 to +₹15): Historical flood/rain disruption frequency in the worker's operating zone
- **Seasonal Risk Multiplier** (1.0x to 1.4x): Monsoon season (June–Sept) increases risk
- **Claim History** (-₹3 to +₹10): Workers with no prior claims get a loyalty discount
- **Platform Activity Score** (-₹5 to +₹5): Workers with consistent activity patterns are lower fraud risk

**Example:** Ravi in Koramangala (high waterlogging zone) during July monsoon on Standard Shield:
> Base ₹60 + Zone risk ₹10 + Seasonal 1.3x = **₹91/week** → capped at ₹90 (Pro tier upgrade nudge)

### Payout Calculation
```
Payout = (Worker's Average Hourly Earnings) × (Disruption Duration in Hours) × Coverage Factor
```
- Average hourly earnings derived from platform data (simulated) at onboarding
- Disruption duration = time between trigger start and all-clear signal
- Coverage factor = 0.7 (Basic), 0.8 (Standard), 0.9 (Pro)

---

## ⚡ Parametric Triggers (5 Automated Triggers)

All triggers are objective, verifiable, and require zero manual claim filing.

| # | Trigger Name | API Source | Threshold | Auto-Claim |
|---|---|---|---|---|
| 1 | Heavy Rain Alert | OpenWeatherMap API | Rainfall > 15mm/hr in worker's pin code | ✅ Yes |
| 2 | Severe AQI Alert | CPCB / OpenAQ API | AQI > 400 (Severe category) | ✅ Yes |
| 3 | Extreme Heat | OpenWeatherMap API | Temperature > 44°C between 11AM–4PM | ✅ Yes |
| 4 | Flood / Waterlogging | IMD flood alert API (mock) | Active flood alert in worker's district | ✅ Yes |
| 5 | Civic Disruption | Government alert API (mock) | Active curfew / Section 144 in zone | ✅ Yes |

---

## 🤖 AI/ML Integration Plan

### 1. Dynamic Premium Calculation (Random Forest / XGBoost)
- **Input features:** Worker zone, tenure, claim history, platform activity, seasonal index, local disruption frequency
- **Output:** Adjusted weekly premium + recommended tier
- **Training data:** Synthetic dataset of 10,000 worker profiles + historical weather/disruption data for Indian metros
- **Framework:** scikit-learn (Python), served via FastAPI endpoint

### 2. Fraud Detection (Isolation Forest + Rule-Based Layer)
- **GPS Activity Validator:** Checks if worker's GPS was active and stationary during claimed disruption window (platform API simulation)
- **Anomaly Scorer:** Isolation Forest model flags claims where worker GPS shows movement during "disruption" or where claim pattern deviates from zone peers
- **Duplicate Claim Prevention:** Redis-based deduplication on (worker_id + trigger_event_id) pair
- **Cluster Validation:** If <10% of workers in a zone file a claim during an "event," the event is flagged for review

### 3. Predictive Risk Modeling
- Weekly forecast of disruption probability per zone using weather trend data
- Used to proactively notify workers to renew/upgrade coverage before high-risk weeks
- Model: Time-series LSTM or simple moving-average baseline (depends on Phase 2 complexity)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React.js (Vite) + TypeScript
- **UI Library:** Tailwind CSS + shadcn/ui
- **Charts/Dashboard:** Recharts
- **Platform:** Web (mobile-responsive) — chosen for faster development and easier demo

**Why Web over Mobile:** For a 6-week hackathon, a web app allows faster iteration, easier demo recording, and no app store constraints. The UI will be fully mobile-responsive for realism.

### Backend
- **Primary API:** Python (FastAPI) — handles ML model serving, premium calculation, fraud scoring
- **Secondary Services:** Node.js (Express) — handles real-time event streaming, WebSocket notifications, and parametric trigger monitoring
- **Database:** PostgreSQL (worker profiles, policies, claims) + Redis (event dedup, session cache)
- **Task Queue:** Celery + Redis for async payout processing

### AI/ML
- **Framework:** scikit-learn, pandas, numpy
- **Model Serving:** FastAPI ML endpoints
- **Fraud Detection:** Isolation Forest (scikit-learn)
- **Premium Model:** Random Forest Regressor

### External APIs (Free Tier / Mock)
- **Weather:** OpenWeatherMap API (free tier)
- **AQI:** OpenAQ API (free, open-source)
- **Flood/Civic Alerts:** Mocked JSON endpoints simulating IMD / government APIs
- **Platform Data:** Simulated delivery activity API (mock server)

### Payments (Simulated)
- **Razorpay Test Mode** for UPI payout simulation
- Mock payout webhook to demonstrate instant transfer confirmation

### DevOps
- **Version Control:** GitHub
- **Deployment:** Vercel (frontend) + Render / Railway (backend)
- **CI/CD:** GitHub Actions (lint + test on push)

---

## 📅 Development Plan

### Phase 1 (Weeks 1–2): Ideation & Foundation ← Current
- [x] Define persona, disruption triggers, and weekly premium model
- [x] Finalize tech stack
- [ ] Set up GitHub repo with project structure
- [ ] Create wireframes for onboarding, dashboard, and claim flow
- [ ] Build synthetic training dataset for ML model
- [ ] Record 2-minute strategy video

### Phase 2 (Weeks 3–4): Automation & Protection
- [ ] Worker registration and onboarding flow
- [ ] Policy creation with ML-driven weekly premium calculation
- [ ] 5 parametric trigger monitors (weather + AQI + mock civic APIs)
- [ ] Zero-touch auto-claim initiation engine
- [ ] Basic fraud validation layer (GPS check + duplicate prevention)
- [ ] Claims management UI

### Phase 3 (Weeks 5–6): Scale & Optimise
- [ ] Advanced fraud detection (Isolation Forest + cluster validation)
- [ ] Razorpay test mode payout integration
- [ ] Worker dashboard (earnings protected, weekly coverage status)
- [ ] Insurer/Admin dashboard (loss ratios, disruption forecasts)
- [ ] Performance optimization and end-to-end demo recording
- [ ] Final pitch deck

---

## 📁 Repository Structure

```
gigshield/
├── frontend/                  # React + Vite web app
│   ├── src/
│   │   ├── pages/             # Onboarding, Dashboard, Claims, Admin
│   │   ├── components/        # Reusable UI components
│   │   └── services/          # API client
├── backend/
│   ├── api/                   # FastAPI — ML serving, premiums, claims
│   │   ├── models/            # Pydantic schemas
│   │   ├── routers/           # Endpoints: workers, policies, claims
│   │   └── ml/                # Trained models + inference scripts
│   ├── trigger-service/       # Node.js — real-time disruption monitoring
│   │   ├── monitors/          # Weather, AQI, Civic trigger watchers
│   │   └── events/            # WebSocket event emitter
│   └── mock-apis/             # Simulated platform + civic alert APIs
├── ml/
│   ├── datasets/              # Synthetic training data
│   ├── train_premium.py       # Premium model training
│   └── train_fraud.py         # Fraud detection model training
├── docs/
│   └── architecture.png       # System architecture diagram
└── README.md
```

---

## 🔒 Coverage Exclusions (Per Contest Rules)

GigShield strictly covers **loss of income only**. The following are explicitly excluded:
- ❌ Health insurance or medical expenses
- ❌ Life insurance
- ❌ Accident or injury coverage
- ❌ Vehicle repair or maintenance
- ❌ Equipment damage

---

## 👥 Team

| Name | Role |
|---|---|
| Sancheta A | Frontend + UI/UX |
| Hommesh S | Backend + ML |
| K Pradeep Raj | DevOps + Integration |

---
