import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// ── THEMES ─────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#080a0f",
  surface: "#0f1117",
  border: "#1e2230",
  altRow: "#080a0f",
  rowHover: "#1e223088",
  text: "#f1f5f9",
  textSub: "#9ca3af",
  textMuted: "#6b7280",
  inputBg: "#0f1117",
  toggleBg: "#1e2230",
  toggleText: "#9ca3af",
};
const LIGHT = {
  bg: "#f1f5fb",
  surface: "#ffffff",
  border: "#e2e8f0",
  altRow: "#f8fafc",
  rowHover: "#e2e8f088",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#64748b",
  inputBg: "#ffffff",
  toggleBg: "#e2e8f0",
  toggleText: "#475569",
};

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: "STU-001",
    name: "Adaeze Okonkwo",
    program: "Computer Science",
    cohort: "2023A",
    logins: 3,
    session: 12,
    daysSince: 14,
    submissions: 0.3,
    lateRate: 0.6,
    score: 38,
    videoCompletion: 22,
    posts: 0,
    riskScore: 0.87,
    risk: "high",
  },
  {
    id: "STU-002",
    name: "Emeka Nwachukwu",
    program: "Business Admin",
    cohort: "2023A",
    logins: 2,
    session: 8,
    daysSince: 21,
    submissions: 0.2,
    lateRate: 0.8,
    score: 31,
    videoCompletion: 15,
    posts: 0,
    riskScore: 0.91,
    risk: "high",
  },
  {
    id: "STU-003",
    name: "Fatima Al-Hassan",
    program: "Accounting",
    cohort: "2023B",
    logins: 5,
    session: 25,
    daysSince: 9,
    submissions: 0.5,
    lateRate: 0.4,
    score: 52,
    videoCompletion: 48,
    posts: 1,
    riskScore: 0.64,
    risk: "medium",
  },
  {
    id: "STU-004",
    name: "Chidi Obi",
    program: "Computer Science",
    cohort: "2023A",
    logins: 18,
    session: 45,
    daysSince: 1,
    submissions: 0.9,
    lateRate: 0.1,
    score: 82,
    videoCompletion: 91,
    posts: 8,
    riskScore: 0.08,
    risk: "low",
  },
  {
    id: "STU-005",
    name: "Ngozi Eze",
    program: "Mass Communication",
    cohort: "2023B",
    logins: 7,
    session: 30,
    daysSince: 4,
    submissions: 0.7,
    lateRate: 0.2,
    score: 71,
    videoCompletion: 74,
    posts: 5,
    riskScore: 0.19,
    risk: "low",
  },
  {
    id: "STU-006",
    name: "Babatunde Lawal",
    program: "Business Admin",
    cohort: "2023A",
    logins: 4,
    session: 18,
    daysSince: 11,
    submissions: 0.4,
    lateRate: 0.5,
    score: 45,
    videoCompletion: 38,
    posts: 1,
    riskScore: 0.72,
    risk: "high",
  },
  {
    id: "STU-007",
    name: "Amina Yusuf",
    program: "Accounting",
    cohort: "2023C",
    logins: 12,
    session: 38,
    daysSince: 2,
    submissions: 0.8,
    lateRate: 0.1,
    score: 77,
    videoCompletion: 85,
    posts: 6,
    riskScore: 0.14,
    risk: "low",
  },
  {
    id: "STU-008",
    name: "Oluwaseun Adeyemi",
    program: "Computer Science",
    cohort: "2023B",
    logins: 6,
    session: 22,
    daysSince: 6,
    submissions: 0.55,
    lateRate: 0.35,
    score: 58,
    videoCompletion: 55,
    posts: 2,
    riskScore: 0.49,
    risk: "medium",
  },
  {
    id: "STU-009",
    name: "Kelechi Nnaji",
    program: "Mass Communication",
    cohort: "2023C",
    logins: 1,
    session: 5,
    daysSince: 28,
    submissions: 0.1,
    lateRate: 0.9,
    score: 22,
    videoCompletion: 8,
    posts: 0,
    riskScore: 0.95,
    risk: "high",
  },
  {
    id: "STU-010",
    name: "Zainab Musa",
    program: "Business Admin",
    cohort: "2023A",
    logins: 15,
    session: 42,
    daysSince: 1,
    submissions: 0.95,
    lateRate: 0.05,
    score: 88,
    videoCompletion: 94,
    posts: 9,
    riskScore: 0.05,
    risk: "low",
  },
  {
    id: "STU-011",
    name: "Ifeanyi Okeke",
    program: "Accounting",
    cohort: "2023B",
    logins: 4,
    session: 15,
    daysSince: 10,
    submissions: 0.45,
    lateRate: 0.45,
    score: 49,
    videoCompletion: 40,
    posts: 1,
    riskScore: 0.68,
    risk: "medium",
  },
  {
    id: "STU-012",
    name: "Halima Abdullahi",
    program: "Computer Science",
    cohort: "2023C",
    logins: 11,
    session: 35,
    daysSince: 2,
    submissions: 0.85,
    lateRate: 0.1,
    score: 79,
    videoCompletion: 88,
    posts: 7,
    riskScore: 0.11,
    risk: "low",
  },
  {
    id: "STU-013",
    name: "Tunde Fasanya",
    program: "Mass Communication",
    cohort: "2023A",
    logins: 3,
    session: 10,
    daysSince: 16,
    submissions: 0.25,
    lateRate: 0.7,
    score: 35,
    videoCompletion: 20,
    posts: 0,
    riskScore: 0.83,
    risk: "high",
  },
  {
    id: "STU-014",
    name: "Uchenna Okafor",
    program: "Business Admin",
    cohort: "2023B",
    logins: 8,
    session: 28,
    daysSince: 5,
    submissions: 0.65,
    lateRate: 0.25,
    score: 63,
    videoCompletion: 62,
    posts: 3,
    riskScore: 0.32,
    risk: "low",
  },
  {
    id: "STU-015",
    name: "Blessing Nwosu",
    program: "Accounting",
    cohort: "2023C",
    logins: 5,
    session: 20,
    daysSince: 8,
    submissions: 0.5,
    lateRate: 0.4,
    score: 54,
    videoCompletion: 50,
    posts: 2,
    riskScore: 0.55,
    risk: "medium",
  },
];

// ── SHAP-STYLE FEATURE IMPACT ───────────────────────────────────────────────
// Mirrors what shap.TreeExplainer(model).shap_values(X) would return per student:
// each feature gets a signed contribution toward the "at-risk" class.
// Positive = pushes risk score UP. Negative = pushes risk score DOWN.
const SHAP_FEATURE_META = {
  daysSince: {
    label: "Days Since Login",
    icon: "⚠️",
    baseline: 4,
    direction: 1,
  }, // higher = more risk
  submissions: {
    label: "Submission Rate",
    icon: "📋",
    baseline: 0.7,
    direction: -1,
  }, // lower = more risk
  videoCompletion: {
    label: "Video Completion",
    icon: "🎬",
    baseline: 65,
    direction: -1,
  },
  posts: { label: "Forum Posts", icon: "💬", baseline: 4, direction: -1 },
  lateRate: {
    label: "Late Submission Rate",
    icon: "🕐",
    baseline: 0.25,
    direction: 1,
  },
  score: { label: "Average Score", icon: "📉", baseline: 60, direction: -1 },
};

function getShapImpacts(s) {
  const impacts = Object.entries(SHAP_FEATURE_META).map(([key, meta]) => {
    const val = s[key];
    // Normalised deviation from a "healthy" baseline, signed by risk direction
    const range = Math.max(Math.abs(meta.baseline), 1);
    const deviation = ((val - meta.baseline) / range) * meta.direction;
    const impact = Math.max(-0.4, Math.min(0.4, deviation * 0.22)); // clamp like real SHAP magnitudes
    return {
      feature: key,
      label: meta.label,
      icon: meta.icon,
      value: val,
      impact,
    };
  });
  return impacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

function getRecsFromShap(impacts) {
  const MSG = {
    daysSince:
      "Inactivity is the strongest driver of this student's risk score. Academic advisor notified.",
    submissions:
      "Low assignment submission rate is significantly increasing risk. Review pending work.",
    videoCompletion:
      "Low video engagement is contributing to risk. Recommend shorter study sessions.",
    posts:
      "Low forum participation is contributing to risk. Encourage peer discussion.",
    lateRate:
      "Frequent late submissions are increasing risk. Recommend a personal deadline plan.",
    score:
      "Low average score is a major contributor to risk. Tutoring support recommended.",
  };
  return impacts
    .filter((f) => f.impact > 0.03) // only features pushing risk UP
    .slice(0, 4)
    .map((f) => ({
      icon: f.icon,
      text: MSG[f.feature],
      priority: f.impact > 0.12 ? "high" : f.impact > 0.06 ? "medium" : "low",
      impact: f.impact,
    }));
}

const TREND_DATA = [
  { week: "Wk 1", high: 195, medium: 11 },
  { week: "Wk 2", high: 208, medium: 12 },
  { week: "Wk 3", high: 219, medium: 13 },
  { week: "Wk 4", high: 230, medium: 13 },
];

const FACTOR_DATA = [
  { factor: "Inactivity", weight: 0.3483 },
  { factor: "Submissions", weight: 0.1825 },
  { factor: "Average Score", weight: 0.1367 },
  { factor: "Active Days", weight: 0.1014 },
  { factor: "Resource Access", weight: 0.0903 },
  { factor: "Total Clicks", weight: 0.0636 },
  { factor: "Clicks per Day", weight: 0.0552 },
  { factor: "Late Submissions", weight: 0.016 },
  { factor: "Previous Attempts", weight: 0.0059 },
];

// ── LOGIN PAGE ─────────────────────────────────────────────
function LoginPage({ onLogin, t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);

    fetch("http://127.0.0.1:8000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          // Save session to localStorage
          localStorage.setItem("session_expiry", data.session_expiry);
          localStorage.setItem("full_name", data.full_name);
          localStorage.setItem("role", data.role);
          onLogin(data);
        } else {
          setError(data.detail || "Login failed");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Cannot connect to server. Make sure the backend is running.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: "48px 40px",
          width: 400,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#6b7280",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Miva Open University
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: t.text,
              letterSpacing: -0.5,
            }}
          >
            Learnerlytics
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>
            Student Risk Identification System
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: "#ff475715",
              border: "1px solid #ff475744",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              color: "#ff4757",
              fontSize: 12,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              color: t.textMuted,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              display: "block",
              marginBottom: 6,
            }}
          >
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@miva.edu.ng"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              background: t.inputBg,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              color: t.text,
              padding: "11px 14px",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              color: t.textMuted,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              display: "block",
              marginBottom: 6,
            }}
          >
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              background: t.inputBg,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              color: t.text,
              padding: "11px 14px",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          style={{
            width: "100%",
            padding: "12px",
            background: loading || !email || !password ? "#1e2230" : "#60a5fa",
            color: loading || !email || !password ? "#6b7280" : "#ffffff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            color: t.textMuted,
            fontSize: 11,
          }}
        >
          Access restricted to authorised academic staff only
        </div>
      </div>
    </div>
  );
}

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────

function RiskBadge({ risk, score }) {
  const cfg = {
    high: { bg: "#ff475720", border: "#ff4757", text: "#ff4757" },
    medium: { bg: "#ffa50220", border: "#ffa502", text: "#ffa502" },
    low: { bg: "#2ed57320", border: "#2ed573", text: "#2ed573" },
  }[risk];
  return (
    <span
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontFamily: "monospace",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {risk} · {(score * 100).toFixed(0)}%
    </span>
  );
}

function KPICard({ label, value, sub, accent, t }) {
  return (
    <div className="kpi-card"
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          color: t.textMuted,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: t.text,
          fontSize: 34,
          fontWeight: 800,
          fontFamily: "'DM Mono',monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ color: accent, fontSize: 12, marginTop: 6 }}>{sub}</div>
      )}
    </div>
  );
}

function Sidebar({ page, setPage, dark, onToggle, t, user, onLogout, isOpen }) {
  const items = [
    { id: "dashboard", icon: "▦", label: "Overview" },
    { id: "students", icon: "🧑‍🎓", label: "Students" },
    { id: "alerts", icon: "🔔", label: "Alerts" },
    { id: "model", icon: "◎", label: "Model Info" },
  ];
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}
      style={{
        width: 220,
        height: "100vh",
        background: "#0d1117",
        borderRight: "1px solid #1e2230",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1e2230" }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 3,
            color: "#6b7280",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Miva Open University
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: -0.5,
          }}
        >
          Learnerlytics
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "11px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              marginBottom: 4,
              textAlign: "left",
              background: page === item.id ? "#1e2230" : "transparent",
              color: page === item.id ? "#f1f5f9" : "#6b7280",
              fontSize: 13,
              fontWeight: page === item.id ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: page === item.id ? "#60a5fa" : "#6b7280",
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2230" }}>
        {/* Theme toggle */}
        <button
          onClick={onToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: dark ? "#1e2230" : "#334155",
            border: "none",
            borderRadius: 20,
            padding: "7px 14px",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 15 }}>{dark ? "🌙" : "☀️"}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: dark ? "#9ca3af" : "#cbd5e1",
              letterSpacing: 1,
            }}
          >
            {dark ? "DARK MODE" : "LIGHT MODE"}
          </span>
        </button>

        {/* Logged in user */}
        {user && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>
              Signed in as
            </div>
            <div style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 600 }}>
              {user.full_name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#6b7280",
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </div>
          </div>
        )}

        {/* Sign out button */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "7px 14px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #ff475744",
              color: "#ff4757",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 10,
              letterSpacing: 0.5,
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

// ── PAGE: DASHBOARD ────────────────────────────────────────────────────────
function DashboardPage({ t }) {
  const [summary, setSummary] = useState({
    total_predictions: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });

  const [trendData, setTrendData] = useState(TREND_DATA); // fallback to hardcoded
  const [factorData, setFactorData] = useState(FACTOR_DATA); // fallback to hardcoded

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/dashboard")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});

    fetch("http://127.0.0.1:8000/api/v1/trend")
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) setTrendData(data);
      })
      .catch(() => {});

    fetch("http://127.0.0.1:8000/api/v1/factors")
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) setFactorData(data);
      })
      .catch(() => {});
  }, []);

  // ── Build pie data from real numbers ──────────────
  const pieData = [
    { name: "High Risk", value: summary.high_risk, color: "#ff4757" },
    { name: "Medium Risk", value: summary.medium_risk, color: "#ffa502" },
    { name: "Low Risk", value: summary.low_risk, color: "#2ed573" },
  ];

  const tip = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    color: t.text,
    fontSize: 12,
  };
  return (
    <div className="page-padding" style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            color: t.text,
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          At-Risk Overview
        </h1>
        <p style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
          Real-time student risk classification · Last updated today
        </p>
      </div>

      <div className="kpi-row"
        style={{
          gap: 16,
          marginBottom: 28,
        }}
      >
        <KPICard className="kpi-card"
          label="Total Students"
          value={summary.total_predictions}
          sub="From OULAD dataset"
          accent="#60a5fa"
          t={t}
        />
        <KPICard className="kpi-card"
          label="High Risk"
          value={summary.high_risk}
          sub="Immediate attention"
          accent="#ff4757"
          t={t}
        />
        <KPICard className="kpi-card"
          label="Medium Risk"
          value={summary.medium_risk}
          sub="Monitor closely"
          accent="#ffa502"
          t={t}
        />
        <KPICard className="kpi-card"
          label="Low Risk"
          value={summary.low_risk}
          sub="On track"
          accent="#2ed573"
          t={t}
        />
      </div>

      <div className="charts-row" style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        {/* Pie */}
        <div className="chart-pie"
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: 24,
            flex: 1,
          }}
        >
          <div style={{ color: t.text, fontWeight: 700, marginBottom: 4 }}>
            Risk Distribution
          </div>
          <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 16 }}>
            All enrolled students
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={3}
              >
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div style={{ ...tip, padding: "10px 14px" }}>
                      <div
                        style={{
                          color: d.payload.color,
                          fontWeight: 700,
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {d.name}
                      </div>
                      <div style={{ color: t.text, fontSize: 12 }}>
                        {d.value} students
                      </div>
                      <div
                        style={{
                          color: t.textMuted,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {summary.total_predictions > 0
                          ? (
                              (d.value / summary.total_predictions) *
                              100
                            ).toFixed(1)
                          : 0}
                        % of total
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {pieData.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: t.textSub,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: d.color,
                  }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Line */}
        <div className="chart-line"
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: 24,
            flex: 2,
          }}
        >
          <div style={{ color: t.text, fontWeight: 700, marginBottom: 4 }}>
            Risk Trend · Last 4 Weeks
          </div>
          <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 16 }}>
            High and medium risk student count over time
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis
                dataKey="week"
                stroke={t.border}
                tick={{ fill: t.textMuted, fontSize: 11 }}
              />
              <YAxis
                stroke={t.border}
                tick={{ fill: t.textMuted, fontSize: 11 }}
              />
              <Tooltip contentStyle={tip} />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#ff4757"
                strokeWidth={2}
                dot={{ fill: "#ff4757", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="medium"
                stroke="#ffa502"
                strokeWidth={2}
                dot={{ fill: "#ffa502", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar */}
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ color: t.text, fontWeight: 700, marginBottom: 4 }}>
          Top Predictors of At-Risk Status
        </div>
        <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 16 }}>
          Feature importance from Random Forest model
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={factorData} layout="vertical">
            <XAxis
              type="number"
              stroke={t.border}
              tick={{ fill: t.textMuted, fontSize: 11 }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <YAxis
              type="category"
              dataKey="factor"
              stroke={t.border}
              tick={{ fill: t.textSub, fontSize: 12 }}
              width={90}
            />
            <Tooltip
              contentStyle={tip}
              formatter={(v) => [`${(v * 100).toFixed(0)}%`, "Importance"]}
            />
            <Bar dataKey="weight" fill="#60a5fa" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── PAGE: STUDENTS ─────────────────────────────────────────────────────────
function StudentsPage({ onSelect, t }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/students")
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((s) => ({
          id: s.enrolment_number,
          name: `Student ${s.enrolment_number}`,
          program: s.programme,
          cohort: s.level,
          status: s.status,
          riskScore: s.risk_score,
          risk: s.risk_category,
          dominantIndicator: s.dominant_indicator,
          recommendation: s.recommendation_text,
          shapContributions: JSON.parse(s.shap_contributions || "[]"),
          predictionDate: s.prediction_date,
          modelVersion: s.model_version,
          // SHAP fields mapped for StudentDetail compatibility
          daysSince: 0,
          logins: 0,
          session: 0,
          submissions: 0,
          lateRate: 0,
          score: 0,
          videoCompletion: 0,
          posts: 0,
        }));
        setStudents(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = students
    .filter(
      (s) =>
        (filter === "all" || s.risk === filter) &&
        (s.id.toLowerCase().includes(search.toLowerCase()) ||
          s.program.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  const FC = {
    all: "#60a5fa",
    high: "#ff4757",
    medium: "#ffa502",
    low: "#2ed573",
  };

  if (loading)
    return (
      <div className="page-padding" style={{ padding: "32px 36px", color: t.textMuted, fontSize: 14 }}>
        🔄 Loading student data from backend...
      </div>
    );

  return (
    <div className="page-padding" style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            color: t.text,
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Student Risk Board
        </h1>
        <p style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
          Click any student to view their full profile and recommendations
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or programme..."
          style={{
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            color: t.text,
            padding: "9px 14px",
            fontSize: 13,
            outline: "none",
            flex: 1,
          }}
        />
        {["all", "high", "medium", "low"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              border: `1px solid ${filter === f ? FC[f] : t.border}`,
              background: filter === f ? FC[f] + "22" : "transparent",
              color: filter === f ? FC[f] : t.textMuted,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: 0.5,
            }}
          >
            {f === "all"
              ? `All (${students.length})`
              : `${f} (${students.filter((s) => s.risk === f).length})`}
          </button>
        ))}
      </div>

      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {[
                  "Student ID",
                  "Programme",
                  "Level",
                  "Status",
                  "Risk Level",
                  "Dominant Factor",
                  "Last Predicted",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      color: t.textMuted,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: t.textMuted,
                    }}
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelect(s)}
                    style={{
                      borderBottom: `1px solid ${t.border}`,
                      cursor: "pointer",
                      background: i % 2 === 0 ? "transparent" : t.altRow,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = t.rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0 ? "transparent" : t.altRow)
                    }
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{ color: t.text, fontWeight: 600, fontSize: 13 }}
                      >
                        {s.id}
                      </div>
                      <div
                        style={{
                          color: t.textMuted,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {s.modelVersion}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: t.textSub,
                        fontSize: 13,
                      }}
                    >
                      {s.program}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: t.textSub,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.cohort}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 20,
                          background:
                            s.status === "active" ? "#2ed57322" : "#ff475722",
                          color: s.status === "active" ? "#2ed573" : "#ff4757",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <RiskBadge risk={s.risk} score={s.riskScore} />
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: t.textSub,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.dominantIndicator?.replace(/_/g, " ")}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: t.textMuted,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.predictionDate?.slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentDetail({ student, onBack, t }) {
  const PC = { high: "#ff4757", medium: "#ffa502", low: "#2ed573" };

  // Use real SHAP contributions from the API
  const shapData = student.shapContributions || [];
  const maxAbsImpact = Math.max(
    ...shapData.map((f) => Math.abs(f.impact)),
    0.01,
  );

  // Build recommendations from real SHAP values
  const FEATURE_MESSAGES = {
    days_since_active: {
      icon: "⚠️",
      text: "Inactivity is the strongest driver of risk. Academic advisor should make immediate contact.",
    },
    submission_rate: {
      icon: "📋",
      text: "Low assignment submission rate is significantly increasing risk. Review pending work.",
    },
    avg_score: {
      icon: "📉",
      text: "Low average score is a major contributor to risk. Tutoring support recommended.",
    },
    late_submission_rate: {
      icon: "🕐",
      text: "Frequent late submissions are increasing risk. Recommend a personal deadline plan.",
    },
    total_resource_access: {
      icon: "🎬",
      text: "Low resource engagement is contributing to risk. Encourage use of learning materials.",
    },
    active_days: {
      icon: "📅",
      text: "Very few active study days. Recommend a consistent study schedule.",
    },
    total_clicks: {
      icon: "🖱️",
      text: "Very low platform engagement. Check for technical or motivational barriers.",
    },
    avg_clicks_per_day: {
      icon: "📊",
      text: "Low daily activity. Encourage regular daily engagement with the LMS.",
    },
    num_of_prev_attempts: {
      icon: "🔄",
      text: "Multiple previous attempts at this course. Consider a dedicated support plan.",
    },
  };

  const recs = shapData
    .filter((f) => f.impact > 0.01)
    .slice(0, 4)
    .map((f) => ({
      feature: f.feature,
      icon: FEATURE_MESSAGES[f.feature]?.icon || "📌",
      text:
        FEATURE_MESSAGES[f.feature]?.text ||
        `${f.feature} is contributing to risk.`,
      priority: f.impact > 0.15 ? "high" : f.impact > 0.07 ? "medium" : "low",
      impact: f.impact,
    }));

  return (
    <div style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: `1px solid ${t.border}`,
          color: t.textSub,
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        ← Back to Students
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{ color: t.text, fontSize: 26, fontWeight: 800, margin: 0 }}
          >
            Student {student.id}
          </h1>
          <p style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
            {student.program} · {student.cohort} · {student.status}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <RiskBadge risk={student.risk} score={student.riskScore} />
          <div style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>
            Random Forest · {student.modelVersion}
          </div>
        </div>
      </div>

      <div className="detail-row" style={{gap: 20, marginBottom: 20 }}>
        {/* SHAP Feature Values */}
        <div className="detail-metrics" style={{ flex: 2 }}>
          <div
            style={{
              color: t.text,
              fontWeight: 700,
              marginBottom: 14,
              fontSize: 14,
            }}
          >
            Behavioural Indicators
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {shapData.map((f) => {
              const isRisk = f.impact > 0;
              return (
                <div
                  key={f.feature}
                  style={{
                    background: t.surface,
                    borderRadius: 10,
                    padding: "14px 16px",
                    border: `1px solid ${isRisk ? "#ff475733" : t.border}`,
                    borderLeft: `3px solid ${isRisk ? "#ff4757" : "#2ed573"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        color: isRisk ? "#ff4757" : t.textSub,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {FEATURE_MESSAGES[f.feature]?.icon || "📌"}{" "}
                      {f.feature.replace(/_/g, " ")}
                    </span>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span
                        style={{
                          color: t.textMuted,
                          fontSize: 12,
                          fontFamily: "monospace",
                        }}
                      >
                        value: {f.value}
                      </span>
                      <span
                        style={{
                          color: isRisk ? "#ff4757" : "#2ed573",
                          fontSize: 12,
                          fontFamily: "monospace",
                        }}
                      >
                        SHAP: {isRisk ? "+" : ""}
                        {f.impact.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar — normalised by max absolute impact */}
                  <div
                    style={{ height: 5, background: t.border, borderRadius: 3 }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        width: `${Math.min(100, (Math.abs(f.impact) / maxAbsImpact) * 100)}%`,
                        background: isRisk ? "#ff4757" : "#2ed573",
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SHAP Diverging Chart */}
        <div className="detail-metrics" style={{ flex: 1.5 }}>
          <div
            style={{
              color: t.text,
              fontWeight: 700,
              marginBottom: 2,
              fontSize: 14,
            }}
          >
            Risk Drivers (SHAP)
          </div>
          <div style={{ color: t.textMuted, fontSize: 11, marginBottom: 14 }}>
            How each feature pushed this prediction up or down
          </div>
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            {shapData.map((f) => {
              const widthPct = (Math.abs(f.impact) / maxAbsImpact) * 50;
              const isRisk = f.impact > 0;
              return (
                <div key={f.feature} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 11, color: t.textSub }}>
                      {FEATURE_MESSAGES[f.feature]?.icon || "📌"}{" "}
                      {f.feature.replace(/_/g, " ")}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: isRisk ? "#ff4757" : "#2ed573",
                      }}
                    >
                      {isRisk ? "+" : ""}
                      {f.impact.toFixed(3)}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      height: 8,
                      background: t.border,
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: t.textMuted,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        borderRadius: 4,
                        left: isRisk ? "50%" : `${50 - widthPct}%`,
                        width: `${widthPct}%`,
                        background: isRisk ? "#ff4757" : "#2ed573",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: t.textMuted,
                marginTop: 8,
                paddingTop: 10,
                borderTop: `1px solid ${t.border}`,
              }}
            >
              <span>← decreases risk</span>
              <span>increases risk →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div
          style={{
            color: t.text,
            fontWeight: 700,
            marginBottom: 14,
            fontSize: 14,
          }}
        >
          Recommendations
          <span
            style={{
              color: t.textMuted,
              fontWeight: 400,
              fontSize: 12,
              marginLeft: 8,
            }}
          >
            ({recs.length} active · derived from SHAP risk drivers)
          </span>
        </div>
        {recs.length === 0 ? (
          <div
            style={{
              background: t.surface,
              border: "1px solid #2ed57333",
              borderRadius: 10,
              padding: 20,
              color: "#2ed573",
              fontSize: 13,
            }}
          >
            ✅ No significant risk-increasing factors detected. Student is on
            track.
          </div>
        ) : (
          <div className="recs-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {recs.map((r, i) => (
              <div
                key={i}
                style={{
                  background: t.surface,
                  borderRadius: 10,
                  padding: "14px 16px",
                  border: `1px solid ${PC[r.priority]}33`,
                  borderLeft: `3px solid ${PC[r.priority]}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 16 }}>{r.icon}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: PC[r.priority],
                        textTransform: "uppercase",
                      }}
                    >
                      {r.priority} priority
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: t.textMuted,
                    }}
                  >
                    SHAP +{r.impact.toFixed(3)}
                  </span>
                </div>
                <div
                  style={{ color: t.textSub, fontSize: 12, lineHeight: 1.6 }}
                >
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PAGE: MODEL INFO ───────────────────────────────────────────────────────
// FALLBACK used while backend is offline / not yet built
const FALLBACK_META = {
  model_type: "Random Forest Classifier",
  n_train: 432,
  n_test: 108,
  accuracy: 0.873,
  precision: 0.841,
  recall: 0.896,
  f1_score: 0.868,
  n_features: 12,
  trained_at_formatted: "— (backend not connected)",
  _source: "fallback",
};

// ── PAGE: ALERTS ───────────────────────────────────────────
function AlertsPage({ t }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/alerts")
      .then((r) => r.json())
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = alerts.filter((a) =>
    filter === "all" ? true : a.risk_category === filter,
  );

  const PC = { high: "#ff4757", medium: "#ffa502" };
  const FC = { all: "#60a5fa", high: "#ff4757", medium: "#ffa502" };

  const FEATURE_ICONS = {
    days_since_active: "⚠️",
    submission_rate: "📋",
    avg_score: "📉",
    late_submission_rate: "🕐",
    total_resource_access: "🎬",
    active_days: "📅",
    total_clicks: "🖱️",
    avg_clicks_per_day: "📊",
    num_of_prev_attempts: "🔄",
  };

  if (loading)
    return (
      <div className="page-padding" style={{ padding: "32px 36px", color: t.textMuted, fontSize: 14 }}>
        🔄 Loading alerts...
      </div>
    );

  return (
    <div className="page-padding" style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            color: t.text,
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Alerts
        </h1>
        <p style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
          Students requiring immediate or close attention · {alerts.length}{" "}
          total alerts
        </p>
      </div>

      {/* Summary cards */}
      <div className="kpi-row" style={{ marginBottom:24 }}>
        {[
          { label: "Total Alerts", value: alerts.length, accent: "#60a5fa" },
          {
            label: "High Risk",
            value: alerts.filter((a) => a.risk_category === "high").length,
            accent: "#ff4757",
          },
          {
            label: "Medium Risk",
            value: alerts.filter((a) => a.risk_category === "medium").length,
            accent: "#ffa502",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderLeft: `3px solid ${card.accent}`,
              borderRadius: 12,
              padding: "16px 20px",
              flex: 1,
            }}
          >
            <div
              style={{
                color: t.textMuted,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                color: t.text,
                fontSize: 30,
                fontWeight: 800,
                fontFamily: "monospace",
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["all", "high", "medium"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              border: `1px solid ${filter === f ? FC[f] : t.border}`,
              background: filter === f ? FC[f] + "22" : "transparent",
              color: filter === f ? FC[f] : t.textMuted,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: 0.5,
            }}
          >
            {f === "all"
              ? `All (${alerts.length})`
              : `${f} (${alerts.filter((a) => a.risk_category === f).length})`}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 10,
              padding: 32,
              textAlign: "center",
              color: t.textMuted,
            }}
          >
            No alerts found
          </div>
        ) : (
          filtered.map((a, i) => (
            <div
              key={i}
              style={{
                background: t.surface,
                borderRadius: 12,
                padding: "18px 20px",
                border: `1px solid ${PC[a.risk_category]}33`,
                borderLeft: `4px solid ${PC[a.risk_category]}`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              {/* Left — student info */}
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: PC[a.risk_category],
                      textTransform: "uppercase",
                      background: PC[a.risk_category] + "22",
                      border: `1px solid ${PC[a.risk_category]}44`,
                      borderRadius: 20,
                      padding: "3px 10px",
                    }}
                  >
                    {a.risk_category} risk
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: t.textMuted,
                    }}
                  >
                    score: {a.risk_score?.toFixed(3)}
                  </span>
                </div>
                <div
                  style={{
                    color: t.text,
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Student {a.student_id}
                </div>
                <div
                  style={{ color: t.textSub, fontSize: 12, lineHeight: 1.6 }}
                >
                  {a.recommendation_text}
                </div>
              </div>

              {/* Right — dominant indicator + date */}
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: t.textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Dominant Factor
                  </div>
                  <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>
                    {FEATURE_ICONS[a.dominant_indicator] || "📌"}{" "}
                    {a.dominant_indicator?.replace(/_/g, " ")}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: t.textMuted }}>
                  {a.prediction_date?.slice(0, 10)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ModelPage({ t }) {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Attempt to reach the real FastAPI backend
    fetch("http://localhost:8000/api/v1/model/info", {
      signal: AbortSignal.timeout(3000),
    })
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((data) => {
        setMeta(data);
        setLoading(false);
      })
      .catch(() => {
        // Backend offline — use fallback so the UI still works
        setMeta(FALLBACK_META);
        setError(true);
        setLoading(false);
      });
  }, []);

  const fmt = (val, decimals = 1) =>
    val !== undefined ? `${(val * 100).toFixed(decimals)}%` : "—";

  const metrics = meta
    ? [
        { label: "Model Type", value: meta.model_type },
        {
          label: "Training Samples",
          value: meta.n_train ? `${meta.n_train} students (80%)` : "—",
        },
        {
          label: "Test Samples",
          value: meta.n_test ? `${meta.n_test} students (20%)` : "—",
        },
        { label: "Overall Accuracy", value: fmt(meta.accuracy), hi: true },
        {
          label: "Precision (High Risk)",
          value: fmt(meta.precision),
          hi: true,
        },
        { label: "Recall (High Risk)", value: fmt(meta.recall), hi: true },
        {
          label: "F1 Score",
          value: meta.f1_score?.toFixed(3) ?? "—",
          hi: true,
        },
        {
          label: "Features Used",
          value: meta.n_features
            ? `${meta.n_features} behavioural features`
            : "—",
        },
        { label: "Training Date", value: meta.trained_at_formatted ?? "—" },
      ]
    : [];
  return (
    <div className="page-pad" style={{ flex:1, overflowY:"auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            color: t.text,
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Model Information
        </h1>
        <p style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
          Machine learning model details and performance metrics
        </p>
      </div>

      {/* Backend status banner */}
      {!loading && (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: error ? "#ffa50215" : "#2ed57315",
            border: `1px solid ${error ? "#ffa50244" : "#2ed57344"}`,
            color: error ? "#ffa502" : "#2ed573",
          }}
        >
          <span>{error ? "⚠️" : "✅"}</span>
          {error
            ? "Backend offline — showing fallback data. Connect FastAPI on localhost:8000 to see live metrics."
            : "Live data — connected to backend."}
        </div>
      )}

      <div className="detail-row" style={{gap: 20 }}>
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: 24,
            flex: 1,
          }}
        >
          <div
            style={{
              color: "#60a5fa",
              fontWeight: 700,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            Model Performance
          </div>

          {loading
            ? // Skeleton loader while fetching
              Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <div
                    style={{
                      height: 13,
                      width: `${100 + Math.random() * 80}px`,
                      background: t.border,
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      height: 13,
                      width: 60,
                      background: t.border,
                      borderRadius: 4,
                    }}
                  />
                </div>
              ))
            : metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <span style={{ color: t.textSub, fontSize: 13 }}>
                    {m.label}
                  </span>
                  <span
                    style={{
                      color: m.hi ? "#2ed573" : t.text,
                      fontFamily: "monospace",
                      fontSize: 13,
                      fontWeight: m.hi ? 700 : 400,
                    }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                color: "#60a5fa",
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              Risk Thresholds
            </div>
            {[
              {
                label: "High Risk",
                range: "≥ 70% probability",
                color: "#ff4757",
                desc: "Immediate intervention",
              },
              {
                label: "Medium Risk",
                range: "40–69% probability",
                color: "#ffa502",
                desc: "Monitor closely",
              },
              {
                label: "Low Risk",
                range: "< 40% probability",
                color: "#2ed573",
                desc: "On track",
              },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: r.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{ color: r.color, fontSize: 12, fontWeight: 700 }}
                  >
                    {r.label} · {r.range}
                  </div>
                  <div style={{ color: t.textMuted, fontSize: 11 }}>
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                color: "#60a5fa",
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              Explainability
            </div>
            <div style={{ color: t.textSub, fontSize: 12, lineHeight: 1.7 }}>
              Per-student predictions are explained using{" "}
              <strong style={{ color: t.text }}>SHAP</strong> (SHapley Additive
              exPlanations) via{" "}
              <code style={{ color: "#60a5fa", fontFamily: "monospace" }}>
                shap.TreeExplainer
              </code>
              . Each feature's contribution to a student's risk score is
              computed individually, and recommendations are generated only from
              the factors that most increase that specific student's risk —
              rather than fixed rules applied to everyone.
            </div>
          </div>
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                color: "#60a5fa",
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              Data Sources
            </div>
            {[
              "Login & session logs",
              "Assignment submissions",
              "Video interaction logs",
              "Forum participation",
              "Grade records",
            ].map((s) => (
              <div
                key={s}
                style={{
                  color: t.textSub,
                  fontSize: 12,
                  padding: "7px 0",
                  borderBottom: `1px solid ${t.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "#60a5fa" }}>◈</span> {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [student, setStudent] = useState(null);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = dark ? DARK : LIGHT;

  // Check existing session on page load
  useEffect(() => {
    const expiry = localStorage.getItem("session_expiry");
    const fullName = localStorage.getItem("full_name");
    const role = localStorage.getItem("role");

    if (expiry && fullName && role) {
      const expiryDate = new Date(expiry);
      const now = new Date();
      if (now < expiryDate) {
        // Session still valid
        setUser({ full_name: fullName, role });
      } else {
        // Session expired — clear everything
        localStorage.removeItem("session_expiry");
        localStorage.removeItem("full_name");
        localStorage.removeItem("role");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("session_expiry");
    localStorage.removeItem("full_name");
    localStorage.removeItem("role");
    setUser(null);
    setPage("dashboard");
  };

  const nav = (p) => {
    setStudent(null);
    setPage(p);
  };

  // ── Show login if not authenticated ───────────────────
  if (!user)
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
          html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
        * { box-sizing:border-box; }
        input::placeholder { color:#6b7280; }
      `}</style>
        <LoginPage onLogin={handleLogin} t={t} />
      </div>
    );

  // ── Show main dashboard if authenticated ───────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: t.bg,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        color: t.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
          html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#ffffff; border-radius:2px; }
        input::placeholder { color:#6b7280; }

        /* ── SIDEBAR ─────────────────────────── */
  .sidebar { width:220px; flex-shrink:0; transition: width 0.2s; }

  /* ── KPI ROW ─────────────────────────── */
.kpi-row { display:flex; flex-direction:row; gap:16px; margin-bottom:28px; }
.kpi-row > * { flex:1; min-width:0; }

  /* ── CHARTS ROW ──────────────────────── */
  .charts-row { display:flex; flex-direction:row; gap:20px; margin-bottom:24px; }
  .chart-pie  { flex:1; }
  .chart-line { flex:2; }

  /* ── DETAIL ROW ──────────────────────── */
  .detail-row { display:flex; flex-direction:row; gap:20px; margin-bottom:20px; }
  .detail-metrics { flex:2; }
  .detail-shap    { flex:1.5; }

  /* ── RECS GRID ───────────────────────── */
  .recs-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

  /* ── PAGE PADDING ────────────────────── */
  .page-pad { padding:32px 36px; flex:1; overflow-y:auto; }

  /* ── HAMBURGER ───────────────────────── */
  .hamburger {
    display:none; position:fixed; top:16px; left:16px;
    z-index:1000; background:#1e2230; border:none;
    border-radius:8px; padding:8px 12px; cursor:pointer;
    font-size:20px; color:#f1f5f9;
  }
  .sidebar-overlay {
    display:none; position:fixed; inset:0;
    background:rgba(0,0,0,0.5); z-index:998;
  }

  /* ── TABLET (768px – 1024px) ─────────── */
  @media (max-width: 1024px) {
    .sidebar   { width:180px; }
    .kpi-row   { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .charts-row{ flex-direction:column; }
    .detail-row{ flex-direction:column; }
    .page-pad  { padding:24px 20px; }
    .kpi-row > * { min-width:0; }
  }

  /* ── MOBILE (< 768px) ────────────────── */
  @media (max-width: 768px) {
    .sidebar {
      position:fixed; left:-220px; top:0;
      height:100vh; width:220px; z-index:999;
      transition:left 0.25s ease;
    }
    .sidebar.open       { left:0; }
    .sidebar-overlay    { display:block; }
    .hamburger          { display:block; }
    .kpi-row            { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding: 0 14px; }
    .charts-row         { flex-direction:column; gap:14px; }
    .detail-row         { flex-direction:column; }
    .recs-grid          { grid-template-columns:1fr !important; }
    .page-pad           { padding:16px 14px; }
    h1                  { font-size:20px !important; }
  }

  /* ── SMALL MOBILE (< 480px) ──────────── */
  @media (max-width: 480px) {
    .kpi-row { grid-template-columns:1fr; }
  }
`}</style>

{/* Hamburger — only visible on mobile */}
<button
  className="hamburger"
  onClick={() => setSidebarOpen(o => !o)}
>
  {sidebarOpen ? "✕" : "☰"}
</button>

{/* Overlay — closes sidebar when tapping outside on mobile */}
{sidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}

<Sidebar
  page={page==="detail" ? "students" : page}
  setPage={p => { nav(p); setSidebarOpen(false); }}
  dark={dark}
  onToggle={() => setDark(d => !d)}
  t={t}
  user={user}
  onLogout={handleLogout}
  isOpen={sidebarOpen}
/>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {page === "dashboard" && <DashboardPage t={t} />}
        {page === "students" && (
          <StudentsPage
            t={t}
            onSelect={(s) => {
              setStudent(s);
              setPage("detail");
            }}
          />
        )}
        {page === "detail" && student && (
          <StudentDetail
            student={student}
            onBack={() => {
              setStudent(null);
              setPage("students");
            }}
            t={t}
          />
        )}
        {page === "alerts" && <AlertsPage t={t} />}
        {page === "model" && <ModelPage t={t} />}
      </main>
    </div>
  );
}
