import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
import app.database.base  # Ensures all SQLAlchemy mappers are configured
from app.common.pagination import PaginationParams
from app.common.exceptions import EntityNotFoundException, EntityAlreadyExistsException, InvalidQuizFormatException
from app.modules.schemas import LearningPathCreate, LearningPathUpdate, ModuleCreate, ModuleUpdate
from app.modules.services import LearningPathService, ModuleService
from app.assessments.schemas import QuestionCreate
from app.assessments.services import AssessmentService

@pytest.mark.asyncio
async def test_learning_path_service_create_and_duplicate():
    path_repo = AsyncMock()
    path_repo.get_by_title.return_value = None
    path_repo.db = AsyncMock()

    service = LearningPathService(path_repo)
    path_in = LearningPathCreate(title="BIM Architecture Foundations", description="CAD/BIM workflow standards")
    
    result = await service.create_learning_path(path_in)
    assert result.title == "BIM Architecture Foundations"
    assert path_repo.create.called

    # Test duplicate title raises EntityAlreadyExistsException
    path_repo.get_by_title.return_value = MagicMock()
    with pytest.raises(EntityAlreadyExistsException):
        await service.create_learning_path(path_in)

@pytest.mark.asyncio
async def test_module_service_create_and_missing_path():
    module_repo = AsyncMock()
    path_repo = AsyncMock()
    progress_repo = AsyncMock()
    module_repo.db = AsyncMock()

    path_repo.get_by_id.return_value = None
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)

    module_in = ModuleCreate(
        learning_path_id=uuid.uuid4(),
        title="Revit Detailing 101",
        estimated_duration_minutes=60,
        passing_percentage=80,
        display_order=1
    )

    with pytest.raises(EntityNotFoundException):
        await service.create_module(module_in)

@pytest.mark.asyncio
async def test_question_validation():
    assessment_repo = AsyncMock()
    question_repo = AsyncMock()
    attempt_repo = AsyncMock()
    answer_repo = AsyncMock()
    assessment_repo.get_by_id.return_value = MagicMock()

    service = AssessmentService(
        assessment_repo=assessment_repo,
        question_repo=question_repo,
        attempt_repo=attempt_repo,
        answer_repo=answer_repo
    )

    # Invalid options count (< 2)
    invalid_q1 = QuestionCreate(
        assessment_id=uuid.uuid4(),
        question="What is CAD?",
        options=["Only one option"],
        answer=[0],
        question_type="single_choice",
        display_order=1
    )
    with pytest.raises(InvalidQuizFormatException):
        await service.create_question(invalid_q1)

    # Invalid answer index out of bounds
    invalid_q2 = QuestionCreate(
        assessment_id=uuid.uuid4(),
        question="What is CAD?",
        options=["Option A", "Option B"],
        answer=[5],
        question_type="single_choice",
        display_order=1
    )
    with pytest.raises(InvalidQuizFormatException):
        await service.create_question(invalid_q2)
