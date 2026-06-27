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
