/**
 * API Service for Aadhaar Risk Model Flask Backend
 * Handles communication between React frontend and Flask ML prediction server
 */

const API_BASE_URL = '/api';

/**
 * Input parameters for manual risk prediction
 */
export interface PredictionInput {
    d_e: number;  // Enrollment change (delta)
    d_d: number;  // Demographic change (delta)
    d_c: number;  // Child update change (delta)
    b: number;    // Biometric load
    c: number;    // Child load
    d: number;    // Demographic load
}

/**
 * Input parameters for location-based prediction (CSV lookup)
 */
export interface LocationPredictionInput {
    state: string;
    district: string;
    month: string;  // Format: "2025-10"
}

/**
 * Risk prediction response from the ML model
 */
export interface RiskPrediction {
    asi: number;   // Aadhaar Stress Index (0-100)
    aers: number;  // Aadhaar Exclusion Risk Score (0-1)
    mbu: number;   // Minor Biometric Usage ratio
    rp?: number;   // Risk Proportion (optional)
    ml_prediction?: number;  // Raw ML model prediction
    feature_importances?: {
        imp_e: number;
        imp_d: number;
        imp_c: number;
    };
    extracted_features?: {
        d_e: number;
        d_d: number;
        d_c: number;
        d_b_lag1: number;
        d_b_lag2: number;
        d_c_lag1: number;
        month_num: number;
        b: number;
        c: number;
        d: number;
    };
    location?: {
        state: string;
        district: string;
        month: string;
    };
}

/**
 * Health check response
 */
export interface HealthStatus {
    status: string;
    model_loaded: boolean;
    features_loaded: boolean;
    data_loaded?: boolean;
    records_count?: number;
}

/**
 * Metadata response for dropdowns
 */
export interface MetadataResponse {
    states: string[];
    months: string[];
    districts_by_state: Record<string, string[]>;
}

/**
 * Historical record from /history endpoint
 */
export interface HistoryRecord {
    month: string;
    asi: number;
    aers: number;
    mbu: number;
    rp: number;
    ml_prediction: number;
    d_e: number;
    d_d: number;
    d_c: number;
    b: number;
    c: number;
    d: number;
}

/**
 * History response from /history endpoint
 */
export interface HistoryResponse {
    state: string;
    district: string;
    records_count: number;
    history: HistoryRecord[];
}

/**
 * Single month forecast data
 */
export interface MonthForecast {
    month: string;
    asi: number;
    aers: number;
    mbu: number;
    rp: number;
    ml_prediction: number;
    d_e: number;
    d_d: number;
    d_c: number;
    b: number;
    c: number;
    d: number;
    is_actual?: boolean;
}

/**
 * Timeline information for forecast
 */
export interface ForecastTimeline {
    historical_cutoff: string;
    current_month: string;
    future_start: string;
}

/**
 * B/C/D trends for MBU projection
 */
export interface ForecastTrends {
    b_trend: number;
    c_trend: number;
    d_trend: number;
}

/**
 * 3-month forecast response with timeline shift
 */
export interface ForecastResponse {
    state: string;
    district: string;
    timeline: ForecastTimeline;
    trends: ForecastTrends;
    historical: MonthForecast[];
    current: MonthForecast;
    month1: MonthForecast;  // Feb 2026
    month2: MonthForecast;  // Mar 2026
    month3: MonthForecast;  // Apr 2026
}

/**
 * State aggregate response
 */
export interface AggregateResponse {
    state: string;
    month: string;
    districts_count: number;
    average: {
        asi: number;
        aers: number;
        mbu: number;
        rp: number;
    };
    workload: {
        biometric: number;
        child: number;
        demographic: number;
    };
    top_districts: Array<{ district: string; asi: number; aers: number }>;
    all_districts: Array<{ district: string; asi: number; aers: number }>;
}

/**
 * Batch prediction response
 */
export interface BatchPredictionResponse {
    predictions: RiskPrediction[];
}

/**
 * Fetch metadata for dropdown menus (states, districts, months)
 * @returns Promise<MetadataResponse>
 */
export const fetchMetadata = async (): Promise<MetadataResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/metadata`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching metadata:', error);
        throw error;
    }
};

/**
 * Fetch districts for a specific state
 * @param state - The state name
 * @returns Promise<string[]>
 */
export const fetchDistricts = async (state: string): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/districts?state=${encodeURIComponent(state)}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.districts;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

/**
 * Fetch historical time-series data for a location
 * @param state - The state name
 * @param district - The district name
 * @returns Promise<HistoryResponse>
 */
export const fetchHistory = async (state: string, district: string): Promise<HistoryResponse> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/history?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`,
            { method: 'GET' }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

/**
 * Fetch 3-month ahead forecast for a location
 * @param state - The state name
 * @param district - The district name
 * @returns Promise<ForecastResponse>
 */
export const fetch3MonthForecast = async (state: string, district: string): Promise<ForecastResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/forecast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state, district })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching 3-month forecast:', error);
        throw error;
    }
};

/**
 * Fetch aggregated metrics for a state
 * @param state - The state name
 * @returns Promise<AggregateResponse>
 */
export const fetchStateAggregate = async (state: string): Promise<AggregateResponse> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/aggregate?state=${encodeURIComponent(state)}`,
            { method: 'GET' }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching state aggregate:', error);
        throw error;
    }
};

/**
 * Fetch risk prediction using location-based CSV lookup
 * @param input - The location prediction input (state, district, month)
 * @returns Promise<RiskPrediction>
 */
export const fetchLocationPrediction = async (input: LocationPredictionInput): Promise<RiskPrediction> => {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching location prediction:', error);
        throw error;
    }
};

/**
 * Fetch risk prediction from the ML model (manual input)
 * @param input - The prediction input parameters
 * @returns Promise<RiskPrediction>
 */
export const fetchRiskPrediction = async (input: PredictionInput): Promise<RiskPrediction> => {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching risk prediction:', error);
        throw error;
    }
};

/**
 * Fetch batch predictions for multiple scenarios
 * @param scenarios - Array of prediction inputs
 * @returns Promise<RiskPrediction[]>
 */
export const fetchBatchPrediction = async (scenarios: PredictionInput[]): Promise<RiskPrediction[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/batch-predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenarios }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data: BatchPredictionResponse = await response.json();
        return data.predictions;
    } catch (error) {
        console.error('Error fetching batch prediction:', error);
        throw error;
    }
};

/**
 * Check the health of the Flask backend
 * @returns Promise<HealthStatus>
 */
export const checkBackendHealth = async (): Promise<HealthStatus> => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking backend health:', error);
        return {
            status: 'unhealthy',
            model_loaded: false,
            features_loaded: false,
            data_loaded: false,
        };
    }
};

/**
 * Get priority level based on AERS score
 * @param aers - Aadhaar Exclusion Risk Score (0-1)
 * @returns 'High' | 'Medium' | 'Low'
 */
export const getPriorityFromAERS = (aers: number): 'High' | 'Medium' | 'Low' => {
    if (aers > 0.7) return 'High';
    if (aers >= 0.3) return 'Medium';
    return 'Low';
};

/**
 * Get stress level label based on ASI score
 * @param asi - Aadhaar Stress Index (0-100)
 * @returns Stress level label
 */
export const getStressLevel = (asi: number): string => {
    if (asi >= 75) return 'High Risk';
    if (asi >= 50) return 'Elevated';
    if (asi >= 30) return 'Moderate';
    return 'Low';
};

/**
 * Default prediction input values for testing
 */
export const DEFAULT_PREDICTION_INPUT: PredictionInput = {
    d_e: 0.15,  // 15% enrollment change
    d_d: 0.10,  // 10% demographic change
    d_c: 0.08,  // 8% child update change
    b: 100,     // Biometric load
    c: 25,      // Child load
    d: 50,      // Demographic load
};
