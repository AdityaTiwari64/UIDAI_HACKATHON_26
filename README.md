# UIDAI Data Management Portal

<div align="center">
  <img src="public/emblem.png" alt="National Emblem of India" width="100" />
  <h3>Government of India</h3>
  <p>Unique Identification Authority of India - Data Management System</p>
</div>

---

## 📋 Overview

The UIDAI Data Management Portal is a centralized platform for forecasting, stress analysis, and resource scheduling for India's national identity infrastructure (Aadhaar). This portal provides administrators with real-time insights into system health, predictive analytics, and operational management tools.

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Stress Index Analysis
![Stress Index](screenshots/stress_index.png)

### Advanced Forecasting
![Forecasting](screenshots/forecasting.png)

### Resource Scheduling
![Scheduling](screenshots/scheduling.png)

### Dataset Management
![Dataset](screenshots/dataset.png)

### User Profile
![Profile](screenshots/profile.png)

### Settings
![Settings](screenshots/settings.png)

---

## ✨ Features

### Dashboard
- **Key Metrics Display**: Total Enrolments (1.38 Billion), Auth Transactions, Server Uptime, Pending Schedules
- **Animated Header**: Dynamic geometric gradient background with live status indicator
- **System Stress Index Forecast**: Weekly visualization of infrastructure load
- **Upcoming Schedules**: Quick view of maintenance windows and events

### Stress Index Analysis
- **Real-time Monitoring**: Overall stress gauge with animated visualization
- **Component Metrics**: CPU, Memory, Network, and Disk I/O utilization
- **Regional Comparison**: Bar charts comparing stress across North, South, East, West, and Central zones
- **Server Health Distribution**: Pie chart showing Healthy/Warning/Critical servers
- **24-Hour Load Pattern**: Time-series visualization
- **Active Alerts**: Critical, warning, and info level alerts with acknowledgment

### Advanced Forecasting
- **AI-Powered Predictions**: Ensemble models (Prophet + LSTM)
- **Traffic Volume Charts**: Actual vs Predicted comparison
- **Confidence Intervals**: 95% prediction bands
- **AI Insights & Recommendations**: Gemini-powered automated reasoning

### Resource Scheduling
- **Task Management**: Create, edit, and track maintenance schedules
- **Priority Filtering**: High, Medium, Low priority classification
- **View Modes**: List and Calendar views
- **Resource Allocation**: Team utilization tracking
- **Quick Actions**: Schedule maintenance, request resources, generate reports

### Dataset Management
- **Search & Filter**: Query datasets by name, ID, type, or region
- **Dataset Records**: Biometric, Demographic, Auth Logs, System Logs
- **Status Tracking**: Verified, Pending Review, Action Required
- **Bulk Operations**: View, download, and manage dataset records

### User Profile
- **Personal Information**: User details, department, reporting structure
- **Permissions & Access**: Role-based access control, API access, audit logs
- **Activity Log**: Recent user actions and system interactions
- **Security Settings**: 2FA, login notifications, session timeout

### Settings
- **Appearance**: Dark mode toggle, language selection, timezone
- **Notifications**: Push notifications, email alerts, alert type preferences
- **Data & Display**: Auto-refresh, refresh interval, page size
- **Quick Actions**: Export/Import settings, reset to default, clear cache

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI Integration**: Google Gemini API
- **Icons**: Material Symbols
- **Backend**: Python Flask
- **ML Model**: Scikit-learn (GradientBoostingRegressor)
- **Data Processing**: Pandas, NumPy

## 🧠 ML Model Integration

The system includes a trained ML model for predicting system stress and exclusion risk.

### Core Metrics

| Metric | Formula | Range |
|--------|---------|-------|
| **ASI** (Stress Index) | `abs(ml_pred) × 100 + 50` | 0-100 |
| **AERS** (Risk Score) | `abs(asi_raw × (mbu + rp))` | 0-1 |
| **MBU** (Minor Biometric) | `c / (b + d)` | 0-1 |
| **RP** (Rejection Proportion) | `(b - c) / b` | -1 to 1 |

### Timeline Structure

| Period | Date Range | Description |
|--------|-----------|-------------|
| Historical | ≤ 2025-12 | Actual CSV data |
| Current | 2026-01 | Active operational month |
| Future | Feb-Apr 2026 | 3-month ML forecasts |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Backend health check |
| `/metadata` | GET | States, districts, months |
| `/history` | GET | Time-series data |
| `/predict` | POST | Single month prediction |
| `/forecast` | POST | 3-month ahead forecast |
| `/aggregate` | GET | State-level averages |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+ (for ML backend)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adi64/UIDAI_HACKATHON_26.git
   cd UIDAI_HACKATHON_26
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Start the ML backend** (Terminal 1)
   ```bash
   cd backend
   python app.py
   ```

6. **Run the frontend dev server** (Terminal 2)
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
UIDAI_HACKATHON_26/
├── backend/
│   ├── app.py                  # Flask API server
│   ├── uidai_risk_model.pkl    # Trained ML model
│   ├── model_features.pkl      # Feature names
│   ├── processed_master_data.csv # Dataset
│   └── requirements.txt        # Python dependencies
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── StatCard.tsx            # Statistics card
├── pages/
│   ├── Dashboard.tsx           # State aggregate metrics
│   ├── StressIndex.tsx         # ML-powered stress analysis
│   ├── Forecasting.tsx         # 3-month timeline forecasting
│   ├── Scheduling.tsx          # Task scheduling
│   ├── Dataset.tsx             # Data management
│   ├── Profile.tsx             # User profile
│   ├── Settings.tsx            # System settings
│   └── About.tsx               # About page
├── services/
│   ├── geminiService.ts        # Gemini AI integration
│   └── apiService.ts           # Flask API client
├── screenshots/                # README screenshots
├── public/
│   └── emblem.png              # National Emblem
├── App.tsx                     # Main app component
├── index.tsx                   # Entry point
├── types.ts                    # TypeScript types
└── index.html                  # HTML template
```

## 🔐 Security

- Multi-layer encryption
- Role-based access control
- Audit trail logging
- Compliance with government security standards

## 📊 System Statistics

| Metric | Value |
|--------|-------|
| Total Enrolments | 1.38 Billion |
| Daily Auth Requests | 85+ Million |
| System Uptime | 99.98% |
| Data Managed | 4.2 PB |

## 📄 License

This project is developed for the UIDAI Hackathon 2026.

## 🤝 Contact

- **Email**: support@uidai.gov.in
- **Helpline**: 1947 (Toll Free)
- **Website**: [https://uidai.gov.in](https://uidai.gov.in)

---

<div align="center">
  <p>© 2026 Unique Identification Authority of India. All rights reserved.</p>
</div>
