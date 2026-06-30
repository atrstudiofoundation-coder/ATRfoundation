from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.analytics.schemas import AnalyticsOverview, SystemComplianceStats, UserProgressSummary
from app.users.models import User
from app.modules.models import LearningPath
from app.assessments.models import Assessment, Attempt

class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_analytics_overview(self) -> AnalyticsOverview:
        """
        Compute live analytics metrics from PostgreSQL.
        """
        # 1. Total users
        tot_users_res = await self.db.execute(select(func.count()).select_from(User))
        total_users = tot_users_res.scalar() or 0

        # 2. Active employees
        act_emp_res = await self.db.execute(
            select(func.count()).select_from(User).filter(User.role == "Employee", User.is_active == True)
        )
        active_employees = act_emp_res.scalar() or 0
        if active_employees == 0 and total_users > 0:
            active_employees = total_users

        # 3. Total learning paths
        lp_res = await self.db.execute(select(func.count()).select_from(LearningPath))
        total_learning_paths = lp_res.scalar() or 0

        # 4. Completed assessment attempts count
        att_count_res = await self.db.execute(select(func.count()).select_from(Attempt))
        completed_assessments_count = att_count_res.scalar() or 0

        # 5. Average pass rate percentage
        if completed_assessments_count > 0:
            avg_pct_res = await self.db.execute(select(func.avg(Attempt.percentage)))
            avg_pct = avg_pct_res.scalar() or 0.0
            average_pass_rate = round(float(avg_pct), 1)
        else:
            average_pass_rate = 0.0

        return AnalyticsOverview(
            total_users=total_users,
            active_employees=active_employees,
            total_learning_paths=total_learning_paths,
            average_pass_rate=average_pass_rate,
            completed_assessments_count=completed_assessments_count
        )

    async def get_compliance_stats(self) -> SystemComplianceStats:
        """
        Compute system-wide employee onboarding statistics and progress.
        """
        overview = await self.get_analytics_overview()
        
        cohort_progress = []
        user_res = await self.db.execute(select(User).limit(10))
        users = list(user_res.scalars().all())
        
        for u in users:
            att_res = await self.db.execute(select(Attempt).filter(Attempt.user_id == u.id))
            user_attempts = list(att_res.scalars().all())
            avg_score = round(sum(a.percentage for a in user_attempts) / len(user_attempts)) if user_attempts else 0
            status = "Completed" if any(a.percentage >= 80 for a in user_attempts) else ("In Progress" if user_attempts else "Not Started")
            
            cohort_progress.append(UserProgressSummary(
                user_name=u.full_name or u.email,
                department="Studio Design",
                progress_percent=100 if status == "Completed" else (50 if status == "In Progress" else 0),
                average_score_percent=avg_score,
                status=status
            ))
            
        return SystemComplianceStats(
            total_onboardees=overview.active_employees,
            overall_compliance_rate=overview.average_pass_rate,
            average_quiz_score=overview.average_pass_rate,
            cohort_progress=cohort_progress
        )
