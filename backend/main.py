from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.database import init_db
from api.routers import workers, policies, claims

app = FastAPI(title="EarnSafe API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up all routers
app.include_router(workers.router)
app.include_router(policies.router)
app.include_router(claims.router)

@app.on_event("startup")
def startup():
    init_db()
    print("✅ EarnSafe DB initialized")

@app.get("/")
def root():
    return {"message": "EarnSafe API is running 🚀"}