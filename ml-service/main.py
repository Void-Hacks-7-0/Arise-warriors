# main.py
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import pickle
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from models import Transaction
from passlib.context import CryptContext

# -----------------------
# PASSWORD HASHING (SCRYPT) FIXED
# -----------------------
# Use default scrypt settings (compatible with current Passlib)
pwd_context = CryptContext(
    schemes=["scrypt"],  # or use ["bcrypt"] if you want more compatibility
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# Request models for password hashing endpoints
class PasswordInput(BaseModel):
    password: str

class VerifyInput(BaseModel):
    password: str
    hashed: str

# -----------------------
# CREATE APP
# -----------------------
app = FastAPI(title="Fraud Detection API (Two Models + Scrypt)")

# -----------------------
# CORS
# -----------------------
origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# LOAD MODELS
# -----------------------
model1 = pickle.load(open("model1/model.pkl", "rb"))
preprocessor1 = joblib.load("model1/preprocessor.joblib")
model2 = joblib.load("model2/fraud_detection_model.pkl")

# -----------------------
# PYDANTIC INPUT SCHEMAS
# -----------------------
class Model1Input(BaseModel):
    TX_AMOUNT: float
    TX_TIME_SECONDS: float
    TX_TIME_DAYS: float
    CUSTOMER_ID: int
    TERMINAL_ID: str
    TX_DATETIME: str  

class Model2Input(BaseModel):
    transaction_type: str
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float

# -----------------------
# PASSWORD HASHING ENDPOINTS
# -----------------------
@app.post("/hash-password")
def hash_pw(data: PasswordInput):
    return {"hashed": hash_password(data.password)}

@app.post("/verify-password")
def verify_pw(data: VerifyInput):
    ok = verify_password(data.password, data.hashed)
    return {"valid": ok}

# -----------------------
# MODEL 1 PREDICTION
# -----------------------
@app.post("/predict/model1")
def predict_model1(input_data: Model1Input, db: Session = Depends(get_db)):

    try:
        tx_dt = datetime.fromisoformat(input_data.TX_DATETIME)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid TX_DATETIME format: {e}")

    tx_hour = tx_dt.hour
    tx_weekday = tx_dt.weekday()

    df = pd.DataFrame([{
        "TX_AMOUNT": input_data.TX_AMOUNT,
        "TX_TIME_SECONDS": input_data.TX_TIME_SECONDS,
        "TX_TIME_DAYS": input_data.TX_TIME_DAYS,
        "CUSTOMER_ID": input_data.CUSTOMER_ID,
        "TERMINAL_ID": input_data.TERMINAL_ID,
        "tx_hour": tx_hour,
        "tx_weekday": tx_weekday
    }])

    transformed = preprocessor1.transform(df)
    prediction = model1.predict(transformed)[0]

    record = Transaction(
        model_type="model1",
        tx_amount=input_data.TX_AMOUNT,
        tx_time_seconds=input_data.TX_TIME_SECONDS,
        tx_time_days=input_data.TX_TIME_DAYS,
        customer_id=input_data.CUSTOMER_ID,
        terminal_id=input_data.TERMINAL_ID,
        tx_datetime=tx_dt,
        fraud=int(prediction)
    )

    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    return {
        "model": "model1",
        "fraud": int(prediction),
        "id": record.id,
        "created_at": str(record.created_at)
    }

# -----------------------
# MODEL 2 PREDICTION
# -----------------------
@app.post("/predict/model2")
def predict_model2(input_data: Model2Input, db: Session = Depends(get_db)):

    df = pd.DataFrame([{
        "type": input_data.transaction_type,
        "amount": input_data.amount,
        "oldbalanceOrg": input_data.oldbalanceOrg,
        "newbalanceOrig": input_data.newbalanceOrig,
        "oldbalanceDest": input_data.oldbalanceDest,
        "newbalanceDest": input_data.newbalanceDest
    }])

    prediction = model2.predict(df)[0]

    record = Transaction(
        model_type="model2",
        transaction_type=input_data.transaction_type,
        amount=input_data.amount,
        oldbalance_org=input_data.oldbalanceOrg,
        newbalance_orig=input_data.newbalanceOrig,
        oldbalance_dest=input_data.oldbalanceDest,
        newbalance_dest=input_data.newbalanceDest,
        fraud=int(prediction)
    )

    try:
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    return {
        "model": "model2",
        "fraud": int(prediction),
        "id": record.id,
        "created_at": str(record.created_at)
    }

# -----------------------
# ROOT
# -----------------------
@app.get("/")
def home():
    return {"message": "Fraud Detection API with Scrypt Running Successfully!"}
