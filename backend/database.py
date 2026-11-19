import sqlite3
from datetime import datetime

import sqlite3
import os
from datetime import datetime

# Always points to root folder regardless of where script is run from
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "miva_analytics.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets you access columns by name
    return conn

def init_db():
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS Users (
            user_id        INTEGER  PRIMARY KEY AUTOINCREMENT,
            full_name      TEXT     NOT NULL,
            email          TEXT     NOT NULL UNIQUE,
            password_hash  TEXT     NOT NULL,
            role           TEXT     NOT NULL DEFAULT 'advisor',
            last_login     DATETIME,
            session_expiry DATETIME
        );

        CREATE TABLE IF NOT EXISTS Students (
            student_id       INTEGER PRIMARY KEY AUTOINCREMENT,
            enrolment_number TEXT    NOT NULL UNIQUE,
            programme        TEXT    NOT NULL,
            level            TEXT    NOT NULL,
            enrolment_date   DATE    NOT NULL,
            status           TEXT    NOT NULL DEFAULT 'active'
        );

        CREATE TABLE IF NOT EXISTS BehaviouralIndicators (
            indicator_id          INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id            INTEGER NOT NULL REFERENCES Students(student_id),
            recorded_date         DATE    NOT NULL,
            login_frequency       REAL,
            submission_rate       REAL,
            resource_access_count REAL,
            assessment_score      REAL
        );

        CREATE TABLE IF NOT EXISTS Predictions (
            prediction_id       INTEGER  PRIMARY KEY AUTOINCREMENT,
            student_id          INTEGER  NOT NULL REFERENCES Students(student_id),
            reviewed_by         INTEGER  REFERENCES Users(user_id),
            prediction_date     DATETIME DEFAULT (datetime('now')),
            risk_category       TEXT     NOT NULL,
            risk_score          REAL     NOT NULL,
            shap_contributions  TEXT,
            dominant_indicator  TEXT,
            recommendation_text TEXT,
            model_version       TEXT     NOT NULL
        );
    """)
    conn.commit()
    conn.close()
    print("✅ Database initialised successfully")

if __name__ == "__main__":
    init_db()