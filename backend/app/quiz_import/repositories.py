from typing import List
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.quiz_import.models import ImportJob, ImportError

class ImportJobRepository(BaseRepository[ImportJob]):
    def __init__(self, db: AsyncSession):
        super().__init__(ImportJob, db)


class ImportErrorRepository(BaseRepository[ImportError]):
    def __init__(self, db: AsyncSession):
        super().__init__(ImportError, db)

    async def get_by_job_id(self, job_id: uuid.UUID) -> List[ImportError]:
        """
        Fetch all parsing errors recorded for a specific import job.
        """
        result = await self.db.execute(
            select(ImportError)
            .filter(ImportError.import_job_id == job_id)
            .order_by(ImportError.line_number)
        )
        return list(result.scalars().all())
