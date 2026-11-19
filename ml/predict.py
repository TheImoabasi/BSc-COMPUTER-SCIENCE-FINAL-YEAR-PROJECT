import joblib
import shap
import numpy as np
import pandas as pd
import json

def load_artifacts():
    model        = joblib.load("ml/models/risk_model.pkl")
    scaler       = joblib.load("ml/models/scaler.pkl")
    feature_cols = joblib.load("ml/models/feature_cols.pkl")
    metadata     = joblib.load("ml/models/model_metadata.pkl")
    explainer    = shap.TreeExplainer(model)
    return model, scaler, feature_cols, metadata, explainer

def predict_with_explanation(student_features: dict):
    model, scaler, feature_cols, metadata, explainer = load_artifacts()

    # ── PREPARE INPUT ─────────────────────────────────────
    # Use DataFrame to preserve feature names — fixes the warning
    values = [student_features.get(col, 0) for col in feature_cols]
    X_df   = pd.DataFrame([values], columns=feature_cols)
    X_scaled = scaler.transform(X_df)
    X_scaled_df = pd.DataFrame(X_scaled, columns=feature_cols)

    # ── PREDICT ───────────────────────────────────────────
    risk_score = model.predict_proba(X_scaled_df)[0][1]

    if risk_score >= 0.70:
        risk_label = "high"
    elif risk_score >= 0.40:
        risk_label = "medium"
    else:
        risk_label = "low"

    # ── SHAP EXPLANATION ──────────────────────────────────
    shap_values = explainer.shap_values(X_scaled_df)

    # shap_values is a list of arrays for each class
    # For binary classification: shap_values[1] = contributions toward at-risk
    # Handle both old and new SHAP return formats
    if isinstance(shap_values, list):
        # Old format: list of arrays [class_0, class_1]
        contributions = shap_values[1][0]
    else:
        # New format: single 3D array
        contributions = shap_values[0, :, 1]

    feature_impact = []
    for i, col in enumerate(feature_cols):
        feature_impact.append({
            "feature": col,
            "value":   round(float(values[i]), 4),
            "impact":  round(float(contributions[i]), 4)
        })

    # Sort by absolute impact — highest first
    feature_impact.sort(key=lambda x: abs(x["impact"]), reverse=True)

    # ── DOMINANT INDICATOR ────────────────────────────────
    risk_drivers = [f for f in feature_impact if f["impact"] > 0]
    dominant     = risk_drivers[0]["feature"] if risk_drivers else feature_impact[0]["feature"]

    return {
        "risk_score":         round(float(risk_score), 3),
        "risk_label":         risk_label,
        "feature_impact":     feature_impact,
        "dominant_indicator": dominant,
        "model_version":      metadata["model_version"]
    }

if __name__ == "__main__":
    # Quick test with a sample at-risk student
    sample = {
        "total_clicks":          45,
        "total_resource_access": 12,
        "avg_clicks_per_day":    3.2,
        "active_days":           8,
        "days_since_active":     14,
        "avg_score":             38.0,
        "submission_rate":       0.3,
        "late_submission_rate":  0.6,
        "num_of_prev_attempts":  1,
    }

    result = predict_with_explanation(sample)

    print(f"\n── Prediction Result ──────────────────────────")
    print(f"   Risk Score:    {result['risk_score']}")
    print(f"   Risk Label:    {result['risk_label'].upper()}")
    print(f"   Dominant:      {result['dominant_indicator']}")
    print(f"   Model Version: {result['model_version']}")
    print(f"\n── SHAP Feature Impact ────────────────────────")
    for f in result["feature_impact"]:
        bar = "▲" if f["impact"] > 0 else "▼"
        print(f"   {bar} {f['feature']:<30} {f['impact']:+.4f}")