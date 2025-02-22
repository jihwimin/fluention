from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import router
import os

app = FastAPI()

# ✅ Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve static files (MP3 audio files)
if not os.path.exists("static"):
    os.makedirs("static")  # Ensure the "static" folder exists

app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Include other routes
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Fluention AI Voice Assistant Running"}
