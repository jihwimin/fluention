import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fourthstep.routes import router as fourthstep_router

app = FastAPI()

# ✅ Ensure static folder exists
if not os.path.exists("static"):
    os.makedirs("static")

# ✅ Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Include FourthStep routes
app.include_router(fourthstep_router, prefix="/fourthstep")

@app.get("/")
async def root():
    return {"message": "Fluention AI Voice Assistant Running"}
