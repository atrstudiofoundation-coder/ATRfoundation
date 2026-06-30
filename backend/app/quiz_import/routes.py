import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db

# Schemas
from app.quiz_import.schemas import (
    ImportUploadResponse,
    ImportCommitResponse,
    ImportJobStatusResponse
)
# Services
from app.quiz_import.services.import_service import QuizImportService

# Repositories
from app.quiz_import.repositories import ImportJobRepository, ImportErrorRepository
from typing import List
from app.assessments.schemas import QuestionRead
from app.assessments.repositories import AssessmentRepository, QuestionRepository

router = APIRouter(tags=["quiz_import"])

@router.post("/quiz-import/assessments/{assessment_id}/import", response_model=List[QuestionRead])
@router.post("/assessments/{assessment_id}/import", response_model=List[QuestionRead])
async def direct_quiz_import(
    assessment_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    import_job_repo = ImportJobRepository(db)
    import_error_repo = ImportErrorRepository(db)
    assessment_repo = AssessmentRepository(db)
    question_repo = QuestionRepository(db)
    
    service = QuizImportService(
        import_job_repo=import_job_repo,
        import_error_repo=import_error_repo,
        assessment_repo=assessment_repo
    )
    
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        preview = await service.upload_and_preview(
            filename=file.filename or "unknown_file",
            file_content=content,
            assessment_id=assessment_id,
            user_id=None
        )
        if preview.get("errors") or preview.get("questions_valid", 0) == 0:
            err_details = [e.get("message") for e in preview.get("errors", [])]
            msg = "; ".join(err_details) if err_details else "No valid questions matching required schema were found."
            raise HTTPException(status_code=400, detail=f"Validation Failed: {msg}")

        await service.commit_import(preview["job_id"])
        questions = await question_repo.get_by_assessment_id(assessment_id)
        return [QuestionRead.model_validate(q) for q in questions]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import/upload", response_model=ImportUploadResponse)
async def upload_quiz(
    assessment_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a quiz document (DOCX, PDF, TXT, MD), parse, validate, and return a preview.
    Nothing is stored in the questions table yet.
    """
    import_job_repo = ImportJobRepository(db)
    import_error_repo = ImportErrorRepository(db)
    assessment_repo = AssessmentRepository(db)
    
    service = QuizImportService(
        import_job_repo=import_job_repo,
        import_error_repo=import_error_repo,
        assessment_repo=assessment_repo
    )
    
    # Read binary content
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        preview = await service.upload_and_preview(
            filename=file.filename or "unknown_file",
            file_content=content,
            assessment_id=assessment_id,
            user_id=None  # Bypassed/Nullable for now
        )
        return preview
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/import/{job_id}/commit", response_model=ImportCommitResponse)
async def commit_quiz_import(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Commit the validated questions from a previewed ImportJob into PostgreSQL.
    """
    import_job_repo = ImportJobRepository(db)
    import_error_repo = ImportErrorRepository(db)
    assessment_repo = AssessmentRepository(db)
    
    service = QuizImportService(
        import_job_repo=import_job_repo,
        import_error_repo=import_error_repo,
        assessment_repo=assessment_repo
    )
    try:
        result = await service.commit_import(job_id)
        return result
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=410, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/import/{job_id}", response_model=ImportJobStatusResponse)
async def get_quiz_import_status(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get the upload, parsing, and commit status of a quiz import job.
    """
    import_job_repo = ImportJobRepository(db)
    import_error_repo = ImportErrorRepository(db)
    assessment_repo = AssessmentRepository(db)
    
    service = QuizImportService(
        import_job_repo=import_job_repo,
        import_error_repo=import_error_repo,
        assessment_repo=assessment_repo
    )
    try:
        status = await service.get_job_status(job_id)
        return status
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
