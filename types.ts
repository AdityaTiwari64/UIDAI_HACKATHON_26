
export enum Page {
  HOME = 'home',
  STRESS_INDEX = 'stress_index',
  FORECASTING = 'forecasting',
  SCHEDULING = 'scheduling',
  DATASET = 'dataset',
  ABOUT = 'about',
  PROFILE = 'profile',
  SETTINGS = 'settings'
}

export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  trendUp?: boolean;
  colorClass?: string;
  isActionable?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface DatasetRecord {
  id: string;
  name: string;
  description: string;
  type: string;
  region: string;
  lastUpdated: string;
  status: 'Verified' | 'Pending Review' | 'Action Req.' | 'Archived';
  icon: string;
  colorClass: string;
}

// ML Model Prediction Types
export interface PredictionInput {
  d_e: number;  // Enrollment change (delta)
  d_d: number;  // Demographic change (delta)
  d_c: number;  // Child update change (delta)
  b: number;    // Biometric load
  c: number;    // Child load
  d: number;    // Demographic load
}

export interface RiskPrediction {
  asi: number;   // Aadhaar Stress Index (0-100)
  aers: number;  // Aadhaar Exclusion Risk Score (0-1)
  mbu: number;   // Minor Biometric Usage ratio
  rp?: number;   // Risk Proportion
  ml_prediction?: number;
  feature_importances?: {
    imp_e: number;
    imp_d: number;
    imp_c: number;
  };
}
