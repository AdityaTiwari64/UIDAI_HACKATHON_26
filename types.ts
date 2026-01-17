
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
