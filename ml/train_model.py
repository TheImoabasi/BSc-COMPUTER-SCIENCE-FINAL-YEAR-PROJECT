import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    confusion_matrix
)

# ── FEATURE COLUMNS ───────────────────────────────────────
# Only numerical behavioural features — no IDs or labels
FEATURE_COLS = [
    "total_clicks",
    "total_resource_access",
    "avg_clicks_per_day",
    "active_days",
    "days_since_active",
    "avg_score",
    "submission_rate",
    "late_submission_rate",
    "num_of_prev_attempts",
]

def train():
    print("🔄 Loading feature matrix...")
    df = pd.read_csv("data/processed/student_features.csv")

    # ── PREPARE DATA ──────────────────────────────────────
    X = df[FEATURE_COLS].fillna(0)
    y = df["at_risk"]

    print(f"   {len(X)} students, {len(FEATURE_COLS)} features")
    print(f"   At-risk: {y.sum()} ({y.mean()*100:.1f}%)")

    # ── SPLIT ─────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        stratify=y,
        random_state=42
    )

    # ── SCALE ─────────────────────────────────────────────
    scaler  = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    # ── TRAIN ─────────────────────────────────────────────
    print("\n🔄 Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # ── EVALUATE ──────────────────────────────────────────
    y_pred    = model.predict(X_test)
    accuracy  = accuracy_score(y_test, y_pred)
    f1        = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall    = recall_score(y_test, y_pred)

    print("\n── Model Performance ──────────────────────────")
    print(classification_report(y_test, y_pred,
          target_names=["Not At-Risk", "At-Risk"]))
    print(f"Confusion Matrix:\n{confusion_matrix(y_test, y_pred)}")

    # ── FEATURE IMPORTANCE ────────────────────────────────
    importance = pd.Series(
        model.feature_importances_,
        index=FEATURE_COLS
    ).sort_values(ascending=False)

    print("\n── Feature Importance ─────────────────────────")
    for feat, score in importance.items():
        print(f"   {feat:<30} {score:.4f}")

    # ── SAVE MODEL + METADATA ─────────────────────────────
    model_version = datetime.now().strftime("v%Y.%m.%d")

    metadata = {
        "model_version":       model_version,
        "trained_at":          datetime.now().isoformat(),
        "trained_at_formatted": datetime.now().strftime("%d %B %Y, %I:%M %p"),
        "model_type":          "RandomForestClassifier",
        "n_estimators":        100,
        "feature_cols":        FEATURE_COLS,
        "n_features":          len(FEATURE_COLS),
        "n_train":             len(X_train),
        "n_test":              len(X_test),
        "accuracy":            float(accuracy),
        "f1_score":            float(f1),
        "precision":           float(precision),
        "recall":              float(recall),
    }

    joblib.dump(model,    "ml/models/risk_model.pkl")
    joblib.dump(scaler,   "ml/models/scaler.pkl")
    joblib.dump(metadata, "ml/models/model_metadata.pkl")
    joblib.dump(FEATURE_COLS, "ml/models/feature_cols.pkl")

    print(f"\n✅ Model saved — version {model_version}")
    print(f"   Accuracy:  {accuracy*100:.1f}%")
    print(f"   F1 Score:  {f1:.3f}")
    print(f"   Precision: {precision*100:.1f}%")
    print(f"   Recall:    {recall*100:.1f}%")

if __name__ == "__main__":
    train()