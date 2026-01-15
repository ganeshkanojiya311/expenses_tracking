# Expense Tracker API - Quick Test Guide

This file contains example requests for testing all API endpoints.

## Base URL
```
http://localhost:3000/api/v1
```

---

## 🔐 Authentication Flow

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

### 2. Login (Get Token)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response will include a token - save it for next requests:**
```json
{
  "statusCode": 200,
  "message": "User Logged in successfully",
  "data": {
    "user": {...},
    "token": "YOUR_JWT_TOKEN_HERE"
  }
}
```

### 3. Get Current User
```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💰 Transaction APIs

**Note: Replace `YOUR_TOKEN` with the actual token from login**

### 1. Create Transaction (Expense)
```bash
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 500,
    "type": "withdrawal",
    "category": "Food",
    "date": "2026-01-02",
    "description": "Lunch at restaurant"
  }'
```

### 2. Create Transaction (Income)
```bash
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 5000,
    "type": "deposit",
    "category": "Income",
    "date": "2026-01-01",
    "description": "Monthly allowance"
  }'
```

### 3. Create Multiple Sample Transactions
```bash
# Transport expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 200, "type": "withdrawal", "category": "Transport", "date": "2026-01-03"}'

# Shopping expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 1500, "type": "withdrawal", "category": "Shopping", "date": "2026-01-05"}'

# Rent expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 3000, "type": "withdrawal", "category": "Rent", "date": "2026-01-01"}'
```

### 4. Get Balance
```bash
curl http://localhost:3000/api/v1/transaction/balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Recent Transactions
```bash
# Default (10 transactions)
curl http://localhost:3000/api/v1/transaction/recent \
  -H "Authorization: Bearer YOUR_TOKEN"

# With limit
curl "http://localhost:3000/api/v1/transaction/recent?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get All Transactions
```bash
curl http://localhost:3000/api/v1/transaction/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Filter by Period
```bash
# This week
curl "http://localhost:3000/api/v1/transaction/filter?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This month
curl "http://localhost:3000/api/v1/transaction/filter?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This year
curl "http://localhost:3000/api/v1/transaction/filter?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Filter by Category
```bash
# Food expenses
curl "http://localhost:3000/api/v1/transaction/category?category=Food" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Transport expenses
curl "http://localhost:3000/api/v1/transaction/category?category=Transport" \
  -H "Authorization: Bearer YOUR_TOKEN"

# All categories: Food, Transport, Rent, Shopping, Other, Income
```

### 9. Top Spending Day
```bash
# This week
curl "http://localhost:3000/api/v1/transaction/top-spending-day?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This month
curl "http://localhost:3000/api/v1/transaction/top-spending-day?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This year
curl "http://localhost:3000/api/v1/transaction/top-spending-day?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10. Average Spending
```bash
# Weekly average
curl "http://localhost:3000/api/v1/transaction/avg-spending?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monthly average
curl "http://localhost:3000/api/v1/transaction/avg-spending?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yearly average
curl "http://localhost:3000/api/v1/transaction/avg-spending?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 11. Most Used Categories
```bash
# All time (default top 5)
curl "http://localhost:3000/api/v1/transaction/most-used-categories" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This month, top 3
curl "http://localhost:3000/api/v1/transaction/most-used-categories?period=month&limit=3" \
  -H "Authorization: Bearer YOUR_TOKEN"

# This year, top 10
curl "http://localhost:3000/api/v1/transaction/most-used-categories?period=year&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 12. Saving Rate
```bash
# Weekly saving rate
curl "http://localhost:3000/api/v1/transaction/saving-rate?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monthly saving rate
curl "http://localhost:3000/api/v1/transaction/saving-rate?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yearly saving rate
curl "http://localhost:3000/api/v1/transaction/saving-rate?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 13. Income vs Expense
```bash
# Weekly comparison
curl "http://localhost:3000/api/v1/transaction/income-vs-expense?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monthly comparison
curl "http://localhost:3000/api/v1/transaction/income-vs-expense?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yearly comparison
curl "http://localhost:3000/api/v1/transaction/income-vs-expense?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 14. Spending Analysis
```bash
# Weekly analysis
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monthly analysis
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yearly analysis
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Saving Goal APIs

### 1. Get Saving Goal
```bash
curl http://localhost:3000/api/v1/goal/savings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Update Saving Goal
```bash
curl -X PUT http://localhost:3000/api/v1/goal/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "monthly_goal": 5000,
    "yearly_goal": 60000
  }'
```

### 3. Update Only Monthly Goal
```bash
curl -X PUT http://localhost:3000/api/v1/goal/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "monthly_goal": 3000
  }'
```

### 4. Update Only Yearly Goal
```bash
curl -X PUT http://localhost:3000/api/v1/goal/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "yearly_goal": 50000
  }'
```

---

## 📊 Sample Workflow

### Step 1: Setup User Account
```bash
# 1. Sign up
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "password123"}'

# 2. Login and save the token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Save the token from response as TOKEN variable
TOKEN="YOUR_ACTUAL_TOKEN_HERE"
```

### Step 2: Add Sample Data
```bash
# Add income
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 10000, "type": "deposit", "category": "Income", "date": "2026-01-01"}'

# Add expenses
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 500, "type": "withdrawal", "category": "Food", "date": "2026-01-02"}'

curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 200, "type": "withdrawal", "category": "Transport", "date": "2026-01-03"}'
```

### Step 3: Set Saving Goals
```bash
curl -X PUT http://localhost:3000/api/v1/goal/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"monthly_goal": 5000, "yearly_goal": 60000}'
```

### Step 4: Check Analytics
```bash
# Check balance
curl http://localhost:3000/api/v1/transaction/balance \
  -H "Authorization: Bearer $TOKEN"

# Monthly spending analysis
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=month" \
  -H "Authorization: Bearer $TOKEN"

# Saving rate
curl "http://localhost:3000/api/v1/transaction/saving-rate?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Testing Tips

1. **Use a REST client** like Postman, Insomnia, or Thunder Client for easier testing
2. **Set environment variables** for base URL and token
3. **Create a collection** with all endpoints
4. **Add realistic data** with various dates and categories
5. **Test edge cases**:
   - Empty transactions
   - Single category usage
   - Period with no transactions
   - Very high/low amounts

---

## 📝 Important Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- Token expires after 30 days
- All monetary values are in your base currency (no currency specified)
- Categories are case-sensitive: `Food` not `food`
- Transaction types: `deposit` or `withdrawal` (lowercase)
- Periods: `week`, `month`, `year` (lowercase)

---

## 🐛 Troubleshooting

### "Token is required" or "Invalid token"
- Check if Authorization header is set correctly
- Format: `Authorization: Bearer YOUR_TOKEN`
- Make sure token hasn't expired

### "User already exists"
- Email is already registered
- Use a different email or login with existing credentials

### "Invalid period"
- Use: `week`, `month`, or `year`
- Check spelling and case (lowercase)

### "Invalid category"
- Valid categories: `Food`, `Transport`, `Rent`, `Shopping`, `Other`, `Income`
- Categories are case-sensitive

### "Amount must be greater than 0"
- Amount should be a positive number
- Don't use negative values

---

**Happy Testing! 🚀**
