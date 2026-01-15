# 🚀 Quick Start Guide

Get your Student Expense Tracking API up and running in 5 minutes!

---

## Prerequisites

- ✅ Node.js installed (v18+)
- ✅ MongoDB running (locally or cloud)
- ✅ Git installed

---

## Step 1: Verify Installation

All dependencies are already installed, but if you need to reinstall:

```bash
cd /home/nitesh/.cursor/worktrees/expense_analyzer/nky
npm install
```

---

## Step 2: Environment Setup

Make sure your `.env` file is configured:

```bash
# Copy example if needed
cp .env.example .env

# Edit .env file with your settings
nano .env
```

Required environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
NODE_ENV=development
```

---

## Step 3: Generate JWT Keys (if not already done)

```bash
npm run generate-keys
```

This creates RSA key pairs in the `keys/` directory.

---

## Step 4: Start MongoDB

### Local MongoDB
```bash
mongod --dbpath /path/to/your/data
```

### MongoDB in Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)
Update `MONGODB_URI` in `.env` with your Atlas connection string.

---

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
Server running on port 3000
MongoDB connected successfully
```

---

## Step 6: Test the API

### Option 1: Using cURL

Open a new terminal and run:

```bash
# Test health (if you have a health endpoint)
curl http://localhost:3000

# Sign up a new user
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Option 2: Using Postman

1. Import the API collection (see `TESTING_GUIDE.md`)
2. Create a new environment with:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (will be set after login)

---

## Step 7: Complete Workflow Test

### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "User created successfully",
  "data": {
    "id": "...",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "User Logged in successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**IMPORTANT:** Save the token for next requests!

### 3. Add Income Transaction
```bash
TOKEN="paste_your_token_here"

curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 10000,
    "type": "deposit",
    "category": "Income",
    "date": "2026-01-01",
    "description": "Monthly allowance"
  }'
```

### 4. Add Expense Transactions
```bash
# Food expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 500,
    "type": "withdrawal",
    "category": "Food",
    "date": "2026-01-02",
    "description": "Lunch"
  }'

# Transport expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 200,
    "type": "withdrawal",
    "category": "Transport",
    "date": "2026-01-02",
    "description": "Uber"
  }'

# Shopping expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 1500,
    "type": "withdrawal",
    "category": "Shopping",
    "date": "2026-01-03",
    "description": "New shoes"
  }'
```

### 5. Check Balance
```bash
curl http://localhost:3000/api/v1/transaction/balance \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Balance fetched successfully",
  "data": {
    "totalIncome": 10000,
    "totalExpense": 2200,
    "savings": 7800,
    "balance": 7800
  }
}
```

### 6. Get Recent Transactions
```bash
curl http://localhost:3000/api/v1/transaction/recent \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Spending Analysis
```bash
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Spending analysis fetched successfully",
  "data": {
    "totalSpending": 2200,
    "avgDailySpending": 73.33,
    "categoryBreakdown": [
      {
        "category": "Shopping",
        "amount": 1500,
        "percentage": 68.18
      },
      {
        "category": "Food",
        "amount": 500,
        "percentage": 22.73
      },
      {
        "category": "Transport",
        "amount": 200,
        "percentage": 9.09
      }
    ],
    "topSpendingDay": {
      "date": "2026-01-03",
      "amount": 1500
    }
  }
}
```

### 8. Set Saving Goals
```bash
curl -X PUT http://localhost:3000/api/v1/goal/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "monthly_goal": 5000,
    "yearly_goal": 60000
  }'
```

---

## Common Issues & Solutions

### Issue 1: "Connection refused" or "ECONNREFUSED"
**Problem:** MongoDB is not running

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /path/to/data

# Or with Docker
docker start mongodb
```

### Issue 2: "Token is required" or "Invalid token"
**Problem:** Authorization header not set correctly

**Solution:**
```bash
# Make sure you use this format:
-H "Authorization: Bearer YOUR_TOKEN_HERE"

# NOT:
-H "Authorization: YOUR_TOKEN_HERE"
```

### Issue 3: "User already exists"
**Problem:** Email is already registered

**Solution:**
- Use a different email
- Or login with existing credentials

### Issue 4: Port already in use
**Problem:** Port 3000 is occupied

**Solution:**
```bash
# Change port in .env
PORT=3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue 5: "Module not found: date-fns"
**Problem:** Dependencies not installed

**Solution:**
```bash
npm install
```

---

## Testing All Endpoints

Use the `TESTING_GUIDE.md` file for comprehensive examples of all 15 endpoints:

```bash
# View the testing guide
cat TESTING_GUIDE.md

# Or use your favorite markdown viewer
```

---

## Development Tips

### 1. Auto-restart on Changes
The server already uses `--watch` flag, so it restarts automatically on file changes.

### 2. View Logs
```bash
# Server logs are displayed in the terminal
# Add custom logging as needed
```

### 3. MongoDB GUI Tools
- **MongoDB Compass**: Visual interface for MongoDB
- **Studio 3T**: Advanced MongoDB client
- **Robo 3T**: Lightweight MongoDB client

### 4. API Testing Tools
- **Postman**: Full-featured API client
- **Insomnia**: Simple REST client
- **Thunder Client**: VS Code extension
- **cURL**: Command-line tool

### 5. Check Database
```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use expense_tracker

# View collections
show collections

# View transactions
db.transactions.find().pretty()

# View users
db.users.find().pretty()

# View saving goals
db.savinggoals.find().pretty()
```

---

## Next Steps

### 1. Explore All Endpoints
Check `API_DOCUMENTATION.md` for all 15 endpoints with detailed examples.

### 2. Understand Architecture
Read `ARCHITECTURE_DIAGRAM.md` to understand the code structure.

### 3. Review Implementation
Check `IMPLEMENTATION_SUMMARY.md` to see how requirements map to code.

### 4. Add More Features
- Transaction editing
- Transaction deletion
- Custom date ranges
- Budget limits
- Recurring transactions

---

## Production Checklist

Before deploying to production:

- [ ] Change JWT secret keys
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific MongoDB URI
- [ ] Enable CORS for your domain only
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Add health check endpoint
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger UI)
- [ ] Implement data backup strategy
- [ ] Add HTTPS/SSL certificate

---

## Useful Commands

```bash
# Start development server
npm run dev

# Format code
npm run format:fix

# Check linting
npm run lint:check

# Fix linting issues
npm run lint:fix

# Generate new JWT keys
npm run generate-keys
```

---

## Getting Help

### Documentation Files
- `API_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `TESTING_GUIDE.md` - Testing examples
- `ARCHITECTURE_DIAGRAM.md` - Visual architecture
- `COMPLETION_SUMMARY.md` - Overview

### Code Structure
```
src/features/transaction/
├── entities/       # Domain models
├── models/         # Database schemas
├── dtos/           # Data transfer objects
├── mappers/        # Entity-Model conversion
├── repositories/   # Data access
├── services/       # Business logic
├── controllers/    # HTTP handlers
├── routes/         # Endpoint definitions
├── validations/    # Request validation
└── interfaces/     # TypeScript contracts
```

---

## Success Indicators

You know everything is working when:

1. ✅ Server starts without errors
2. ✅ MongoDB connection successful
3. ✅ User signup returns 200 status
4. ✅ Login returns JWT token
5. ✅ Create transaction returns 200 status
6. ✅ Balance shows correct amounts
7. ✅ Analytics endpoints return data

---

**You're all set! Happy coding! 🎉**

For detailed endpoint usage, refer to `TESTING_GUIDE.md`.
For architecture understanding, refer to `ARCHITECTURE_DIAGRAM.md`.
For complete API reference, refer to `API_DOCUMENTATION.md`.
