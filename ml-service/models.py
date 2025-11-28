# models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid

# --------------------------
# USERS TABLE
# --------------------------
class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    accounts = relationship("Account", back_populates="user", cascade="all, delete")
    transactions = relationship("UserTransaction", back_populates="user", cascade="all, delete")
    login_logs = relationship("LoginLog", back_populates="user", cascade="all, delete")


# --------------------------
# ACCOUNTS TABLE
# --------------------------
class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    account_number = Column(String(20), unique=True, nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationship
    user = relationship("User", back_populates="accounts")


# --------------------------
# TRANSACTIONS TABLE (ML MODEL RESULTS)
# --------------------------
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    model_type = Column(String(10), nullable=False)

    # Model 1 fields
    tx_amount = Column(Float, nullable=True)
    tx_time_seconds = Column(Float, nullable=True)
    tx_time_days = Column(Float, nullable=True)
    customer_id = Column(Integer, nullable=True)
    terminal_id = Column(String(50), nullable=True)
    tx_datetime = Column(DateTime, nullable=True)

    # Model 2 fields
    transaction_type = Column("type", String(20), nullable=True)
    amount = Column(Float, nullable=True)
    oldbalance_org = Column(Float, nullable=True)
    newbalance_orig = Column(Float, nullable=True)
    oldbalance_dest = Column(Float, nullable=True)
    newbalance_dest = Column(Float, nullable=True)

    # Prediction output
    fraud = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # link to user transaction table
    user_link = relationship("UserTransaction", back_populates="transaction")


# --------------------------
# USER TRANSACTION HISTORY (Dashboard)
# --------------------------
class UserTransaction(Base):
    __tablename__ = "user_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    amount = Column(Float, nullable=False)
    fraud = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")
    transaction = relationship("Transaction", back_populates="user_link")


# --------------------------
# LOGIN LOGS TABLE
# --------------------------
class LoginLog(Base):
    __tablename__ = "login_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    ip_address = Column(String(50), nullable=True)
    status = Column(String(20), nullable=False)  # success / failed
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="login_logs")
