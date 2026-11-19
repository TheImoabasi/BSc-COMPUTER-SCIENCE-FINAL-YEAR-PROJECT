import sqlite3
import bcrypt
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database import get_connection, DB_PATH

def seed():
    conn = get_connection()

    # Hash the password
    password      = "miva2025"
    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        conn.execute("""
            INSERT INTO Users (full_name, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        """, (
            "Admin Advisor",
            "advisor@miva.edu.ng",
            password_hash,
            "advisor"
        ))
        conn.commit()
        print("✅ Advisor account created")
        print("   Email:    advisor@miva.edu.ng")
        print("   Password: miva2025")
    except sqlite3.IntegrityError:
        print("⚠️  Advisor account already exists")

    conn.close()

if __name__ == "__main__":
    seed()