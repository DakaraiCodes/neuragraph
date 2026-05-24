import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routes import graph, ingest

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeuraGraph API",
    description="AI-powered knowledge graph builder API",
    version="0.1.0"
)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

# CORS must be added right after app is created
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        *frontend_origins,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph.router)
app.include_router(ingest.router)


@app.get("/")
def root():
    return {
        "message": "NeuraGraph API is running",
        "database": "connected",
        "cors": "enabled",
        "docs": "/docs",
    }
