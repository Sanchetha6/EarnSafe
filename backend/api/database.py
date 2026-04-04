from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./earnsafe.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MODELS ---

class Worker(Base):
    __tablename__ = "workers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True)
    platform = Column(String)       # Zepto / Blinkit
    zone = Column(String)           # e.g. Guindy, Adyar
    pincode = Column(String)
    active_days = Column(Integer)   # days per week
    avg_hourly_earnings = Column(Float, default=75.0)
    tenure_weeks = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer)
    tier = Column(String)           # Basic / Standard / Pro
    premium = Column(Float)
    coverage_amount = Column(Float)
    coverage_factor = Column(Float)
    week_start = Column(String)
    week_end = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer)
    policy_id = Column(Integer)
    trigger_type = Column(String)   # heavy_rain / aqi / heat / flood / civic
    zone = Column(String)
    disruption_hours = Column(Float)
    payout_amount = Column(Float)
    status = Column(String, default="approved")  # approved / flagged / paid
    upi_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)