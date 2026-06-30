from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.analytics.schemas import SystemComplianceStats, AnalyticsOverview
from app.analytics.services import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/compliance", response_model=SystemComplianceStats)
async def get_system_compliance(db: AsyncSession = Depends(get_db)):
    """
    Retrieve system-wide onboarding compliance summaries (Admin Only).
    """
    service = AnalyticsService(db)
    try:
        return await service.get_compliance_stats()
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    """
    Retrieve executive analytics dashboard overview metrics computed from database.
    """
    service = AnalyticsService(db)
    return await service.get_analytics_overview()
