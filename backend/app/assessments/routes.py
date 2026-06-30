from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.auth.dependencies import get_current_admin_user, get_current_user
from app.users.models import User
from app.common.pagination import PaginationParams, PaginatedResponse
from app.assessments.schemas import (
    AssessmentCreate, AssessmentUpdate, AssessmentRead,
    QuestionCreate, QuestionUpdate, QuestionRead, QuestionReorderRequest,
    AssessmentAttemptRead, AssessmentSubmitRequest
)
from app.assessments.services import AssessmentService
from app.assessments.repositories import (
    AssessmentRepository,
    QuestionRepository,
    AttemptRepository,
    AnswerRepository
)

router = APIRouter(prefix="/assessments", tags=["assessments"])

def get_service(db: AsyncSession) -> AssessmentService:
    return AssessmentService(
        assessment_repo=AssessmentRepository(db),
        question_repo=QuestionRepository(db),
        attempt_repo=AttemptRepository(db),
        answer_repo=AnswerRepository(db)
    )

# ==========================================
# ADMIN ASSESSMENT ENDPOINTS
# ==========================================

@router.post("/", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_in: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.create_assessment(assessment_in)


@router.get("/", response_model=PaginatedResponse[AssessmentRead])
async def list_assessments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    params = PaginationParams(page=page, page_size=page_size)
    return await service.list_assessments(params, search=search)


@router.get("/{assessment_id}", response_model=AssessmentRead)
async def get_assessment(
    assessment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.get_assessment_by_id(assessment_id)


@router.put("/{assessment_id}", response_model=AssessmentRead)
async def update_assessment(
    assessment_id: uuid.UUID,
    assessment_in: AssessmentUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.update_assessment(assessment_id, assessment_in)


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    await service.delete_assessment(assessment_id)


# ==========================================
# ADMIN QUESTION ENDPOINTS
# ==========================================

@router.post("/{assessment_id}/questions", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
@router.post("/questions", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_in: QuestionCreate,
    assessment_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    if assessment_id is not None:
        question_in.assessment_id = assessment_id
    service = get_service(db)
    return await service.create_question(question_in)


@router.get("/{assessment_id}/questions", response_model=List[QuestionRead])
async def list_questions_for_assessment(
    assessment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.list_questions_by_assessment(assessment_id)


@router.get("/questions/{question_id}", response_model=QuestionRead)
async def get_question(
    question_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.get_question_by_id(question_id)


@router.put("/questions/{question_id}", response_model=QuestionRead)
async def update_question(
    question_id: uuid.UUID,
    question_in: QuestionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.update_question(question_id, question_in)


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    question_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    await service.delete_question(question_id)


@router.post("/{assessment_id}/questions/reorder", response_model=List[QuestionRead])
async def reorder_questions(
    assessment_id: uuid.UUID,
    reorder_in: QuestionReorderRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    service = get_service(db)
    return await service.reorder_questions(assessment_id, reorder_in.question_ids)


# ==========================================
# EMPLOYEE STUBS
# ==========================================

@router.get("/user/{user_id}", response_model=list[AssessmentAttemptRead])
async def list_attempts_for_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Get all past quiz attempts for a specific employee.
    """
    service = get_service(db)
    try:
        return await service.get_attempts_by_user(user_id)
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))


@router.post("/{quiz_id}/submit", response_model=AssessmentAttemptRead)
@router.post("/quiz/{quiz_id}/submit", response_model=AssessmentAttemptRead)
async def submit_quiz(
    quiz_id: uuid.UUID, 
    submission: AssessmentSubmitRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit quiz answers, perform automatic grading, and save the score attempt.
    """
    service = get_service(db)
    return await service.submit_assessment(quiz_id, current_user.id, submission)
