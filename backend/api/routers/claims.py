from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.database import get_db, Claim, Policy, Worker
from datetime import datetime

router = APIRouter(prefix="/claims", tags=["Claims"])

TRIGGER_HOURS = {
    "heavy_rain": 3.0,
    "aqi_severe": 4.0,
    "extreme_heat": 2.5,
    "flood": 6.0,
    "civic_disruption": 8.0
}

class SimulateTrigger(BaseModel):
    zone: str
    trigger_type: str  # heavy_rain / aqi_severe / extreme_heat / flood / civic_disruption

@router.post("/simulate-trigger")
def simulate_trigger(data: SimulateTrigger, db: Session = Depends(get_db)):
    # Find all active policies in this zone
    workers_in_zone = db.query(Worker).filter(Worker.zone == data.zone).all()
    if not workers_in_zone:
        return {"message": "No workers found in this zone"}

    created_claims = []

    for worker in workers_in_zone:
        policy = db.query(Policy).filter(
            Policy.worker_id == worker.id,
            Policy.status == "active"
        ).first()

        if not policy:
            continue

        # Duplicate check — same worker, same trigger today
        today = str(datetime.utcnow().date())
        duplicate = db.query(Claim).filter(
            Claim.worker_id == worker.id,
            Claim.trigger_type == data.trigger_type,
            Claim.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)
        ).first()
        if duplicate:
            continue

        # Calculate payout
        hours = TRIGGER_HOURS.get(data.trigger_type, 2.0)
        payout = round(worker.avg_hourly_earnings * hours * policy.coverage_factor, 2)
        payout = min(payout, policy.coverage_amount)  # cap at max coverage

        claim = Claim(
            worker_id=worker.id,
            policy_id=policy.id,
            trigger_type=data.trigger_type,
            zone=data.zone,
            disruption_hours=hours,
            payout_amount=payout,
            status="approved",
            upi_id=f"{worker.phone}@upi"
        )
        db.add(claim)
        db.commit()
        db.refresh(claim)

        created_claims.append({
            "claim_id": claim.id,
            "worker": worker.name,
            "trigger": data.trigger_type,
            "hours_lost": hours,
            "payout": f"₹{payout}",
            "upi": claim.upi_id,
            "status": "approved ✅"
        })

    return {
        "trigger": data.trigger_type,
        "zone": data.zone,
        "claims_created": len(created_claims),
        "details": created_claims
    }

@router.get("/{worker_id}")
def get_claims(worker_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.worker_id == worker_id).all()
    if not claims:
        return {"message": "No claims found", "claims": []}
    return {"claims": [
        {
            "claim_id": c.id,
            "trigger": c.trigger_type,
            "zone": c.zone,
            "hours_lost": c.disruption_hours,
            "payout": f"₹{c.payout_amount}",
            "status": c.status,
            "date": str(c.created_at)[:10]
        } for c in claims
    ]}