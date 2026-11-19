from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import sqlite3
import joblib
import json
import sys
import os
import bcrypt
from datetime import datetime, timedelta

# Allow imports from root folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.predict import predict_with_explanation
from recommender.shap_recommender import generate_shap_recommendations
from backend.database import get_connection, init_db

app = FastAPI(
    title="Miva Learning Analytics API",
    version="1.0.0",
    description="At-risk student prediction system using Random Forest + SHAP"
)

# ── CORS — allows React to talk to FastAPI ────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"]
)

# ── REQUEST MODELS ────────────────────────────────────────
class StudentFeatures(BaseModel):
    student_id:            str
    total_clicks:          float = Field(ge=0)
    total_resource_access: float = Field(ge=0)
    avg_clicks_per_day:    float = Field(ge=0)
    active_days:           float = Field(ge=0)
    days_since_active:     float = Field(ge=0)
    avg_score:             float = Field(ge=0, le=100)
    submission_rate:       float = Field(ge=0, le=1)
    late_submission_rate:  float = Field(ge=0, le=1)
    num_of_prev_attempts:  float = Field(ge=0)

class LoginPayload(BaseModel):
    email:    str
    password: str

# ── STARTUP ───────────────────────────────────────────────
@app.on_event("startup")
def startup():
    init_db()
    print("✅ Database ready")

# ── ROUTES ────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Miva Learning Analytics API", "status": "running"}

@app.get("/api/v1/model/info")
def get_model_info():
    try:
        metadata = joblib.load("ml/models/model_metadata.pkl")
        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model not found: {str(e)}")

@app.post("/api/v1/assess")
def assess_student(payload: StudentFeatures):
    try:
        # Extract features
        features = payload.dict()
        student_id = features.pop("student_id")

        # Run prediction + SHAP
        result = predict_with_explanation(features)

        # Generate recommendations
        recommendations = generate_shap_recommendations(
            result["feature_impact"]
        )

        # Save to database
        conn = get_connection()
        conn.execute("""
            INSERT INTO Predictions (
                student_id, risk_category, risk_score,
                shap_contributions, dominant_indicator,
                recommendation_text, model_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            student_id,
            result["risk_label"],
            result["risk_score"],
            json.dumps(result["feature_impact"]),
            result["dominant_indicator"],
            recommendations[0]["message"] if recommendations else "No intervention needed",
            result["model_version"]
        ))
        conn.commit()
        conn.close()

        return {
            "student_id":       student_id,
            "risk":             {
                "score":   result["risk_score"],
                "label":   result["risk_label"],
                "version": result["model_version"]
            },
            "dominant_indicator":  result["dominant_indicator"],
            "feature_impact":      result["feature_impact"],
            "recommendations":     recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/dashboard")
def get_dashboard():
    conn = get_connection()

    total = conn.execute("SELECT COUNT(*) FROM Predictions").fetchone()[0]
    high  = conn.execute(
        "SELECT COUNT(*) FROM Predictions WHERE risk_category='high'"
    ).fetchone()[0]
    medium = conn.execute(
        "SELECT COUNT(*) FROM Predictions WHERE risk_category='medium'"
    ).fetchone()[0]
    low = conn.execute(
        "SELECT COUNT(*) FROM Predictions WHERE risk_category='low'"
    ).fetchone()[0]

    conn.close()

    return {
        "total_predictions": total,
        "high_risk":         high,
        "medium_risk":       medium,
        "low_risk":          low,
    }

@app.get("/api/v1/alerts")
def get_alerts():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            s.enrolment_number  AS student_id,
            p.risk_category,
            p.risk_score,
            p.dominant_indicator,
            p.recommendation_text,
            p.prediction_date
        FROM   Predictions p
        JOIN   Students s ON p.student_id = s.student_id
        WHERE  p.risk_category IN ('high', 'medium')
        ORDER  BY p.risk_score DESC
    """).fetchall()
    conn.close()

    return [dict(row) for row in rows]

@app.get("/api/v1/students")
def get_students():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            s.student_id,
            s.enrolment_number,
            s.programme,
            s.level,
            s.status,
            p.risk_category,
            p.risk_score,
            p.dominant_indicator,
            p.recommendation_text,
            p.shap_contributions,
            p.prediction_date,
            p.model_version
        FROM Students s
        JOIN Predictions p ON s.student_id = p.student_id
        ORDER BY p.risk_score DESC
    """).fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/v1/trend")
def get_trend():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            strftime('%W', prediction_date) AS week_num,
            COUNT(CASE WHEN risk_category='high'   THEN 1 END) AS high,
            COUNT(CASE WHEN risk_category='medium' THEN 1 END) AS medium,
            COUNT(CASE WHEN risk_category='low'    THEN 1 END) AS low
        FROM Predictions
        GROUP BY week_num
        ORDER BY week_num ASC
    """).fetchall()
    conn.close()

    return [
        {
            "week":   f"Wk {i+1}",
            "high":   row["high"],
            "medium": row["medium"],
            "low":    row["low"]
        }
        for i, row in enumerate(rows)
    ]

    return [dict(row) for row in rows]

@app.post("/api/v1/login")
def login(payload: LoginPayload):
    conn = get_connection()

    # Find user by email
    user = conn.execute("""
        SELECT * FROM Users WHERE email = ?
    """, (payload.email,)).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    password_match = bcrypt.checkpw(
        payload.password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not password_match:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Update last_login and session_expiry
    now    = datetime.now()
    expiry = now + timedelta(hours=4)

    conn.execute("""
        UPDATE Users
        SET last_login     = ?,
            session_expiry = ?
        WHERE user_id = ?
    """, (now.isoformat(), expiry.isoformat(), user["user_id"]))
    conn.commit()
    conn.close()

    return {
        "success":        True,
        "user_id":        user["user_id"],
        "full_name":      user["full_name"],
        "email":          user["email"],
        "role":           user["role"],
        "last_login":     now.isoformat(),
        "session_expiry": expiry.isoformat()
    }