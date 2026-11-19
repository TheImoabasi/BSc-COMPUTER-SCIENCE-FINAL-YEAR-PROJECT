import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt
import matplotlib
import os

matplotlib.use("Agg")  # non-interactive backend for saving files

# ── Load artifacts ─────────────────────────────────────────
model        = joblib.load("ml/models/risk_model.pkl")
scaler       = joblib.load("ml/models/scaler.pkl")
feature_cols = joblib.load("ml/models/feature_cols.pkl")
explainer    = shap.TreeExplainer(model)

# ── Load and prepare data ──────────────────────────────────
df = pd.read_csv("data/processed/student_features.csv").fillna(0)
X  = df[feature_cols].head(200)  # use 200 students for plots
X_scaled = pd.DataFrame(scaler.transform(X), columns=feature_cols)

# Create output folder
os.makedirs("data/shap_plots", exist_ok=True)

# ── Compute SHAP values ────────────────────────────────────
print("🔄 Computing SHAP values...")
shap_values = explainer.shap_values(X_scaled)

# For binary classification get at-risk class values
if isinstance(shap_values, list):
    sv = shap_values[1]
else:
    sv = shap_values[:, :, 1]

print("✅ SHAP values computed")

# ── Plot 1: Summary Beeswarm ───────────────────────────────
print("🔄 Generating summary plot...")
plt.figure(figsize=(10, 6))
shap.summary_plot(
    sv, X_scaled,
    feature_names=feature_cols,
    show=False
)
plt.title("SHAP Summary Plot — Feature Impact on At-Risk Prediction",
          fontsize=13, fontweight="bold", pad=15)
plt.tight_layout()
plt.savefig("data/shap_plots/shap_summary.png", dpi=150, bbox_inches="tight")
plt.close()
print("✅ Saved shap_summary.png")

# ── Plot 2: Feature Importance Bar ────────────────────────
print("🔄 Generating feature importance plot...")
plt.figure(figsize=(10, 5))
shap.summary_plot(
    sv, X_scaled,
    feature_names=feature_cols,
    plot_type="bar",
    show=False
)
plt.title("Mean Absolute SHAP Values — Global Feature Importance",
          fontsize=13, fontweight="bold", pad=15)
plt.tight_layout()
plt.savefig("data/shap_plots/shap_importance.png", dpi=150, bbox_inches="tight")
plt.close()
print("✅ Saved shap_importance.png")

# ── Plot 3: Waterfall for highest risk student ─────────────
print("🔄 Generating waterfall plot...")
risk_scores = model.predict_proba(X_scaled)[:, 1]
highest_idx = np.argmax(risk_scores)

# Handle both list and array forms of expected_value
ev = explainer.expected_value
if isinstance(ev, (list, np.ndarray)):
    base_value = ev[1] if len(np.atleast_1d(ev)) > 1 else ev[0]
else:
    base_value = ev

explanation = shap.Explanation(
    values=sv[highest_idx],
    base_values=float(base_value),   # force to plain Python float
    data=X_scaled.iloc[highest_idx].values,
    feature_names=feature_cols
)

plt.figure(figsize=(10, 6))
shap.waterfall_plot(explanation, show=False)
plt.title(f"SHAP Waterfall — Highest Risk Student (score: {risk_scores[highest_idx]:.3f})",
          fontsize=12, fontweight="bold", pad=15)
plt.tight_layout()
plt.savefig("data/shap_plots/shap_waterfall.png", dpi=150, bbox_inches="tight")
plt.close()
print("✅ Saved shap_waterfall.png")

# ── Plot 4: Dependence plot (top feature) ─────────────────
print("🔄 Generating dependence plot...")
plt.figure(figsize=(10, 5))
shap.dependence_plot(
    "days_since_active",
    sv, X_scaled,
    feature_names=feature_cols,
    show=False
)
plt.title("SHAP Dependence — Days Since Active vs Risk Contribution",
          fontsize=12, fontweight="bold", pad=15)
plt.tight_layout()
plt.savefig("data/shap_plots/shap_dependence.png", dpi=150, bbox_inches="tight")
plt.close()
print("✅ Saved shap_dependence.png")

print("\n✅ All SHAP plots saved to data/shap_plots/")
