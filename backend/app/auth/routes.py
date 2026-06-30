from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from typing import Optional

from app.database.session import get_db
from app.auth.schemas import (
    GoogleOAuthRequest, TokenResponse, SessionResponse, CurrentUserResponse,
    LearningPathSummary, ProgressSummary
)
from app.auth.services import AuthService
from app.auth.repositories import AuthRepository
from app.auth.dependencies import get_current_user
from app.database.base import User, LearningPath, Module, ModuleProgress
from app.auth.cookies import set_auth_cookie, clear_auth_cookie

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login_for_access_token():
    """
    Standard login route (Disabled - Google SSO is the only authentication mechanism).
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Standard password authentication is disabled. Please authenticate using Google OAuth."
    )


@router.post("/google", response_model=TokenResponse)
async def login_with_google(
    response: Response,
    request: GoogleOAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Google OAuth login route. Sets secure HTTP-Only cookie.
    """
    auth_repo = AuthRepository(db)
    service = AuthService(auth_repo)
    try:
        user = await service.authenticate_with_google(request)
        token = service.generate_jwt(user)
        set_auth_cookie(response, token)
        await db.commit()
        return TokenResponse(access_token=token, token_type="bearer")
    except ValueError as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/logout")
async def logout(response: Response):
    """
    Logout route. Clears authentication cookie.
    """
    clear_auth_cookie(response)
    return {"status": "success", "message": "Logged out successfully"}


@router.get("/me", response_model=SessionResponse)
async def get_session_info(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Session restoration endpoint. Returns the current session user details,
    role, and their curriculum progress summary.
    """
    # 1. Prepare user response
    user_res = CurrentUserResponse.model_validate(current_user)
    
    assigned_path = None
    prog_summary = ProgressSummary()
    
    # 2. If Employee, calculate progress and assigned learning path
    if current_user.role == "Employee":
        # Fetch first active learning path in the database as the assigned path
        path_result = await db.execute(
            select(LearningPath).filter(LearningPath.is_active == True).order_by(LearningPath.created_at.asc())
        )
        path = path_result.scalars().first()
        if path:
            assigned_path = LearningPathSummary.model_validate(path)
            
            # Fetch all modules for this learning path with assessment pre-fetched
            from sqlalchemy.orm import selectinload
            modules_result = await db.execute(
                select(Module)
                .options(selectinload(Module.assessment))
                .filter(Module.learning_path_id == path.id)
            )
            modules = modules_result.scalars().all()
            total_modules = len(modules)
            
            completed_modules = 0
            progresses = []
            completed_module_ids = []
            if total_modules > 0:
                module_ids = [m.id for m in modules]
                progress_result = await db.execute(
                    select(ModuleProgress).filter(
                        ModuleProgress.user_id == current_user.id,
                        ModuleProgress.module_id.in_(module_ids)
                    )
                )
                progresses = progress_result.scalars().all()
                completed_modules = sum(1 for p in progresses if p.status == "completed")
                completed_module_ids = [p.module_id for p in progresses if p.status == "completed"]
                
            # Average score from assessment attempts
            from app.assessments.models import Attempt
            attempts_result = await db.execute(
                select(Attempt).filter(Attempt.user_id == current_user.id)
            )
            attempts = attempts_result.scalars().all()
            
            average_score = 0.0
            module_scores = {}
            if attempts:
                average_score = sum(att.percentage for att in attempts) / len(attempts)
                
                attempts_by_assessment = {}
                for att in attempts:
                    attempts_by_assessment[att.assessment_id] = max(
                        attempts_by_assessment.get(att.assessment_id, 0.0),
                        att.percentage
                    )
                for m in modules:
                    if m.assessment and m.assessment.id in attempts_by_assessment:
                        module_scores[str(m.id)] = round(attempts_by_assessment[m.assessment.id])
                
            # Estimate hours spent based on completed modules duration
            hours_spent = 0.0
            if total_modules > 0:
                progress_map = {p.module_id: p for p in progresses}
                for m in modules:
                    p = progress_map.get(m.id)
                    if p and p.status == "completed":
                        hours_spent += m.estimated_duration_minutes
                hours_spent = hours_spent / 60.0  # Convert to hours
                
            prog_summary = ProgressSummary(
                completed_modules=completed_modules,
                total_modules=total_modules,
                average_score=round(average_score, 1),
                hours_spent=round(hours_spent, 1),
                completed_module_ids=completed_module_ids,
                module_scores=module_scores
            )
            
    return SessionResponse(
        user=user_res,
        role=current_user.role,
        profile=user_res,
        assigned_learning_path=assigned_path,
        progress_summary=prog_summary
    )

