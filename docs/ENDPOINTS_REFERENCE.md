# API Endpoints Reference

Quick reference for all available endpoints.

---

## Base URL
```
http://localhost:3000/api/v1
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login and get token |
| GET | `/auth/me` | Yes | Get current user info |

---

## 💰 Transaction Endpoints

| # | Method | Endpoint | Auth | Query Params | Description |
|---|--------|----------|------|--------------|-------------|
| 1 | POST | `/transaction` | Yes | - | Create new transaction |
| 2 | GET | `/transaction/balance` | Yes | - | Get balance summary |
| 3 | GET | `/transaction/recent` | Yes | `limit` (optional) | Get recent transactions |
| 4 | GET | `/transaction/all` | Yes | - | Get all transactions |
| 5 | GET | `/transaction/filter` | Yes | `period` (required) | Filter by week/month/year |
| 6 | GET | `/transaction/category` | Yes | `category` (required) | Filter by category |
| 7 | GET | `/transaction/top-spending-day` | Yes | `period` (required) | Get highest spending day |
| 8 | GET | `/transaction/avg-spending` | Yes | `period` (required) | Get average daily spending |
| 9 | GET | `/transaction/most-used-categories` | Yes | `period`, `limit` | Get top categories |
| 10 | GET | `/transaction/saving-rate` | Yes | `period` (required) | Get saving rate % |
| 11 | GET | `/transaction/income-vs-expense` | Yes | `period` (required) | Compare income & expense |
| 12 | GET | `/transaction/spending-analysis` | Yes | `period` (required) | Detailed spending breakdown |

---

## 🎯 Goal Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/goal/savings` | Yes | Get saving goals |
| PUT | `/goal/savings` | Yes | Update saving goals |

---

## Request Examples

### 1. Sign Up
```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "token": "eyJhbGc..."
  }
}
```

### 3. Create Transaction
```bash
POST /api/v1/transaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "type": "withdrawal",
  "category": "Food",
  "date": "2026-01-02",
  "description": "Lunch"
}
```

### 4. Get Balance
```bash
GET /api/v1/transaction/balance
Authorization: Bearer <token>

Response:
{
  "totalIncome": 10000,
  "totalExpense": 4500,
  "savings": 5500,
  "balance": 5500
}
```

### 5. Get Recent Transactions
```bash
GET /api/v1/transaction/recent?limit=5
Authorization: Bearer <token>
```

### 6. Filter by Period
```bash
GET /api/v1/transaction/filter?period=month
Authorization: Bearer <token>
```

### 7. Filter by Category
```bash
GET /api/v1/transaction/category?category=Food
Authorization: Bearer <token>
```

### 8. Top Spending Day
```bash
GET /api/v1/transaction/top-spending-day?period=month
Authorization: Bearer <token>

Response:
{
  "date": "2026-01-15",
  "amount": 1500
}
```

### 9. Average Spending
```bash
GET /api/v1/transaction/avg-spending?period=month
Authorization: Bearer <token>

Response:
{
  "avgSpending": 150.50,
  "previousAvgSpending": 120.30,
  "percentageChange": 25.10
}
```

### 10. Most Used Categories
```bash
GET /api/v1/transaction/most-used-categories?period=month&limit=5
Authorization: Bearer <token>

Response:
[
  {
    "category": "Food",
    "count": 45,
    "totalAmount": 5400.00
  }
]
```

### 11. Saving Rate
```bash
GET /api/v1/transaction/saving-rate?period=month
Authorization: Bearer <token>

Response:
{
  "savingRate": 45.50,
  "totalIncome": 10000,
  "totalExpense": 5450
}
```

### 12. Income vs Expense
```bash
GET /api/v1/transaction/income-vs-expense?period=month
Authorization: Bearer <token>

Response:
{
  "income": 10000,
  "expense": 5450,
  "difference": 4550
}
```

### 13. Spending Analysis
```bash
GET /api/v1/transaction/spending-analysis?period=month
Authorization: Bearer <token>

Response:
{
  "totalSpending": 5450,
  "avgDailySpending": 175.81,
  "categoryBreakdown": [
    {
      "category": "Food",
      "amount": 2500,
      "percentage": 45.87
    }
  ],
  "topSpendingDay": {
    "date": "2026-01-15",
    "amount": 1500
  }
}
```

### 14. Get Saving Goals
```bash
GET /api/v1/goal/savings
Authorization: Bearer <token>

Response:
{
  "monthly_goal": 5000,
  "yearly_goal": 60000
}
```

### 15. Update Saving Goals
```bash
PUT /api/v1/goal/savings
Authorization: Bearer <token>
Content-Type: application/json

{
  "monthly_goal": 5000,
  "yearly_goal": 60000
}
```

---

## Valid Values

### Transaction Types
- `deposit` - Income/money added
- `withdrawal` - Expense/money spent

### Categories
- `Food` - Restaurant, groceries, etc.
- `Transport` - Bus, taxi, fuel, etc.
- `Rent` - Monthly rent
- `Shopping` - Clothes, electronics, etc.
- `Other` - Miscellaneous
- `Income` - For deposits only

### Period Values
- `week` - Current week (Monday to Sunday)
- `month` - Current month
- `year` - Current year

---

## Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Common Headers

### All Requests
```
Content-Type: application/json
```

### Authenticated Requests
```
Authorization: Bearer <your-jwt-token>
```

---

## Query Parameters Reference

| Endpoint | Parameter | Type | Required | Values | Default |
|----------|-----------|------|----------|--------|---------|
| `/transaction/recent` | `limit` | number | No | 1-100 | 10 |
| `/transaction/filter` | `period` | string | Yes | week, month, year | - |
| `/transaction/category` | `category` | string | Yes | Food, Transport, etc. | - |
| `/transaction/top-spending-day` | `period` | string | Yes | week, month, year | - |
| `/transaction/avg-spending` | `period` | string | Yes | week, month, year | - |
| `/transaction/most-used-categories` | `period` | string | No | week, month, year | all time |
| `/transaction/most-used-categories` | `limit` | number | No | 1-10 | 5 |
| `/transaction/saving-rate` | `period` | string | Yes | week, month, year | - |
| `/transaction/income-vs-expense` | `period` | string | Yes | week, month, year | - |
| `/transaction/spending-analysis` | `period` | string | Yes | week, month, year | - |

---

## Quick Test Commands

### Setup
```bash
# 1. Start server
npm run dev

# 2. Sign up
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"password123"}'

# 3. Login and save token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Save the token as environment variable
export TOKEN="your-token-here"
```

### Test Transactions
```bash
# Add income
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":10000,"type":"deposit","category":"Income","date":"2026-01-01"}'

# Add expense
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":500,"type":"withdrawal","category":"Food","date":"2026-01-02"}'

# Check balance
curl http://localhost:3000/api/v1/transaction/balance \
  -H "Authorization: Bearer $TOKEN"

# Get analysis
curl "http://localhost:3000/api/v1/transaction/spending-analysis?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Expense Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Tips

1. **Save your token** after login for subsequent requests
2. **Use environment variables** in Postman/Insomnia
3. **Check response status codes** for debugging
4. **Date format**: Always use `YYYY-MM-DD`
5. **Categories are case-sensitive**: Use `Food` not `food`
6. **Types are lowercase**: Use `deposit` not `Deposit`

---

**For detailed examples, see `TESTING_GUIDE.md`**
**For architecture details, see `ARCHITECTURE_DIAGRAM.md`**
**For complete documentation, see `API_DOCUMENTATION.md`**
