# Import all models here so that Alembic's env.py can import Base.metadata
# and automatically detect model changes for migrations.

from app.database.session import Base
from app.users.models import User
from app.modules.models import LearningPath, Module, ModuleResource, ModuleProgress
from app.resources.models import Resource
from app.assessments.models import Assessment, Question, Attempt, Answer
from app.quiz_import.models import ImportJob, ImportError
