from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 days

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= Models =============

# Auth Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# Income Models
class IncomeCreate(BaseModel):
    amount: float
    source: str
    category: str
    date: str
    description: Optional[str] = ""

class Income(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    source: str
    category: str
    date: str
    description: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Expense Models
class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: str
    description: Optional[str] = ""

class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    category: str
    date: str
    description: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Budget Models
class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float
    year: int
    month: int

class Budget(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: str
    monthly_limit: float
    year: int
    month: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Savings Goal Models
class SavingsGoalCreate(BaseModel):
    title: str
    target_amount: float
    current_amount: float = 0
    deadline: str

class SavingsGoal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    target_amount: float
    current_amount: float
    deadline: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SavingsGoalUpdate(BaseModel):
    current_amount: float

# Contact Models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

# ============= Auth Utilities =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= Routes =============

# Auth Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(name=user_data.name, email=user_data.email)
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['password'] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    return TokenResponse(access_token=access_token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc or not verify_password(login_data.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create user object
    user = User(
        id=user_doc['id'],
        name=user_doc['name'],
        email=user_doc['email'],
        created_at=datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
    )
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    return TokenResponse(access_token=access_token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    return User(**user_doc)

# Income Routes
@api_router.post("/incomes", response_model=Income)
async def create_income(income_data: IncomeCreate, user_id: str = Depends(get_current_user)):
    income = Income(user_id=user_id, **income_data.model_dump())
    income_dict = income.model_dump()
    income_dict['created_at'] = income_dict['created_at'].isoformat()
    
    await db.incomes.insert_one(income_dict)
    return income

@api_router.get("/incomes", response_model=List[Income])
async def get_incomes(user_id: str = Depends(get_current_user)):
    incomes = await db.incomes.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for income in incomes:
        if isinstance(income['created_at'], str):
            income['created_at'] = datetime.fromisoformat(income['created_at'])
    return incomes

@api_router.delete("/incomes/{income_id}")
async def delete_income(income_id: str, user_id: str = Depends(get_current_user)):
    result = await db.incomes.delete_one({"id": income_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Income not found")
    return {"message": "Income deleted successfully"}

# Expense Routes
@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate, user_id: str = Depends(get_current_user)):
    expense = Expense(user_id=user_id, **expense_data.model_dump())
    expense_dict = expense.model_dump()
    expense_dict['created_at'] = expense_dict['created_at'].isoformat()
    
    await db.expenses.insert_one(expense_dict)
    return expense

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(user_id: str = Depends(get_current_user)):
    expenses = await db.expenses.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for expense in expenses:
        if isinstance(expense['created_at'], str):
            expense['created_at'] = datetime.fromisoformat(expense['created_at'])
    return expenses

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str, user_id: str = Depends(get_current_user)):
    result = await db.expenses.delete_one({"id": expense_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

# Budget Routes
@api_router.post("/budgets", response_model=Budget)
async def create_budget(budget_data: BudgetCreate, user_id: str = Depends(get_current_user)):
    # Check if budget already exists for this category, month, and year
    existing = await db.budgets.find_one({
        "user_id": user_id,
        "category": budget_data.category,
        "year": budget_data.year,
        "month": budget_data.month
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Budget already exists for this category and month")
    
    budget = Budget(user_id=user_id, **budget_data.model_dump())
    budget_dict = budget.model_dump()
    budget_dict['created_at'] = budget_dict['created_at'].isoformat()
    
    await db.budgets.insert_one(budget_dict)
    return budget

@api_router.get("/budgets", response_model=List[Budget])
async def get_budgets(user_id: str = Depends(get_current_user), year: Optional[int] = None, month: Optional[int] = None):
    query = {"user_id": user_id}
    if year:
        query["year"] = year
    if month:
        query["month"] = month
    
    budgets = await db.budgets.find(query, {"_id": 0}).to_list(1000)
    for budget in budgets:
        if isinstance(budget['created_at'], str):
            budget['created_at'] = datetime.fromisoformat(budget['created_at'])
    return budgets

@api_router.put("/budgets/{budget_id}", response_model=Budget)
async def update_budget(budget_id: str, budget_data: BudgetCreate, user_id: str = Depends(get_current_user)):
    result = await db.budgets.update_one(
        {"id": budget_id, "user_id": user_id},
        {"$set": budget_data.model_dump()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    updated_budget = await db.budgets.find_one({"id": budget_id}, {"_id": 0})
    if isinstance(updated_budget['created_at'], str):
        updated_budget['created_at'] = datetime.fromisoformat(updated_budget['created_at'])
    return Budget(**updated_budget)

@api_router.delete("/budgets/{budget_id}")
async def delete_budget(budget_id: str, user_id: str = Depends(get_current_user)):
    result = await db.budgets.delete_one({"id": budget_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted successfully"}

# Savings Goal Routes
@api_router.post("/savings-goals", response_model=SavingsGoal)
async def create_savings_goal(goal_data: SavingsGoalCreate, user_id: str = Depends(get_current_user)):
    goal = SavingsGoal(user_id=user_id, **goal_data.model_dump())
    goal_dict = goal.model_dump()
    goal_dict['created_at'] = goal_dict['created_at'].isoformat()
    
    await db.savings_goals.insert_one(goal_dict)
    return goal

@api_router.get("/savings-goals", response_model=List[SavingsGoal])
async def get_savings_goals(user_id: str = Depends(get_current_user)):
    goals = await db.savings_goals.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for goal in goals:
        if isinstance(goal['created_at'], str):
            goal['created_at'] = datetime.fromisoformat(goal['created_at'])
    return goals

@api_router.put("/savings-goals/{goal_id}", response_model=SavingsGoal)
async def update_savings_goal(goal_id: str, goal_data: SavingsGoalUpdate, user_id: str = Depends(get_current_user)):
    result = await db.savings_goals.update_one(
        {"id": goal_id, "user_id": user_id},
        {"$set": {"current_amount": goal_data.current_amount}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    
    updated_goal = await db.savings_goals.find_one({"id": goal_id}, {"_id": 0})
    if isinstance(updated_goal['created_at'], str):
        updated_goal['created_at'] = datetime.fromisoformat(updated_goal['created_at'])
    return SavingsGoal(**updated_goal)

@api_router.delete("/savings-goals/{goal_id}")
async def delete_savings_goal(goal_id: str, user_id: str = Depends(get_current_user)):
    result = await db.savings_goals.delete_one({"id": goal_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return {"message": "Savings goal deleted successfully"}

# Dashboard Stats
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    # Get current month and year
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year
    
    # Total income
    incomes = await db.incomes.find({"user_id": user_id}).to_list(1000)
    total_income = sum(income['amount'] for income in incomes)
    
    # Total expenses
    expenses = await db.expenses.find({"user_id": user_id}).to_list(1000)
    total_expenses = sum(expense['amount'] for expense in expenses)
    
    # Monthly expenses
    monthly_expenses = sum(
        expense['amount'] for expense in expenses
        if expense['date'].startswith(f"{current_year}-{current_month:02d}")
    )
    
    # Savings goals progress
    goals = await db.savings_goals.find({"user_id": user_id}).to_list(1000)
    total_savings_target = sum(goal['target_amount'] for goal in goals)
    total_savings_current = sum(goal['current_amount'] for goal in goals)
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": total_income - total_expenses,
        "monthly_expenses": monthly_expenses,
        "total_savings_target": total_savings_target,
        "total_savings_current": total_savings_current,
        "savings_goals_count": len(goals)
    }

# Contact Route
@api_router.post("/contact")
async def submit_contact(contact_data: ContactMessage):
    contact_dict = contact_data.model_dump()
    contact_dict['id'] = str(uuid.uuid4())
    contact_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.contact_messages.insert_one(contact_dict)
    return {"message": "Message received successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()