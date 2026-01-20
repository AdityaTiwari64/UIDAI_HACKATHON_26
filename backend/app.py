"""
Flask Backend for Aadhaar Stress and Risk Model Prediction
This server provides endpoints for CSV-based lookups and ML predictions.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="*")  # Allow all origins for production (Vercel frontend)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the model and feature names on startup
try:
    model = joblib.load(os.path.join(BASE_DIR, 'uidai_risk_model.pkl'))
    feature_names = joblib.load(os.path.join(BASE_DIR, 'model_features.pkl'))
    print("✓ Model and feature importances loaded successfully!")
    print(f"  Feature names: {list(feature_names)}")
    print(f"  Model expects {model.n_features_in_} features")
except Exception as e:
    print(f"✗ Error loading model files: {e}")
    model = None
    feature_names = None

# Load the processed master data CSV
try:
    master_df = pd.read_csv(os.path.join(BASE_DIR, 'processed_master_data.csv'))
    # Clean up column names
    master_df.columns = master_df.columns.str.strip()
    print(f"✓ Master data loaded: {len(master_df)} records")
    print(f"  States: {master_df['state'].nunique()}")
    print(f"  Districts: {master_df['district'].nunique()}")
    print(f"  Months: {master_df['month'].nunique()}")
except Exception as e:
    print(f"✗ Error loading master data CSV: {e}")
    master_df = None


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify server is running."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'features_loaded': feature_names is not None,
        'data_loaded': master_df is not None,
        'expected_features': list(feature_names) if feature_names is not None else [],
        'records_count': len(master_df) if master_df is not None else 0
    })


@app.route('/metadata', methods=['GET'])
def get_metadata():
    """
    Get unique values for dropdown menus.
    Returns states, districts, and months available in the dataset.
    """
    if master_df is None:
        return jsonify({'error': 'Master data not loaded'}), 500
    
    try:
        # Get unique states sorted alphabetically
        states = sorted(master_df['state'].unique().tolist())
        
        # Get unique months sorted chronologically
        months = sorted(master_df['month'].unique().tolist())
        
        # Get districts grouped by state
        districts_by_state = {}
        for state in states:
            state_districts = sorted(
                master_df[master_df['state'] == state]['district'].unique().tolist()
            )
            districts_by_state[state] = state_districts
        
        return jsonify({
            'states': states,
            'months': months,
            'districts_by_state': districts_by_state
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/districts', methods=['GET'])
def get_districts():
    """
    Get districts for a specific state.
    Query parameter: state
    """
    if master_df is None:
        return jsonify({'error': 'Master data not loaded'}), 500
    
    state = request.args.get('state', '')
    
    if not state:
        return jsonify({'error': 'State parameter is required'}), 400
    
    try:
        districts = sorted(
            master_df[master_df['state'] == state]['district'].unique().tolist()
        )
        return jsonify({'districts': districts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/history', methods=['GET'])
def get_history():
    """
    Get historical time-series data for a state/district.
    Returns all records sorted by month with calculated ASI and AERS for trend charts.
    
    Query parameters:
        state: string (required)
        district: string (required)
    
    Returns:
        List of records with month, asi, aers, mbu, and raw features
    """
    if master_df is None:
        return jsonify({'error': 'Master data not loaded'}), 500
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    state = request.args.get('state', '')
    district = request.args.get('district', '')
    
    if not state or not district:
        return jsonify({'error': 'Both state and district parameters are required'}), 400
    
    try:
        # Filter for the specific location
        mask = (master_df['state'] == state) & (master_df['district'] == district)
        filtered = master_df[mask].copy()
        
        if filtered.empty:
            return jsonify({
                'error': f'No data found for "{district}" in "{state}"'
            }), 404
        
        # Sort by month chronologically
        filtered = filtered.sort_values('month')
        
        # Get feature importances
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            imp_e = importances[0] if len(importances) > 0 else 0.33
            imp_d = importances[1] if len(importances) > 1 else 0.33
            imp_c = importances[2] if len(importances) > 2 else 0.34
        else:
            imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
        
        history = []
        for _, row in filtered.iterrows():
            # Extract features
            d_e = float(row.get('d_e', 0))
            d_d = float(row.get('d_d', 0))
            d_c = float(row.get('d_c', 0))
            d_b_lag1 = float(row.get('d_b_lag1', 0))
            d_b_lag2 = float(row.get('d_b_lag2', 0))
            d_c_lag1 = float(row.get('d_c_lag1', 0))
            month_num = int(row.get('month_num', 1))
            
            b = float(row.get('B', row.get('b', 100)))
            c = float(row.get('C', row.get('c', 25)))
            d = float(row.get('D', row.get('d', 50)))
            
            # Get ML prediction
            features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
            ml_prediction = model.predict(features)[0]
            
            # Physics-based calculations (from walkthrough)
            # ASI = (1.0 * ML_Prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
            asi_raw = (1.0 * ml_prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
            
            # MBU = c / (b + d + 1e-6) with safety factor
            mbu = c / (b + d + 1e-6)
            
            # RP = (b - c) / (b + 1e-6) with safety factor
            rp = (b - c) / (b + 1e-6)
            
            # AERS = ASI * (MBU + RP)
            aers_raw = asi_raw * (mbu + rp)
            
            # Normalize ASI to 0-100 scale
            asi_normalized = min(max(abs(ml_prediction) * 100 + 50, 0), 100)
            
            # Normalize AERS to 0-1 scale
            aers_normalized = min(max(abs(aers_raw), 0), 1)
            
            history.append({
                'month': row['month'],
                'asi': round(asi_normalized, 2),
                'aers': round(aers_normalized, 4),
                'mbu': round(mbu, 4),
                'rp': round(rp, 4),
                'ml_prediction': round(ml_prediction, 6),
                'd_e': round(d_e, 6),
                'd_d': round(d_d, 6),
                'd_c': round(d_c, 6),
                'b': round(b, 2),
                'c': round(c, 2),
                'd': round(d, 2)
            })
        
        return jsonify({
            'state': state,
            'district': district,
            'records_count': len(history),
            'history': history
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict system stress and exclusion risk using CSV lookup.
    
    Expected JSON input:
    {
        "state": string,      # State name
        "district": string,   # District name
        "month": string       # Month in format "2025-10"
    }
    
    OR original format for manual input:
    {
        "d_e": float,
        "d_d": float,
        "d_c": float,
        ...
    }
    
    Returns:
    {
        "asi": float,
        "aers": float,
        "mbu": float,
        ...
    }
    """
    if model is None or feature_names is None:
        return jsonify({
            'error': 'Model not loaded. Please check server logs.'
        }), 500
    
    try:
        data = request.get_json()
        
        # Check if this is a CSV lookup request
        if 'state' in data and 'district' in data and 'month' in data:
            return predict_from_csv(data)
        else:
            return predict_from_manual(data)
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


def predict_from_csv(data):
    """Handle prediction from CSV lookup."""
    if master_df is None:
        return jsonify({'error': 'Master data not loaded'}), 500
    
    state = data.get('state', '')
    district = data.get('district', '')
    month = data.get('month', '')
    
    # Filter the DataFrame for matching records
    mask = (
        (master_df['state'] == state) & 
        (master_df['district'] == district) & 
        (master_df['month'] == month)
    )
    
    filtered = master_df[mask]
    
    if filtered.empty:
        # Check if district exists but month doesn't
        district_mask = (master_df['state'] == state) & (master_df['district'] == district)
        district_data = master_df[district_mask].sort_values('month')
        
        if district_data.empty:
            return jsonify({
                'error': f'No data found for district "{district}" in state "{state}"'
            }), 404
        
        # For 2026-01 or future months, generate prediction using trend extrapolation
        if month >= '2026-01':
            # Get historical data (≤2025-12)
            historical = district_data[district_data['month'] <= '2025-12']
            
            if len(historical) < 2:
                return jsonify({'error': 'Insufficient historical data for trend projection'}), 404
            
            # Calculate trends from last 3 records
            n_trend = min(3, len(historical))
            trend_data = historical.tail(n_trend)
            
            d_e_trend = (trend_data['d_e'].iloc[-1] - trend_data['d_e'].iloc[0]) / max(n_trend - 1, 1)
            d_d_trend = (trend_data['d_d'].iloc[-1] - trend_data['d_d'].iloc[0]) / max(n_trend - 1, 1)
            d_c_trend = (trend_data['d_c'].iloc[-1] - trend_data['d_c'].iloc[0]) / max(n_trend - 1, 1)
            
            # B/C/D trends
            b_col = 'B' if 'B' in trend_data.columns else 'b'
            c_col = 'C' if 'C' in trend_data.columns else 'c'
            d_col = 'D' if 'D' in trend_data.columns else 'd'
            
            b_trend = (float(trend_data[b_col].iloc[-1]) - float(trend_data[b_col].iloc[0])) / max(n_trend - 1, 1)
            c_trend = (float(trend_data[c_col].iloc[-1]) - float(trend_data[c_col].iloc[0])) / max(n_trend - 1, 1)
            d_trend_val = (float(trend_data[d_col].iloc[-1]) - float(trend_data[d_col].iloc[0])) / max(n_trend - 1, 1)
            
            # Calculate months ahead from last historical
            last_hist = historical.iloc[-1]
            last_month = last_hist['month']
            # Simple month difference (assuming format YYYY-MM)
            ly, lm = int(last_month[:4]), int(last_month[5:7])
            ty, tm = int(month[:4]), int(month[5:7])
            months_ahead = (ty - ly) * 12 + (tm - lm)
            
            # Extrapolate features
            d_e = float(last_hist.get('d_e', 0)) + d_e_trend * months_ahead
            d_d = float(last_hist.get('d_d', 0)) + d_d_trend * months_ahead
            d_c = float(last_hist.get('d_c', 0)) + d_c_trend * months_ahead
            d_b_lag1 = float(last_hist.get('d_b_lag1', 0))
            d_b_lag2 = float(last_hist.get('d_b_lag2', 0))
            d_c_lag1 = float(last_hist.get('d_c_lag1', 0))
            month_num = tm
            
            b = max(float(last_hist.get(b_col, 100)) + b_trend * months_ahead, 1)
            c = max(float(last_hist.get(c_col, 25)) + c_trend * months_ahead, 0)
            d = max(float(last_hist.get(d_col, 50)) + d_trend_val * months_ahead, 1)
            
            # Calculate prediction
            features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
            ml_prediction = model.predict(features)[0]
            
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
                imp_e = importances[0] if len(importances) > 0 else 0.33
                imp_d = importances[1] if len(importances) > 1 else 0.33
                imp_c = importances[2] if len(importances) > 2 else 0.34
            else:
                imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
            
            asi_raw = (1.0 * ml_prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
            mbu = c / (b + d + 1e-6)
            rp = (b - c) / (b + 1e-6)
            aers_raw = asi_raw * (mbu + rp)
            
            asi_normalized = min(max(abs(ml_prediction) * 100 + 50, 0), 100)
            aers_normalized = min(max(abs(aers_raw), 0), 1)
            
            return jsonify({
                'asi': round(asi_normalized, 2),
                'aers': round(aers_normalized, 4),
                'mbu': round(mbu, 4),
                'rp': round(rp, 4),
                'ml_prediction': round(ml_prediction, 6),
                'is_projected': True,
                'extracted_features': {
                    'd_e': round(d_e, 6),
                    'd_d': round(d_d, 6),
                    'd_c': round(d_c, 6),
                    'd_b_lag1': round(d_b_lag1, 6),
                    'd_b_lag2': round(d_b_lag2, 6),
                    'd_c_lag1': round(d_c_lag1, 6),
                    'month_num': month_num,
                    'b': round(b, 2),
                    'c': round(c, 2),
                    'd': round(d, 2)
                },
                'location': {
                    'state': state,
                    'district': district,
                    'month': month
                }
            })
        else:
            available_months = sorted(district_data['month'].unique().tolist())
            return jsonify({
                'error': f'No historical data for period "{month}". Available months: {", ".join(available_months[-5:])}'
            }), 404
    
    # Get the first matching record (for actual historical data)
    record = filtered.iloc[0]
    
    # Extract features from CSV
    d_e = float(record.get('d_e', 0))
    d_d = float(record.get('d_d', 0))
    d_c = float(record.get('d_c', 0))
    d_b_lag1 = float(record.get('d_b_lag1', 0))
    d_b_lag2 = float(record.get('d_b_lag2', 0))
    d_c_lag1 = float(record.get('d_c_lag1', 0))
    month_num = int(record.get('month_num', datetime.now().month))
    
    # Extract load values for physics-based calculations  
    # Use the CSV column names: B (adult biometric), C (child), D (demographic)
    b = float(record.get('B', record.get('b', 100)))  # Biometric load
    c = float(record.get('C', record.get('c', 25)))   # Child load
    d = float(record.get('D', record.get('d', 50)))   # Demographic load
    
    # Prepare features for the model
    features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
    
    # Get ML prediction
    ml_prediction = model.predict(features)[0]
    
    # Get feature importances
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        imp_e = importances[0] if len(importances) > 0 else 0.33
        imp_d = importances[1] if len(importances) > 1 else 0.33
        imp_c = importances[2] if len(importances) > 2 else 0.34
    else:
        imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
    
    # Calculate Physics-based indices from walkthrough.md formulas
    # ASI = (1.0 * ML_Prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
    asi = (1.0 * ml_prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
    
    # MBU = c / (b + d + 1e-6) with safety factor
    mbu = c / (b + d + 1e-6)
    
    # RP = (b - c) / (b + 1e-6) with safety factor
    rp = (b - c) / (b + 1e-6)
    
    # AERS = ASI * (MBU + RP)
    aers = asi * (mbu + rp)
    
    # Normalize ASI to 0-100 scale
    asi_normalized = min(max(abs(ml_prediction) * 100 + 50, 0), 100)
    
    # Normalize AERS to 0-1 scale
    aers_normalized = min(max(abs(aers), 0), 1)
    
    return jsonify({
        'asi': round(asi_normalized, 2),
        'aers': round(aers_normalized, 4),
        'mbu': round(mbu, 4),
        'rp': round(rp, 4),
        'ml_prediction': round(ml_prediction, 6),
        'feature_importances': {
            'imp_e': round(imp_e, 4),
            'imp_d': round(imp_d, 4),
            'imp_c': round(imp_c, 4)
        },
        # Return the extracted features for transparency
        'extracted_features': {
            'd_e': round(d_e, 6),
            'd_d': round(d_d, 6),
            'd_c': round(d_c, 6),
            'd_b_lag1': round(d_b_lag1, 6),
            'd_b_lag2': round(d_b_lag2, 6),
            'd_c_lag1': round(d_c_lag1, 6),
            'month_num': month_num,
            'b': round(b, 2),
            'c': round(c, 2),
            'd': round(d, 2)
        },
        'location': {
            'state': state,
            'district': district,
            'month': month
        }
    })


def predict_from_manual(data):
    """Handle prediction from manual input (original behavior)."""
    # Extract main delta drivers
    d_e = float(data.get('d_e', 0))
    d_d = float(data.get('d_d', 0))
    d_c = float(data.get('d_c', 0))
    
    # Extract lag features (optional)
    d_b_lag1 = float(data.get('d_b_lag1', 0))
    d_b_lag2 = float(data.get('d_b_lag2', 0))
    d_c_lag1 = float(data.get('d_c_lag1', d_c * 0.9))
    
    # Month number
    month_num = int(data.get('month_num', datetime.now().month))
    
    # Extract load values
    b = float(data.get('b', 100))
    c = float(data.get('c', 25))
    d = float(data.get('d', 50))
    
    # Prepare features
    features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
    
    # Get ML prediction
    ml_prediction = model.predict(features)[0]
    
    # Get feature importances
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        imp_e, imp_d, imp_c = importances[0], importances[1], importances[2]
    else:
        imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
    
    # Calculate indices
    asi = (1.0 * ml_prediction) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
    mbu = c / (b + d + 1e-6)
    rp = (b - c) / (b + 1e-6)
    aers = asi * (mbu + rp)
    
    asi_normalized = min(max(abs(ml_prediction) * 100 + 50, 0), 100)
    aers_normalized = min(max(abs(aers), 0), 1)
    
    return jsonify({
        'asi': round(asi_normalized, 2),
        'aers': round(aers_normalized, 4),
        'mbu': round(mbu, 4),
        'rp': round(rp, 4),
        'ml_prediction': round(ml_prediction, 6),
        'feature_importances': {
            'imp_e': round(imp_e, 4),
            'imp_d': round(imp_d, 4),
            'imp_c': round(imp_c, 4)
        }
    })


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Batch prediction for multiple scenarios."""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        scenarios = data.get('scenarios', [])
        
        results = []
        for scenario in scenarios:
            if 'state' in scenario and 'district' in scenario and 'month' in scenario:
                # CSV lookup
                result = predict_from_csv(scenario)
            else:
                result = predict_from_manual(scenario)
            results.append(result.get_json())
        
        return jsonify({'predictions': results})
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model."""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    info = {
        'model_type': str(type(model).__name__),
        'n_features': model.n_features_in_ if hasattr(model, 'n_features_in_') else None,
        'feature_names': list(feature_names) if feature_names is not None else [],
    }
    
    if hasattr(model, 'feature_importances_'):
        info['feature_importances'] = {
            name: round(float(imp), 4) 
            for name, imp in zip(feature_names, model.feature_importances_)
        }
    
    if hasattr(model, 'n_estimators'):
        info['n_estimators'] = model.n_estimators
    
    return jsonify(info)


@app.route('/forecast', methods=['POST'])
def forecast_3_months():
    """
    Generate 3-month ahead forecast with timeline:
    - Historical: ≤ 2025-12
    - Current: 2026-01 (generated if not in CSV)
    - Future: 2026-02, 2026-03, 2026-04
    
    Features independent MBU projections with b/c/d trending.
    """
    if model is None or master_df is None:
        return jsonify({'error': 'Model or data not loaded'}), 500
    
    try:
        data = request.get_json()
        state = data.get('state', '')
        district = data.get('district', '')
        
        if not state or not district:
            return jsonify({'error': 'State and district are required'}), 400
        
        # Get all data for the location
        mask = (master_df['state'] == state) & (master_df['district'] == district)
        all_data = master_df[mask].sort_values('month')
        
        if all_data.empty:
            return jsonify({'error': 'No data found for this location'}), 404
        
        # Split into historical (≤2025-12) 
        CURRENT_MONTH = "2026-01"
        historical = all_data[all_data['month'] <= '2025-12']
        
        if len(historical) < 2:
            return jsonify({'error': 'Insufficient historical data (need at least 2 months before 2026)'}), 404
        
        # Get feature importances
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            imp_e = importances[0] if len(importances) > 0 else 0.33
            imp_d = importances[1] if len(importances) > 1 else 0.33
            imp_c = importances[2] if len(importances) > 2 else 0.34
        else:
            imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
        
        # Calculate trends from last 3 historical records
        n_trend = min(3, len(historical))
        trend_data = historical.tail(n_trend)
        
        # Feature trends (d_e, d_d, d_c)
        d_e_trend = (trend_data['d_e'].iloc[-1] - trend_data['d_e'].iloc[0]) / max(n_trend - 1, 1)
        d_d_trend = (trend_data['d_d'].iloc[-1] - trend_data['d_d'].iloc[0]) / max(n_trend - 1, 1)
        d_c_trend = (trend_data['d_c'].iloc[-1] - trend_data['d_c'].iloc[0]) / max(n_trend - 1, 1)
        
        # B/C/D trends for independent MBU projections
        b_col = 'B' if 'B' in trend_data.columns else 'b'
        c_col = 'C' if 'C' in trend_data.columns else 'c'
        d_col = 'D' if 'D' in trend_data.columns else 'd'
        
        b_trend = (float(trend_data[b_col].iloc[-1]) - float(trend_data[b_col].iloc[0])) / max(n_trend - 1, 1)
        c_trend = (float(trend_data[c_col].iloc[-1]) - float(trend_data[c_col].iloc[0])) / max(n_trend - 1, 1)
        d_trend = (float(trend_data[d_col].iloc[-1]) - float(trend_data[d_col].iloc[0])) / max(n_trend - 1, 1)
        
        # Get base values from last historical record
        latest_hist = historical.iloc[-1]
        base_d_e = float(latest_hist.get('d_e', 0))
        base_d_d = float(latest_hist.get('d_d', 0))
        base_d_c = float(latest_hist.get('d_c', 0))
        base_d_b_lag1 = float(latest_hist.get('d_b_lag1', 0))
        base_d_b_lag2 = float(latest_hist.get('d_b_lag2', 0))
        base_d_c_lag1 = float(latest_hist.get('d_c_lag1', 0))
        base_b = float(latest_hist.get(b_col, 100))
        base_c = float(latest_hist.get(c_col, 25))
        base_d = float(latest_hist.get(d_col, 50))
        
        # Helper function to calculate indices with unique MBU
        def calculate_indices(d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num, b, c, d):
            features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
            ml_pred = model.predict(features)[0]
            
            asi_raw = (1.0 * ml_pred) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
            # Independent MBU calculation with trended b, c, d
            mbu = c / (b + d + 1e-6)
            rp = (b - c) / (b + 1e-6)
            aers_raw = asi_raw * (mbu + rp)
            
            asi_normalized = min(max(abs(ml_pred) * 100 + 50, 0), 100)
            aers_normalized = min(max(abs(aers_raw), 0), 1)
            
            return {
                'asi': round(asi_normalized, 2),
                'aers': round(aers_normalized, 4),
                'mbu': round(mbu, 4),
                'rp': round(rp, 4),
                'ml_prediction': round(ml_pred, 6),
                'd_e': round(d_e, 6),
                'd_d': round(d_d, 6),
                'd_c': round(d_c, 6),
                'b': round(b, 2),
                'c': round(c, 2),
                'd': round(d, 2)
            }
        
        # Check if 2026-01 exists in data or needs to be generated
        current_data = all_data[all_data['month'] == CURRENT_MONTH]
        
        if not current_data.empty:
            # Use actual 2026-01 data
            curr_row = current_data.iloc[0]
            curr_d_e = float(curr_row.get('d_e', 0))
            curr_d_d = float(curr_row.get('d_d', 0))
            curr_d_c = float(curr_row.get('d_c', 0))
            curr_d_b_lag1 = float(curr_row.get('d_b_lag1', 0))
            curr_d_b_lag2 = float(curr_row.get('d_b_lag2', 0))
            curr_d_c_lag1 = float(curr_row.get('d_c_lag1', 0))
            curr_b = float(curr_row.get(b_col, 100))
            curr_c = float(curr_row.get(c_col, 25))
            curr_d = float(curr_row.get(d_col, 50))
            current_is_actual = True
        else:
            # Generate 2026-01 prediction from trend
            curr_d_e = base_d_e + d_e_trend
            curr_d_d = base_d_d + d_d_trend
            curr_d_c = base_d_c + d_c_trend
            curr_d_b_lag1 = base_d_e  # Use d_e as proxy
            curr_d_b_lag2 = base_d_b_lag1
            curr_d_c_lag1 = base_d_c
            curr_b = base_b + b_trend
            curr_c = base_c + c_trend
            curr_d = base_d + d_trend
            current_is_actual = False
        
        current = calculate_indices(
            curr_d_e, curr_d_d, curr_d_c,
            curr_d_b_lag1, curr_d_b_lag2, curr_d_c_lag1,
            1,  # January = month 1
            curr_b, curr_c, curr_d
        )
        current['month'] = CURRENT_MONTH
        current['is_actual'] = current_is_actual
        
        # Generate future months: Feb, Mar, Apr 2026
        future_months = ['2026-02', '2026-03', '2026-04']
        forecasts = []
        
        prev_d_e, prev_d_d, prev_d_c = curr_d_e, curr_d_d, curr_d_c
        prev_d_b_lag1, prev_d_b_lag2, prev_d_c_lag1 = curr_d_b_lag1, curr_d_b_lag2, curr_d_c_lag1
        prev_b, prev_c, prev_d = curr_b, curr_c, curr_d
        
        for i, future_month in enumerate(future_months):
            # Trend all features including b, c, d for independent MBU
            new_d_e = prev_d_e + d_e_trend
            new_d_d = prev_d_d + d_d_trend
            new_d_c = prev_d_c + d_c_trend
            
            # Independent b, c, d trending for unique MBU
            new_b = max(prev_b + b_trend, 1)  # Ensure positive
            new_c = max(prev_c + c_trend, 0)  # Child can be 0
            new_d = max(prev_d + d_trend, 1)  # Ensure positive
            
            # Update lag features recursively
            new_d_b_lag2 = prev_d_b_lag1
            new_d_b_lag1 = prev_d_e
            new_d_c_lag1 = prev_d_c
            
            # Month number (Feb=2, Mar=3, Apr=4)
            month_num = i + 2
            
            forecast = calculate_indices(
                new_d_e, new_d_d, new_d_c,
                new_d_b_lag1, new_d_b_lag2, new_d_c_lag1,
                month_num, new_b, new_c, new_d
            )
            forecast['month'] = future_month
            forecast['is_actual'] = False
            forecasts.append(forecast)
            
            # Update for next iteration
            prev_d_e, prev_d_d, prev_d_c = new_d_e, new_d_d, new_d_c
            prev_d_b_lag1, prev_d_b_lag2, prev_d_c_lag1 = new_d_b_lag1, new_d_b_lag2, new_d_c_lag1
            prev_b, prev_c, prev_d = new_b, new_c, new_d
        
        # Historical summary (last 3 records ≤2025-12)
        historical_summary = []
        for _, row in historical.tail(3).iterrows():
            hist_b = float(row.get(b_col, 100))
            hist_c = float(row.get(c_col, 25))
            hist_d = float(row.get(d_col, 50))
            hist_indices = calculate_indices(
                float(row.get('d_e', 0)),
                float(row.get('d_d', 0)),
                float(row.get('d_c', 0)),
                float(row.get('d_b_lag1', 0)),
                float(row.get('d_b_lag2', 0)),
                float(row.get('d_c_lag1', 0)),
                int(row.get('month_num', 1)),
                hist_b, hist_c, hist_d
            )
            hist_indices['month'] = row['month']
            hist_indices['is_actual'] = True
            historical_summary.append(hist_indices)
        
        return jsonify({
            'state': state,
            'district': district,
            'timeline': {
                'historical_cutoff': '2025-12',
                'current_month': CURRENT_MONTH,
                'future_start': '2026-02'
            },
            'trends': {
                'b_trend': round(b_trend, 2),
                'c_trend': round(c_trend, 2),
                'd_trend': round(d_trend, 2)
            },
            'historical': historical_summary,
            'current': current,
            'month1': forecasts[0],  # Feb 2026
            'month2': forecasts[1],  # Mar 2026
            'month3': forecasts[2]   # Apr 2026
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@app.route('/aggregate', methods=['GET'])
def get_state_aggregate():
    """
    Get aggregated metrics for an entire state.
    
    Query parameters:
        state: string (required)
    
    Returns average ASI, AERS, MBU, and workload composition across all districts.
    """
    if model is None or master_df is None:
        return jsonify({'error': 'Model or data not loaded'}), 500
    
    state = request.args.get('state', '')
    
    if not state:
        return jsonify({'error': 'State parameter is required'}), 400
    
    try:
        # Get all districts in the state
        mask = master_df['state'] == state
        filtered = master_df[mask]
        
        if filtered.empty:
            return jsonify({'error': f'No data for state "{state}"'}), 404
        
        # Get latest month
        latest_month = sorted(filtered['month'].unique())[-1]
        latest_data = filtered[filtered['month'] == latest_month]
        
        # Get feature importances
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            imp_e = importances[0] if len(importances) > 0 else 0.33
            imp_d = importances[1] if len(importances) > 1 else 0.33
            imp_c = importances[2] if len(importances) > 2 else 0.34
        else:
            imp_e, imp_d, imp_c = 0.34, 0.33, 0.33
        
        # Calculate indices for each district and aggregate
        asi_sum, aers_sum, mbu_sum, rp_sum = 0, 0, 0, 0
        b_sum, c_sum, d_sum = 0, 0, 0
        count = 0
        
        district_data = []
        
        for _, row in latest_data.iterrows():
            d_e = float(row.get('d_e', 0))
            d_d = float(row.get('d_d', 0))
            d_c = float(row.get('d_c', 0))
            d_b_lag1 = float(row.get('d_b_lag1', 0))
            d_b_lag2 = float(row.get('d_b_lag2', 0))
            d_c_lag1 = float(row.get('d_c_lag1', 0))
            month_num = int(row.get('month_num', 1))
            b = float(row.get('B', row.get('b', 100)))
            c = float(row.get('C', row.get('c', 25)))
            d_val = float(row.get('D', row.get('d', 50)))
            
            features = np.array([[d_e, d_d, d_c, d_b_lag1, d_b_lag2, d_c_lag1, month_num]])
            ml_pred = model.predict(features)[0]
            
            asi_raw = (1.0 * ml_pred) + (imp_c * d_c) + (imp_d * d_d) + (imp_e * d_e)
            mbu = c / (b + d_val + 1e-6)
            rp = (b - c) / (b + 1e-6)
            aers_raw = asi_raw * (mbu + rp)
            
            asi_normalized = min(max(abs(ml_pred) * 100 + 50, 0), 100)
            aers_normalized = min(max(abs(aers_raw), 0), 1)
            
            asi_sum += asi_normalized
            aers_sum += aers_normalized
            mbu_sum += mbu
            rp_sum += rp
            b_sum += b
            c_sum += c
            d_sum += d_val
            count += 1
            
            district_data.append({
                'district': row['district'],
                'asi': round(asi_normalized, 2),
                'aers': round(aers_normalized, 4)
            })
        
        avg_asi = asi_sum / count if count > 0 else 0
        avg_aers = aers_sum / count if count > 0 else 0
        avg_mbu = mbu_sum / count if count > 0 else 0
        avg_rp = rp_sum / count if count > 0 else 0
        
        # Sort districts by ASI for ranking
        district_data.sort(key=lambda x: x['asi'], reverse=True)
        
        return jsonify({
            'state': state,
            'month': latest_month,
            'districts_count': count,
            'average': {
                'asi': round(avg_asi, 2),
                'aers': round(avg_aers, 4),
                'mbu': round(avg_mbu, 4),
                'rp': round(avg_rp, 4)
            },
            'workload': {
                'biometric': round(b_sum, 2),
                'child': round(c_sum, 2),
                'demographic': round(d_sum, 2)
            },
            'top_districts': district_data[:5],
            'all_districts': district_data
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("  Aadhaar Risk Model API Server (3-Month Forecast)")
    print("="*60)
    print(f"  Running on http://localhost:5000")
    print(f"  Endpoints:")
    print(f"    GET  /health        - Health check")
    print(f"    GET  /metadata      - Get states, districts, months")
    print(f"    GET  /districts     - Get districts for a state")
    print(f"    GET  /history       - Historical time-series data")
    print(f"    GET  /aggregate     - State-level aggregate metrics")
    print(f"    GET  /model-info    - Model information")
    print(f"    POST /predict       - Single prediction")
    print(f"    POST /forecast      - 3-month forecast")
    print(f"    POST /batch-predict - Batch predictions")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
