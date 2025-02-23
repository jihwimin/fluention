from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from secondstep.routes import router as secondstep_router
from thirdstep.routes import router as thirdstep_router
from fourthstep.routes import router as fourthstep_router
from lipsync.routes import lipsync_router  # ✅ Use correct variable name

from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()

app = FastAPI()

# ✅ Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve static files (for generated MP4s or MP3s)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Include all routers
app.include_router(secondstep_router, prefix="/secondstep")
app.include_router(thirdstep_router, prefix="/thirdstep")
app.include_router(fourthstep_router, prefix="/fourthstep")
app.include_router(lipsync_router, prefix="/lipsync")  # ✅ Added lipsync router

@app.get("/")
async def root():
    return {"message": "Fluention AI Voice Assistant Running"}
