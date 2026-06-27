from pydantic import BaseModel

class UserProgressSummary(BaseModel):
    user_name: str
    department: str
    progress_percent: int
    average_score_percent: int
    status: str

class SystemComplianceStats(BaseModel):
    total_onboardees: int
    overall_compliance_rate: float
    average_quiz_score: float
    cohort_progress: list[UserProgressSummary]

class AnalyticsOverview(BaseModel):
    total_users: int = 48
    active_employees: int = 48
    total_learning_paths: int = 1
    average_pass_rate: float = 92.0
    completed_assessments_count: int = 12
