def calculate_premium(zone: str, active_days: int, tenure_weeks: int, claim_count: int, month: int):
    # Base premium by working days
    if active_days <= 4:
        base = 35
        tier = "Basic"
        coverage = 1000
        factor = 0.7
    elif active_days <= 6:
        base = 60
        tier = "Standard"
        coverage = 2000
        factor = 0.8
    else:
        base = 90
        tier = "Pro"
        coverage = 3500
        factor = 0.9

    # Zone risk adjustment (Chennai zones)
    high_risk_zones = ["Guindy", "Tambaram", "Chromepet", "Pallavaram"]
    medium_risk_zones = ["Adyar", "Velachery", "Porur", "Ambattur"]
    if zone in high_risk_zones:
        zone_adj = 10
    elif zone in medium_risk_zones:
        zone_adj = 5
    else:
        zone_adj = 0

    # Seasonal multiplier (monsoon = June-Sept)
    seasonal = 1.3 if month in [6, 7, 8, 9] else 1.0

    # Claim history adjustment
    claim_adj = -3 if claim_count == 0 else min(claim_count * 5, 15)

    # Tenure loyalty discount
    tenure_adj = -2 if tenure_weeks > 8 else 0

    final = round(min((base + zone_adj + claim_adj + tenure_adj) * seasonal, 90), 2)

    return {
        "tier": tier,
        "weekly_premium": final,
        "max_weekly_coverage": coverage,
        "coverage_factor": factor
    }