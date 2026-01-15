# Student Expense Tracking Platform - API Documentation

A comprehensive backend API for tracking student expenses, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 JWT-based authentication
- 💰 Transaction management (deposits & withdrawals)
- 📊 Detailed spending analysis
- 🎯 Saving goals tracking
- 📈 Income vs expense comparison
- 📅 Time-based filtering (week, month, year)
- 🏷️ Category-based expense tracking

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with RSA keys
- **Validation**: Joi
- **Date Manipulation**: date-fns

## Project Structure

```
src/
├── features/
│   ├── auth/                    # Authentication module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── models/
│   │   ├── dtos/
│   │   ├── mappers/
│   │   ├── validations/
│   │   ├── routes/
│   │   └── interfaces/
│   └── transaction/             # Transaction & Goal module
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── entities/
│       ├── models/
│       ├── dtos/
│       ├── mappers/
│       ├── validations/
│       ├── routes/
│       └── interfaces/
├── core/                        # Core utilities (JWT, ApiError, ApiResponse)
├── helpers/                     # Helper functions (authentication, validator)
└── routers/                     # API version routers
```

## API Endpoints

### Authentication

#### 1. Sign Up
- **Endpoint**: `POST /api/v1/auth/signup`
- **Description**: Register a new user
- **Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### 2. Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Login user and get JWT token
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
- **Endpoint**: `GET /api/v1/auth/me`
- **Description**: Get authenticated user details
- **Headers**: `Authorization: Bearer <token>`

---

### Transaction APIs

#### 1. Create Transaction
- **Endpoint**: `POST /api/v1/transaction`
- **Description**: Add a new transaction (deposit or withdrawal)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "amount": 500,
  "type": "withdrawal",
  "category": "Food",
  "date": "2026-01-02",
  "description": "Lunch at restaurant"
}
```
- **Types**: `deposit`, `withdrawal`
- **Categories**: `Food`, `Transport`, `Rent`, `Shopping`, `Other`, `Income`

#### 2. Get Balance
- **Endpoint**: `GET /api/v1/transaction/balance`
- **Description**: Get total income, expense, savings, and balance
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "totalIncome": 10000,
  "totalExpense": 4500,
  "savings": 5500,
  "balance": 5500
}
```

#### 3. Get Recent Transactions
- **Endpoint**: `GET /api/v1/transaction/recent?limit=10`
- **Description**: Get recent transactions
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit` (optional): Number of transactions (default: 10)

#### 4. Get All Transactions
- **Endpoint**: `GET /api/v1/transaction/all`
- **Description**: Get all user transactions
- **Headers**: `Authorization: Bearer <token>`

#### 5. Filter Transactions by Period
- **Endpoint**: `GET /api/v1/transaction/filter?period=month`
- **Description**: Get transactions filtered by time period
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`

#### 6. Filter Transactions by Category
- **Endpoint**: `GET /api/v1/transaction/category?category=Food`
- **Description**: Get transactions by category
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `category` (required): `Food`, `Transport`, `Rent`, `Shopping`, `Other`, `Income`

#### 7. Get Top Spending Day
- **Endpoint**: `GET /api/v1/transaction/top-spending-day?period=month`
- **Description**: Get the day with highest spending
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`
- **Response**:
```json
{
  "date": "2026-01-15",
  "amount": 1500
}
```

#### 8. Get Average Spending
- **Endpoint**: `GET /api/v1/transaction/avg-spending?period=month`
- **Description**: Get average daily spending with comparison to previous period
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`
- **Response**:
```json
{
  "avgSpending": 150.50,
  "previousAvgSpending": 120.30,
  "percentageChange": 25.10
}
```

#### 9. Get Most Used Categories
- **Endpoint**: `GET /api/v1/transaction/most-used-categories?period=month&limit=5`
- **Description**: Get most frequently used categories
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (optional): `week`, `month`, or `year`
  - `limit` (optional): Number of categories (default: 5)
- **Response**:
```json
[
  {
    "category": "Food",
    "count": 45,
    "totalAmount": 5400.00
  }
]
```

#### 10. Get Saving Rate
- **Endpoint**: `GET /api/v1/transaction/saving-rate?period=month`
- **Description**: Get percentage of income saved
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`
- **Response**:
```json
{
  "savingRate": 45.50,
  "totalIncome": 10000.00,
  "totalExpense": 5450.00
}
```

#### 11. Get Income vs Expense
- **Endpoint**: `GET /api/v1/transaction/income-vs-expense?period=month`
- **Description**: Compare income and expense
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`
- **Response**:
```json
{
  "income": 10000.00,
  "expense": 5450.00,
  "difference": 4550.00
}
```

#### 12. Get Spending Analysis
- **Endpoint**: `GET /api/v1/transaction/spending-analysis?period=month`
- **Description**: Get detailed spending analysis
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (required): `week`, `month`, or `year`
- **Response**:
```json
{
  "totalSpending": 5450.00,
  "avgDailySpending": 180.67,
  "categoryBreakdown": [
    {
      "category": "Food",
      "amount": 2500.00,
      "percentage": 45.87
    }
  ],
  "topSpendingDay": {
    "date": "2026-01-15",
    "amount": 1500.00
  }
}
```

---

### Saving Goal APIs

#### 1. Get Saving Goal
- **Endpoint**: `GET /api/v1/goal/savings`
- **Description**: Get user's monthly and yearly saving goals
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "monthly_goal": 5000,
  "yearly_goal": 60000
}
```

#### 2. Update Saving Goal
- **Endpoint**: `PUT /api/v1/goal/savings`
- **Description**: Update saving goals
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "monthly_goal": 5000,
  "yearly_goal": 60000
}
```

---

## Architecture Patterns

### 1. **Layered Architecture**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and orchestration
- **Repositories**: Data access layer
- **Entities**: Domain models
- **DTOs**: Data transfer objects with validation
- **Mappers**: Convert between entities and database models

### 2. **Validation Strategy**
- **Schema Validation**: Joi schemas for request validation
- **DTO Validation**: Custom validation in DTO classes
- **Service Validation**: Business rule validation

### 3. **Error Handling**
- Centralized error handling with custom error classes
- `BadRequestError`, `NotFoundError`, `AuthFailureError`
- Consistent error response format

### 4. **Response Format**
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

## Installation

```bash
# Install dependencies
npm install

# Generate RSA keys for JWT
npm run generate-keys

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
NODE_ENV=development
```

## Key Features Implementation

### Date-based Filtering
- Uses `date-fns` for robust date manipulation
- Supports week, month, and year periods
- Compares current period with previous period

### Category Management
Predefined categories:
- **Food**: Restaurant, groceries, etc.
- **Transport**: Bus, taxi, fuel, etc.
- **Rent**: Monthly rent payments
- **Shopping**: Clothes, electronics, etc.
- **Other**: Miscellaneous expenses
- **Income**: For deposit transactions

### Transaction Types
- **Deposit**: Income/money added
- **Withdrawal**: Expenses/money spent

## Database Schema

### User Collection
```typescript
{
  first_name: string
  last_name: string
  email: string (unique)
  password: string (hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Transaction Collection
```typescript
{
  user_id: string (indexed)
  amount: number
  type: 'deposit' | 'withdrawal'
  category: TransactionCategory
  date: Date (indexed)
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

### SavingGoal Collection
```typescript
{
  user_id: string (unique, indexed)
  monthly_goal: number
  yearly_goal: number
  createdAt: Date
  updatedAt: Date
}
```

## Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Prettier for code formatting
- ✅ Husky for pre-commit hooks
- ✅ Clean architecture principles
- ✅ SOLID principles
- ✅ Interface-based design

## Testing the APIs

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create transaction (use token from login)
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":500,"type":"withdrawal","category":"Food","date":"2026-01-02"}'

# Get balance
curl http://localhost:3000/api/v1/transaction/balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Contributing

Follow the existing code patterns:
1. Create entity classes with `toJSON()` methods
2. Create MongoDB models with proper schemas
3. Create DTOs with validation methods
4. Create mappers to convert between entities and models
5. Create repositories for data access
6. Create services for business logic
7. Create controllers with validation middleware
8. Create routes with Swagger documentation

## License

MIT

---

**Built with ❤️ following clean architecture principles**
