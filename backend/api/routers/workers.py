from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.database import get_db, Worker
from api.ml.premium import calculate_premium
from datetime import datetime

router = APIRouter(prefix="/workers", tags=["Workers"])

class WorkerCreate(BaseModel):
    name: str
    phone: str
    platform: str
    zone: str
    pincode: str
    active_days: int
    avg_hourly_earnings: float = 75.0
    tenure_weeks: int = 1

@router.post("/register")
def register_worker(data: WorkerCreate, db: Session = Depends(get_db)):
    # Check if phone already registered
    existing = db.query(Worker).filter(Worker.phone == data.phone).first()
    if existing:
        return {"error": "Phone already registered", "worker_id": existing.id}

    worker = Worker(**data.dict())
    db.add(worker)
    db.commit()
    db.refresh(worker)

    # Get premium suggestion immediately
    month = datetime.utcnow().month
    premium_info = calculate_premium(
        zone=data.zone,
        active_days=data.active_days,
        tenure_weeks=data.tenure_weeks,
        claim_count=0,
        month=month
    )

    return {
        "message": "Worker registered successfully",
        "worker_id": worker.id,
        "name": worker.name,
        "suggested_plan": premium_info
    }

@router.get("/{worker_id}")
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        return {"error": "Worker not found"}
    return worker