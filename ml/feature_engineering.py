import pandas as pd
import numpy as np

def load_oulad_data():
    """Load all OULAD CSV files"""
    student_info        = pd.read_csv("data/raw/studentInfo.csv")
    student_vle         = pd.read_csv("data/raw/studentVle.csv")
    student_assessment  = pd.read_csv("data/raw/studentAssessment.csv")
    assessments         = pd.read_csv("data/raw/assessments.csv")
    student_reg         = pd.read_csv("data/raw/studentRegistration.csv")

    print(f"✅ studentInfo        — {len(student_info)} rows")
    print(f"✅ studentVle         — {len(student_vle)} rows")
    print(f"✅ studentAssessment  — {len(student_assessment)} rows")
    print(f"✅ assessments        — {len(assessments)} rows")
    print(f"✅ studentRegistration— {len(student_reg)} rows")

    return student_info, student_vle, student_assessment, assessments, student_reg


def build_feature_matrix(student_info, student_vle, student_assessment, assessments, student_reg):
    """
    Engineer behavioural features from OULAD data
    that map to Miva's equivalent LMS indicators
    """

    # ── FEATURE 1: Resource Access (from VLE interactions) ───────────────
    vle_features = student_vle.groupby("id_student").agg(
        total_clicks          = ("sum_click", "sum"),
        total_resource_access = ("sum_click", "count"),
        avg_clicks_per_day    = ("sum_click", "mean"),
        active_days           = ("date", "nunique"),
        last_active_day       = ("date", "max"),
        first_active_day      = ("date", "min"),
    ).reset_index()

    # Days since last active (proxy for login recency)
    vle_features["days_since_active"] = (
        vle_features["last_active_day"].max() - vle_features["last_active_day"]
    )

    # ── FEATURE 2: Assessment Performance ────────────────────────────────
    # Merge assessments to get weights
    assessment_merged = student_assessment.merge(
        assessments[["id_assessment", "assessment_type", "weight"]],
        on="id_assessment", how="left"
    )

    assessment_features = assessment_merged.groupby("id_student").agg(
        avg_score             = ("score", "mean"),
        submission_count      = ("id_assessment", "count"),
        late_submission_count = ("is_banked", "sum"),  # is_banked = submitted late
    ).reset_index()

    # Total assessments available (for submission rate)
    total_assessments = assessments["id_assessment"].nunique()
    assessment_features["submission_rate"] = (
        assessment_features["submission_count"] / total_assessments
    ).clip(0, 1)

    assessment_features["late_submission_rate"] = (
        assessment_features["late_submission_count"] /
        assessment_features["submission_count"].replace(0, 1)
    ).clip(0, 1)

    # ── FEATURE 3: Registration Status ───────────────────────────────────
    reg_features = student_reg.groupby("id_student").agg(
        date_registration     = ("date_registration", "min"),
        date_unregistration   = ("date_unregistration", "max"),
    ).reset_index()

    # ── MERGE ALL FEATURES ────────────────────────────────────────────────
    features = vle_features.merge(assessment_features, on="id_student", how="left")
    features = features.merge(reg_features,            on="id_student", how="left")

    # ── LABEL: at_risk ────────────────────────────────────────────────────
    # From studentInfo: final_result = Fail or Withdrawn → at_risk = 1
    labels = student_info[["id_student", "final_result", "gender",
                            "region", "highest_education",
                            "imd_band", "age_band", "num_of_prev_attempts"]].copy()

    labels["at_risk"] = labels["final_result"].isin(["Fail", "Withdrawn"]).astype(int)

    features = features.merge(labels, on="id_student", how="left")

    # ── CLEAN UP ──────────────────────────────────────────────────────────
    features = features.fillna(0)
    features = features.drop_duplicates(subset="id_student")

    print(f"\n✅ Feature matrix built:")
    print(f"   {len(features)} students")
    print(f"   {features.shape[1]} columns")
    print(f"   At-risk students: {features['at_risk'].sum()} ({features['at_risk'].mean()*100:.1f}%)")

    # Save processed features
    features.to_csv("data/processed/student_features.csv", index=False)
    print(f"\n✅ Saved to data/processed/student_features.csv")

    return features


if __name__ == "__main__":
    student_info, student_vle, student_assessment, assessments, student_reg = load_oulad_data()
    features = build_feature_matrix(student_info, student_vle, student_assessment, assessments, student_reg)
    print("\nFeature columns:")
    for col in features.columns:
        print(f"  - {col}")