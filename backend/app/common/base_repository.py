from typing import Generic, TypeVar, Type, List, Optional
import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        """
        Base asynchronous repository providing generic CRUD operations.
        """
        self.model = model
        self.db = db

    async def get_by_id(self, id: uuid.UUID) -> Optional[ModelType]:
        """
        Fetch a single entity by its UUID.
        """
        result = await self.db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def create(self, entity: ModelType) -> ModelType:
        """
        Add a new entity instance to the session registry.
        """
        self.db.add(entity)
        return entity

    async def update(self, entity: ModelType) -> ModelType:
        """
        Merge/Add an updated entity instance to the session registry.
        """
        self.db.add(entity)
        return entity

    async def delete(self, entity: ModelType) -> None:
        """
        Mark an entity instance for deletion.
        """
        await self.db.delete(entity)

    async def exists(self, id: uuid.UUID) -> bool:
        """
        Check for presence of an entity by ID using count aggregation.
        """
        result = await self.db.execute(
            select(func.count()).select_from(self.model).filter(self.model.id == id)
        )
        count = result.scalar()
        return (count or 0) > 0

    async def list(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Retrieve a list of entities with support for pagination offsets.
        """
        result = await self.db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())
