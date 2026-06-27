from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin"
    EMPLOYEE = "Employee"

class AttemptStatus(str, Enum):
    PASS = "pass"
    FAIL = "fail"

class ModuleProgressStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class QuestionType(str, Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class ResourceType(str, Enum):
    PDF = "pdf"
    DWG = "dwg"
    VIDEO = "video"
    LINK = "link"

class ImportJobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
