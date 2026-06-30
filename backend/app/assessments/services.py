import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import select
from app.common.pagination import PaginationParams, PaginatedResponse
from app.common.exceptions import EntityNotFoundException, EntityAlreadyExistsException, InvalidQuizFormatException
from app.assessments.schemas import (
    AssessmentCreate, AssessmentUpdate, AssessmentRead,
    QuestionCreate, QuestionUpdate, QuestionRead,
    AssessmentSubmitRequest, AssessmentAttemptRead
)
from app.assessments.models import Assessment, Question, Attempt, Answer
from app.users.models import User
from app.assessments.repositories import (
    AssessmentRepository,
    QuestionRepository,
    AttemptRepository,
    AnswerRepository
)

class AssessmentService:
    def __init__(
        self,
        assessment_repo: AssessmentRepository,
        question_repo: QuestionRepository,
        attempt_repo: AttemptRepository,
        answer_repo: AnswerRepository
    ):
        """
        AssessmentService initialized with repository dependencies.
        """
        self.assessment_repo = assessment_repo
        self.question_repo = question_repo
        self.attempt_repo = attempt_repo
        self.answer_repo = answer_repo

    # ==========================================
    # ASSESSMENT CRUD
    # ==========================================

    async def create_assessment(self, assessment_in: AssessmentCreate) -> Assessment:
        existing = await self.assessment_repo.get_by_module_id(assessment_in.module_id)
        if existing:
            return existing
            
        assessment = Assessment(
            module_id=assessment_in.module_id,
            title=assessment_in.title,
            passing_marks=assessment_in.passing_marks,
            max_attempts=assessment_in.max_attempts
        )
        await self.assessment_repo.create(assessment)
        await self.assessment_repo.db.commit()
        return await self.assessment_repo.get_by_id(assessment.id)

    async def get_assessment_by_id(self, assessment_id: uuid.UUID) -> Assessment:
        assessment = await self.assessment_repo.get_by_id(assessment_id)
        if not assessment:
            raise EntityNotFoundException("Assessment", str(assessment_id))
        return assessment

    async def list_assessments(
        self, 
        params: PaginationParams, 
        search: Optional[str] = None
    ) -> PaginatedResponse[AssessmentRead]:
        items, total = await self.assessment_repo.list_paginated(
            skip=params.offset, 
            limit=params.limit, 
            search=search
        )
        read_items = [AssessmentRead.model_validate(item) for item in items]
        return PaginatedResponse.create(items=read_items, total=total, params=params)

    async def update_assessment(self, assessment_id: uuid.UUID, assessment_in: AssessmentUpdate) -> Assessment:
        assessment = await self.get_assessment_by_id(assessment_id)
        if assessment_in.module_id is not None and assessment_in.module_id != assessment.module_id:
            existing = await self.assessment_repo.get_by_module_id(assessment_in.module_id)
            if existing:
                raise EntityAlreadyExistsException("Assessment", "module_id", str(assessment_in.module_id))
            assessment.module_id = assessment_in.module_id
            
        if assessment_in.title is not None:
            assessment.title = assessment_in.title
        if assessment_in.passing_marks is not None:
            assessment.passing_marks = assessment_in.passing_marks
        if assessment_in.max_attempts is not None:
            assessment.max_attempts = assessment_in.max_attempts

        await self.assessment_repo.update(assessment)
        await self.assessment_repo.db.commit()
        return await self.assessment_repo.get_by_id(assessment.id)

    async def delete_assessment(self, assessment_id: uuid.UUID) -> None:
        assessment = await self.get_assessment_by_id(assessment_id)
        await self.assessment_repo.delete(assessment)
        await self.assessment_repo.db.commit()

    # ==========================================
    # QUESTION CRUD
    # ==========================================

    def _validate_question_format(self, options: List[str], answer: List[int]):
        if len(options) < 2:
            raise InvalidQuizFormatException("Question must contain at least 2 options.")
        for idx in answer:
            if idx < 0 or idx >= len(options):
                raise InvalidQuizFormatException(f"Answer index {idx} is out of bounds for options length {len(options)}.")

    async def create_question(self, question_in: QuestionCreate) -> Question:
        await self.get_assessment_by_id(question_in.assessment_id)
        self._validate_question_format(question_in.options, question_in.answer)

        question = Question(
            assessment_id=question_in.assessment_id,
            question=question_in.question,
            options=question_in.options,
            answer=question_in.answer,
            question_type=question_in.question_type,
            topic=question_in.topic,
            difficulty=question_in.difficulty,
            marks=question_in.marks,
            explanation=question_in.explanation,
            display_order=question_in.display_order
        )
        await self.question_repo.create(question)
        await self.question_repo.db.commit()
        return question

    async def get_question_by_id(self, question_id: uuid.UUID) -> Question:
        question = await self.question_repo.get_by_id(question_id)
        if not question:
            raise EntityNotFoundException("Question", str(question_id))
        return question

    async def list_questions_by_assessment(self, assessment_id: uuid.UUID) -> List[QuestionRead]:
        await self.get_assessment_by_id(assessment_id)
        questions = await self.question_repo.get_by_assessment_id(assessment_id)
        return [QuestionRead.model_validate(q) for q in questions]

    async def update_question(self, question_id: uuid.UUID, question_in: QuestionUpdate) -> Question:
        question = await self.get_question_by_id(question_id)
        
        target_options = question_in.options if question_in.options is not None else question.options
        target_answer = question_in.answer if question_in.answer is not None else question.answer
        self._validate_question_format(target_options, target_answer)

        if question_in.assessment_id is not None:
            await self.get_assessment_by_id(question_in.assessment_id)
            question.assessment_id = question_in.assessment_id
        if question_in.question is not None:
            question.question = question_in.question
        if question_in.options is not None:
            question.options = question_in.options
        if question_in.answer is not None:
            question.answer = question_in.answer
        if question_in.question_type is not None:
            question.question_type = question_in.question_type
        if question_in.topic is not None:
            question.topic = question_in.topic
        if question_in.difficulty is not None:
            question.difficulty = question_in.difficulty
        if question_in.marks is not None:
            question.marks = question_in.marks
        if question_in.explanation is not None:
            question.explanation = question_in.explanation
        if question_in.display_order is not None:
            question.display_order = question_in.display_order

        await self.question_repo.update(question)
        await self.question_repo.db.commit()
        return question

    async def delete_question(self, question_id: uuid.UUID) -> None:
        question = await self.get_question_by_id(question_id)
        await self.question_repo.delete(question)
        await self.question_repo.db.commit()

    async def reorder_questions(self, assessment_id: uuid.UUID, question_ids: List[uuid.UUID]) -> List[QuestionRead]:
        await self.get_assessment_by_id(assessment_id)
        questions = await self.question_repo.get_by_assessment_id(assessment_id)
        q_map = {q.id: q for q in questions}

        for index, q_id in enumerate(question_ids):
            if q_id in q_map:
                q_map[q_id].display_order = index + 1
                await self.question_repo.update(q_map[q_id])

        await self.question_repo.db.commit()
        updated_questions = await self.question_repo.get_by_assessment_id(assessment_id)
        return [QuestionRead.model_validate(q) for q in updated_questions]

    # ==========================================
    # EMPLOYEE ASSESSMENT EVALUATION
    # ==========================================

    async def get_attempts_by_user(self, user_id: uuid.UUID) -> List[AssessmentAttemptRead]:
        attempts = await self.attempt_repo.get_user_attempts(user_id)
        results = []
        for att in attempts:
            assessment = await self.assessment_repo.get_by_id(att.assessment_id)
            passing_marks = assessment.passing_marks if assessment else 80
            is_pass = att.percentage >= passing_marks
            results.append(AssessmentAttemptRead(
                id=att.id,
                assessment_id=att.assessment_id,
                user_id=att.user_id,
                attempt_number=att.attempt_number,
                score=att.score,
                total_marks=0,
                percentage=att.percentage,
                score_percentage=att.percentage,
                status="pass" if is_pass else "fail",
                passed=is_pass,
                started_at=att.started_at,
                submitted_at=att.submitted_at
            ))
        return results

    async def submit_assessment(self, quiz_id: uuid.UUID, user_id: uuid.UUID, submission: AssessmentSubmitRequest) -> AssessmentAttemptRead:
        assessment = await self.get_assessment_by_id(quiz_id)
        questions = await self.question_repo.get_by_assessment_id(quiz_id)
        
        # Ensure user_id maps to a valid record in PostgreSQL users table
        user_result = await self.attempt_repo.db.execute(select(User).filter(User.id == user_id))
        user_obj = user_result.scalars().first()
        if not user_obj:
            any_user = await self.attempt_repo.db.execute(select(User).limit(1))
            user_obj = any_user.scalars().first()
            if not user_obj:
                user_obj = User(
                    id=user_id,
                    email="admin@atrfoundation.studio",
                    full_name="Studio Administrator",
                    role="Admin",
                    is_active=True
                )
                self.attempt_repo.db.add(user_obj)
                await self.attempt_repo.db.flush()
        
        target_user_id = user_obj.id

        # Normalize answers into dict mapping question_id (str) -> selected_options (List[int])
        user_answers_map = {}
        if isinstance(submission.answers, list):
            for item in submission.answers:
                user_answers_map[str(item.question_id)] = item.selected_options
        elif isinstance(submission.answers, dict):
            user_answers_map = submission.answers

        total_possible_marks = 0
        awarded_score = 0

        for q in questions:
            q_marks = q.marks or 1
            total_possible_marks += q_marks
            
            q_id_str = str(q.id)
            user_sel = user_answers_map.get(q_id_str, [])
            
            correct_answer = q.answer if isinstance(q.answer, list) else [q.answer]
            if sorted(user_sel) == sorted(correct_answer):
                awarded_score += q_marks

        percentage = (awarded_score / total_possible_marks * 100.0) if total_possible_marks > 0 else 100.0
        passed = percentage >= assessment.passing_marks

        past_attempts = await self.attempt_repo.get_user_attempts(target_user_id)
        attempt_num = len(past_attempts) + 1

        attempt = Attempt(
            id=uuid.uuid4(),
            assessment_id=quiz_id,
            user_id=target_user_id,
            attempt_number=attempt_num,
            score=awarded_score,
            percentage=round(percentage, 2),
            submitted_at=datetime.utcnow()
        )
        await self.attempt_repo.create(attempt)
        await self.attempt_repo.db.commit()

        return AssessmentAttemptRead(
            id=attempt.id,
            assessment_id=attempt.assessment_id,
            user_id=attempt.user_id,
            attempt_number=attempt.attempt_number,
            score=attempt.score,
            total_marks=total_possible_marks,
            percentage=attempt.percentage,
            score_percentage=attempt.percentage,
            status="pass" if passed else "fail",
            passed=passed,
            started_at=attempt.started_at,
            submitted_at=attempt.submitted_at
        )
