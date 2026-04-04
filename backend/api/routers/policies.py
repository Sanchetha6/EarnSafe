from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.database import get_db, Policy, Worker
from api.ml.premium import calculate_premium
from datetime import datetime, timedelta

router = APIRouter(prefix="/policies", tags=["Policies"])

class PolicyCreate(BaseModel):
    worker_id: int
    tier: str  # Basic / Standard / Pro

@router.post("/create")
def create_policy(data: PolicyCreate, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == data.worker_id).first()
    if not worker:
        return {"error": "Worker not found"}

    # Check if already has active policy this week
    existing = db.query(Policy).filter(
        Policy.worker_id == data.worker_id,
        Policy.status == "active"
    ).first()
    if existing:
        return {"error": "Worker already has an active policy", "policy_id": existing.id}

    # Calculate premium based on tier chosen
    tier_map = {
        "Basic":    {"days": 4, "coverage": 1000, "factor": 0.7, "premium": 35},
        "Standard": {"days": 6, "coverage": 2000, "factor": 0.8, "premium": 60},
        "Pro":      {"days": 7, "coverage": 3500, "factor": 0.9, "premium": 90},
    }
    if data.tier not in tier_map:
        return {"error": "Invalid tier. Choose Basic, Standard, or Pro"}

    month = datetime.utcnow().month
    premium_info = calculate_premium(
        zone=worker.zone,
        active_days=tier_map[data.tier]["days"],
        tenure_weeks=worker.tenure_weeks,
        claim_count=0,
        month=month
    )

    week_start = datetime.utcnow().date()
    week_end = week_start + timedelta(days=7)

    policy = Policy(
        worker_id=data.worker_id,
        tier=data.tier,
        premium=premium_info["weekly_premium"],
        coverage_amount=tier_map[data.tier]["coverage"],
        coverage_factor=tier_map[data.tier]["factor"],
        week_start=str(week_start),
        week_end=str(week_end),
        status="active"
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)

    return {
        "message": "Policy created successfully",
        "policy_id": policy.id,
        "tier": policy.tier,
        "weekly_premium": policy.premium,
        "max_coverage": policy.coverage_amount,
        "valid_from": policy.week_start,
        "valid_until": policy.week_end
    }

@router.get("/{worker_id}")
def get_policy(worker_id: int, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(
        Policy.worker_id == worker_id,
        Policy.status == "active"
    ).first()
    if not policy:
        return {"error": "No active policy found"}
    return policy