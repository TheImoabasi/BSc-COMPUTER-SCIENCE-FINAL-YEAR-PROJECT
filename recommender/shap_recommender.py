# ── INTERVENTION MESSAGES ─────────────────────────────────
# Mapped to each behavioural feature
# Triggered only when that feature is the dominant SHAP driver

FEATURE_MESSAGES = {
    "days_since_active": {
        "icon":    "⚠️",
        "message": "Student has been inactive for an extended period. "
                   "Academic advisor should make immediate contact.",
        "action":  "Contact student directly"
    },
    "submission_rate": {
        "icon":    "📋",
        "message": "Student has a low assignment submission rate. "
                   "Review pending assignments and discuss barriers to submission.",
        "action":  "Review pending assignments"
    },
    "avg_score": {
        "icon":    "📉",
        "message": "Student's average assessment score is significantly below "
                   "the pass threshold. Tutoring or academic support is recommended.",
        "action":  "Refer to academic support"
    },
    "late_submission_rate": {
        "icon":    "🕐",
        "message": "Student is consistently submitting assignments late. "
                   "Discuss time management strategies and personal deadlines.",
        "action":  "Schedule time management session"
    },
    "total_resource_access": {
        "icon":    "🎬",
        "message": "Student is accessing very few course resources. "
                   "Encourage engagement with learning materials.",
        "action":  "Encourage resource engagement"
    },
    "active_days": {
        "icon":    "📅",
        "message": "Student has very few active study days. "
                   "Recommend a consistent study schedule.",
        "action":  "Recommend a study schedule"
    },
    "total_clicks": {
        "icon":    "🖱️",
        "message": "Student has very low overall platform engagement. "
                   "Check for technical difficulties or motivational barriers.",
        "action":  "Check engagement barriers"
    },
    "avg_clicks_per_day": {
        "icon":    "📊",
        "message": "Student's daily platform activity is very low. "
                   "Encourage regular daily engagement with the LMS.",
        "action":  "Encourage daily login habit"
    },
    "num_of_prev_attempts": {
        "icon":    "🔄",
        "message": "Student has multiple previous attempts at this course. "
                   "Consider a dedicated support plan to address recurring challenges with the course.",
        "action":  "Create a dedicated support plan"
    },
}

def get_priority(impact: float) -> str:
    if impact >= 0.15:
        return "high"
    elif impact >= 0.07:
        return "medium"
    else:
        return "low"

def generate_shap_recommendations(feature_impact: list, top_n: int = 4) -> list:
    """
    Takes SHAP feature impact list from predict_with_explanation()
    Returns recommendations only for features pushing risk UP
    ordered by impact magnitude
    """
    recommendations = []

    # Only features with positive SHAP impact (pushing risk up)
    risk_drivers = [f for f in feature_impact if f["impact"] > 0.01]

    for driver in risk_drivers[:top_n]:
        feature = driver["feature"]
        impact  = driver["impact"]

        if feature not in FEATURE_MESSAGES:
            continue

        msg = FEATURE_MESSAGES[feature]
        recommendations.append({
            "feature":  feature,
            "icon":     msg["icon"],
            "message":  msg["message"],
            "action":   msg["action"],
            "priority": get_priority(impact),
            "impact":   round(impact, 4)
        })

    return recommendations


if __name__ == "__main__":
    # Test with sample SHAP output
    sample_impact = [
        {"feature": "avg_score",           "value": 38.0, "impact":  0.2170},
        {"feature": "days_since_active",   "value": 14,   "impact": -0.1778},
        {"feature": "late_submission_rate","value": 0.6,  "impact":  0.0750},
        {"feature": "submission_rate",     "value": 0.3,  "impact": -0.0611},
        {"feature": "active_days",         "value": 8,    "impact": -0.0331},
    ]

    recs = generate_shap_recommendations(sample_impact)

    print("\n── Recommendations ────────────────────────────")
    for r in recs:
        print(f"\n   {r['icon']} [{r['priority'].upper()}] {r['feature']}")
        print(f"      {r['message']}")
        print(f"      Action: {r['action']}")
        print(f"      SHAP impact: +{r['impact']}")