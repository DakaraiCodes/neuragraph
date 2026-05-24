from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#SQLite database URL:
#Creates a local file called neuragraph.db inside the backend folder
DATABASE_URL = "sqlite:///./neuragraph.db"

#create_engine connects SQLAlchemy to the database specified by DATABASE_URL
#connect_args if needed for SQLite when using FASTAPI.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

#SessionLocal creates datbase sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Base is used by our models.py file
#Every database table class will inherit from this Base class
Base = declarative_base()

#Dependency function for FastAPI routes to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()