from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from secondstep.routes import router as secondstep_router
from fourthstep.routes import router as fourthstep_router

app = FastAPI()

# ✅ Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers from both secondstep and fourthstep
app.include_router(secondstep_router, prefix="/secondstep", tags=["SecondStep"])
app.include_router(fourthstep_router, prefix="/fourthstep", tags=["FourthStep"])

@app.get("/")
async def root():
    return {"message": "Fluention Backend Running for SecondStep & FourthStep"}

