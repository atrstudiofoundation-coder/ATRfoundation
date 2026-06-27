import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy import select, func

# Models
from app.users.models import User
from app.assessments.models import Assessment, Question
from app.quiz_import.models import ImportJob, ImportError

# Repositories
from app.quiz_import.repositories import ImportJobRepository, ImportErrorRepository
from app.assessments.repositories import AssessmentRepository

# Extractors, Parsers, and Validators
from app.quiz_import.extractors.docx_extractor import DocxExtractor
from app.quiz_import.extractors.pdf_extractor import PdfExtractor
from app.quiz_import.extractors.txt_extractor import TxtExtractor
from app.quiz_import.extractors.markdown_extractor import MarkdownExtractor
from app.quiz_import.parsers.question_parser import QuestionParser, ParsedQuestion
from app.quiz_import.validators.validator import QuestionValidator

# Directory for storing temp upload assets
TEMP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "temp_files"))

class QuizImportService:
    def __init__(
        self,
        import_job_repo: ImportJobRepository,
        import_error_repo: ImportErrorRepository,
        assessment_repo: AssessmentRepository
    ):
        self.import_job_repo = import_job_repo
        self.import_error_repo = import_error_repo
        self.assessment_repo = assessment_repo
        self.db = import_job_repo.db
        
        # Ensure temp directory exists
        os.makedirs(TEMP_DIR, exist_ok=True)

    def _get_extractor(self, filename: str):
        """Returns the appropriate extractor based on file extension."""
        ext = os.path.splitext(filename.lower())[1]
        if ext == ".docx":
            return DocxExtractor()
        elif ext == ".pdf":
            return PdfExtractor()
        elif ext == ".txt":
            return TxtExtractor()
        elif ext == ".md":
            return MarkdownExtractor()
        else:
            raise ValueError(f"Unsupported file type: {ext}. Only .docx, .pdf, .txt, and .md are supported.")

    async def upload_and_preview(
        self, 
        filename: str, 
        file_content: bytes, 
        assessment_id: uuid.UUID, 
        user_id: Optional[uuid.UUID]
    ) -> Dict[str, Any]:
        """
        Steps:
        1. Create an ImportJob in database.
        2. Write temp bin/json files containing raw file and metadata.
        3. Extract text.
        4. Parse questions.
        5. Validate questions.
        6. Persist validation errors in database.
        7. Return aggregated preview response.
        """
        # 1. Create ImportJob
        job = ImportJob(
            id=uuid.uuid4(),
            filename=filename,
            uploaded_by=user_id,
            status="pending",
            uploaded_at=datetime.utcnow()
        )
        await self.import_job_repo.create(job)
        await self.db.flush()  # Generates database record to confirm transaction state
        
        # 2. Write temp files to disk for stateless persistence between requests
        bin_path = os.path.join(TEMP_DIR, f"{job.id}.bin")
        meta_path = os.path.join(TEMP_DIR, f"{job.id}.json")
        
        with open(bin_path, "wb") as f:
            f.write(file_content)
            
        with open(meta_path, "w") as f:
            json.dump({
                "filename": filename,
                "assessment_id": str(assessment_id),
                "uploaded_by": str(user_id) if user_id else None
            }, f)
            
        # 3. Extract Text
        try:
            extractor = self._get_extractor(filename)
            raw_text = extractor.extract(file_content)
        except Exception as e:
            job.status = "failed"
            job.completed_at = datetime.utcnow()
            err = ImportError(
                id=uuid.uuid4(),
                import_job_id=job.id,
                error_message=f"Text extraction failed: {str(e)}"
            )
            await self.import_error_repo.create(err)
            await self.db.commit()
            raise ValueError(f"Extraction failed: {str(e)}")

        # 4. Parse Questions
        parser = QuestionParser()
        parsed_questions = parser.parse(raw_text)
        
        # 5. Validate Questions
        validator = QuestionValidator()
        all_errors = []
        valid_questions: List[ParsedQuestion] = []
        invalid_questions: List[ParsedQuestion] = []
        
        for pq in parsed_questions:
            q_errors = validator.validate(pq)
            if q_errors:
                all_errors.extend(q_errors)
                invalid_questions.append(pq)
            else:
                valid_questions.append(pq)

        # 6. Save persistent ImportErrors into DB
        for err_dict in all_errors:
            db_err = ImportError(
                id=uuid.uuid4(),
                import_job_id=job.id,
                error_message=err_dict["message"],
                line_number=err_dict["line"]
            )
            await self.import_error_repo.create(db_err)

        await self.db.commit()

        # 7. Formulate preview result
        return {
            "job_id": job.id,
            "filename": filename,
            "questions_parsed": len(parsed_questions),
            "questions_valid": len(valid_questions),
            "questions_invalid": len(invalid_questions),
            "errors": [{"line": e["line"], "message": e["message"]} for e in all_errors],
            "questions": [q.to_dict() for q in valid_questions]
        }

    async def commit_import(self, job_id: uuid.UUID) -> Dict[str, Any]:
        """
        Steps:
        1. Retrieve job details from DB.
        2. Retrieve stored raw files.
        3. Parse and validate questions.
        4. Bulk insert valid questions with incrementing display_order.
        5. Update job status to completed.
        6. Clean up temp files.
        """
        # 1. Retrieve job details
        job = await self.import_job_repo.get_by_id(job_id)
        if not job:
            raise KeyError(f"ImportJob with ID {job_id} not found.")
            
        if job.status != "pending":
            raise ValueError(f"ImportJob is already in {job.status} status and cannot be committed.")
            
        # 2. Check and retrieve temp files
        bin_path = os.path.join(TEMP_DIR, f"{job_id}.bin")
        meta_path = os.path.join(TEMP_DIR, f"{job_id}.json")
        
        if not os.path.exists(bin_path) or not os.path.exists(meta_path):
            job.status = "failed"
            job.completed_at = datetime.utcnow()
            await self.db.commit()
            raise FileNotFoundError("Temporary upload assets have expired or were not found.")

        with open(meta_path, "r") as f:
            metadata = json.load(f)
            
        assessment_id = uuid.UUID(metadata["assessment_id"])
        
        # Verify assessment exists
        assessment = await self.assessment_repo.get_by_id(assessment_id)
        if not assessment:
            raise KeyError(f"Assessment with ID {assessment_id} associated with import job no longer exists.")

        # Read binary file content
        with open(bin_path, "rb") as f:
            file_content = f.read()

        # 3. Parse and validate
        extractor = self._get_extractor(job.filename)
        raw_text = extractor.extract(file_content)
        parser = QuestionParser()
        parsed_questions = parser.parse(raw_text)
        validator = QuestionValidator()
        
        valid_questions: List[ParsedQuestion] = []
        failed_count = 0
        
        for pq in parsed_questions:
            if not validator.validate(pq):
                valid_questions.append(pq)
            else:
                failed_count += 1

        if not valid_questions:
            job.status = "failed"
            job.completed_at = datetime.utcnow()
            await self.db.commit()
            return {
                "imported_count": 0,
                "failed_count": failed_count,
                "message": "No valid questions were found to import."
            }

        # 4. Determine display order baseline
        order_result = await self.db.execute(
            select(func.max(Question.display_order)).filter(Question.assessment_id == assessment_id)
        )
        max_order = order_result.scalar() or 0
        
        # Insert questions
        for idx, vq in enumerate(valid_questions):
            q_dict = vq.to_dict()
            db_q = Question(
                id=uuid.uuid4(),
                assessment_id=assessment_id,
                question=q_dict["question"],
                options=q_dict["options"],
                answer=q_dict["answer"],
                question_type=q_dict["question_type"],
                topic=q_dict["topic"],
                difficulty=q_dict["difficulty"],
                marks=q_dict["marks"],
                explanation=q_dict["explanation"],
                display_order=max_order + idx + 1,
                created_at=datetime.utcnow()
            )
            self.db.add(db_q)

        # 5. Update Job Status
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        await self.db.commit()

        # 6. Clean up temporary files
        try:
            os.remove(bin_path)
            os.remove(meta_path)
        except Exception:
            pass  # Non-blocking log if cleanup fails
            
        return {
            "imported_count": len(valid_questions),
            "failed_count": failed_count
        }

    async def get_job_status(self, job_id: uuid.UUID) -> Dict[str, Any]:
        """Returns details, status, and list of errors for a job."""
        job = await self.import_job_repo.get_by_id(job_id)
        if not job:
            raise KeyError(f"ImportJob with ID {job_id} not found.")

        # Get errors associated with job
        errors = await self.import_error_repo.get_by_job_id(job_id)

        return {
            "id": job.id,
            "filename": job.filename,
            "uploaded_by": job.uploaded_by,
            "status": job.status,
            "uploaded_at": job.uploaded_at,
            "completed_at": job.completed_at,
            "errors": [
                {
                    "line": err.line_number,
                    "message": err.error_message
                }
                for err in errors
            ]
        }
