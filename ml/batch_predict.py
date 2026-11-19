import pandas as pd
import numpy as np
import sqlite3
import json
import sys
import os

# Allow imports from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.predict import predict_with_explanation
from recommender.shap_recommender import generate_shap_recommendations
from backend.database import get_connection

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

def batch_process():
    print("🔄 Loading processed features...")
    df = pd.read_csv("data/processed/student_features.csv")
    df = df.fillna(0)

    # Limit to 500 students for speed during prototype
    # Remove this line when you have more time/resources
    df = df.head(500)

    print(f"   Processing {len(df)} students...")

    conn = get_connection()

    # Clear previous predictions so we don't duplicate
    conn.execute("DELETE FROM Predictions")
    conn.execute("DELETE FROM Students")
    conn.commit()

    success = 0
    failed  = 0

    for _, row in df.iterrows():
        try:
            student_id = str(int(row["id_student"]))

            # ── Insert student record ──────────────────────
            conn.execute("""
                INSERT OR IGNORE INTO Students
                    (enrolment_number, programme, level,
                     enrolment_date, status)
                VALUES (?, ?, ?, ?, ?)
            """, (
                student_id,
                row.get("region", "Unknown"),
                row.get("highest_education", "Unknown"),
                "2014-01-01",
                "active" if row.get("final_result") not in
                            ["Withdrawn"] else "withdrawn"
            ))

            # Get the inserted student's PK
            db_student = conn.execute("""
                SELECT student_id FROM Students
                WHERE enrolment_number = ?
            """, (student_id,)).fetchone()

            if not db_student:
                continue

            db_student_id = db_student[0]

            # ── Build feature dict ─────────────────────────
            features = {col: float(row.get(col, 0)) for col in FEATURE_COLS}

            # ── Predict + SHAP ─────────────────────────────
            result = predict_with_explanation(features)
            recs   = generate_shap_recommendations(result["feature_impact"])

            # ── Save prediction ────────────────────────────
            conn.execute("""
                INSERT INTO Predictions (
                    student_id, risk_category, risk_score,
                    shap_contributions, dominant_indicator,
                    recommendation_text, model_version
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                db_student_id,
                result["risk_label"],
                result["risk_score"],
                json.dumps(result["feature_impact"]),
                result["dominant_indicator"],
                recs[0]["message"] if recs else "No intervention needed",
                result["model_version"]
            ))

            success += 1

            if success % 50 == 0:
                conn.commit()
                print(f"   ✅ {success} students processed...")

        except Exception as e:
            failed += 1
            continue

    conn.commit()
    conn.close()

    print(f"\n✅ Batch processing complete")
    print(f"   Successful: {success}")
    print(f"   Failed:     {failed}")

    # ── Summary stats ──────────────────────────────────────
    conn = get_connection()
    high   = conn.execute("SELECT COUNT(*) FROM Predictions WHERE risk_category='high'").fetchone()[0]
    medium = conn.execute("SELECT COUNT(*) FROM Predictions WHERE risk_category='medium'").fetchone()[0]
    low    = conn.execute("SELECT COUNT(*) FROM Predictions WHERE risk_category='low'").fetchone()[0]
    conn.close()

    print(f"\n── Risk Distribution ──────────────────────────")
    print(f"   High Risk:   {high}")
    print(f"   Medium Risk: {medium}")
    print(f"   Low Risk:    {low}")

if __name__ == "__main__":
    batch_process()