from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.common.config import settings

# Import Routers
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.modules.routes import router as modules_router
from app.resources.routes import router as resources_router
from app.assessments.routes import router as assessments_router
from app.analytics.routes import router as analytics_router
from app.quiz_import.routes import router as quiz_import_router

from app.database.session import engine
from app.database.base import Base

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ATR Foundation Onboarding & Technical Assessment API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# CORS Policy configuration
import os
cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
env_frontend = os.getenv("FRONTEND_URL")
if env_frontend:
    cors_origins.extend([origin.strip() for origin in env_frontend.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include module endpoints
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(modules_router, prefix=settings.API_V1_STR)
app.include_router(resources_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(quiz_import_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "api_docs": "/docs"
    }
