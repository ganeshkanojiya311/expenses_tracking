# Architecture Diagram

## Request Flow Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                               │
│  POST /api/v1/transaction                                           │
│  Authorization: Bearer <token>                                       │
│  Body: { amount, type, category, date }                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                                  │
│  1. authentication → Validates JWT, extracts user_id                │
│  2. validator → Validates request body with Joi schema              │
│  3. asyncHandler → Wraps async functions for error handling        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                                  │
│  TransactionController.createTransaction                            │
│  • Extracts userId from req.agentId                                 │
│  • Creates CreateTransactionDTO with request data                   │
│  • Calls service method                                             │
│  • Wraps response in SuccessResponse                                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                    │
│  TransactionService.createTransaction(dto)                          │
│  • Calls dto.validate() - Business rule validation                  │
│  • Performs business logic                                          │
│  • Calls repository for data operations                             │
│  • Returns domain entity                                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                                   │
│  TransactionRepository.createTransaction(dto)                       │
│  • Uses TransactionMapper.toModel() - Entity → Model                │
│  • Creates document in MongoDB                                      │
│  • Uses TransactionMapper.toEntity() - Model → Entity               │
│  • Returns domain entity                                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                                   │
│  MongoDB - TransactionModel                                         │
│  • Stores transaction document                                      │
│  • Uses indexes for performance                                     │
│  • Returns created document                                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RESPONSE TO CLIENT                                │
│  {                                                                   │
│    "statusCode": 200,                                               │
│    "message": "Transaction created successfully",                   │
│    "data": { id, user_id, amount, type, category, date, ... }      │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Feature Module Structure

```
┌───────────────────────────────────────────────────────────────────┐
│                    TRANSACTION FEATURE                             │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   ENTITIES      │  Domain Models (Business Logic)
├─────────────────┤
│ Transaction     │  • Pure TypeScript classes
│ • id            │  • toJSON() methods
│ • user_id       │  • No DB dependencies
│ • amount        │
│ • type          │
│ • category      │
└─────────────────┘

┌─────────────────┐
│    MODELS       │  Database Schemas
├─────────────────┤
│ TransactionModel│  • Mongoose schemas
│ • Schema def    │  • Indexes
│ • Validation    │  • Timestamps
│ • Transform     │  • Type safety
└─────────────────┘

┌─────────────────┐
│     DTOs        │  Data Transfer Objects
├─────────────────┤
│ CreateTransDTO  │  • Request validation
│ • validate()    │  • Type safety
│ FilterDTO       │  • Business rules
└─────────────────┘

┌─────────────────┐
│    MAPPERS      │  Entity ↔ Model Conversion
├─────────────────┤
│ TransMapper     │  • toEntity()
│ • toEntity()    │  • toModel()
│ • toModel()     │  • toEntities()
│ • toEntities()  │  • toModels()
└─────────────────┘

┌─────────────────┐
│  REPOSITORIES   │  Data Access Layer
├─────────────────┤
│ TransRepo       │  • CRUD operations
│ • create()      │  • Query methods
│ • findById()    │  • Uses Mappers
│ • findByUser()  │  • Returns Entities
│ • findByPeriod()│
└─────────────────┘

┌─────────────────┐
│   SERVICES      │  Business Logic Layer
├─────────────────┤
│ TransService    │  • Business rules
│ • create()      │  • Calculations
│ • getBalance()  │  • Orchestration
│ • getAnalysis() │  • Uses Repository
│ • getStats()    │
└─────────────────┘

┌─────────────────┐
│  CONTROLLERS    │  HTTP Layer
├─────────────────┤
│ TransController │  • Request handling
│ • [middleware]  │  • Response formatting
│ • asyncHandler  │  • Error handling
│ • validator     │  • Uses Service
└─────────────────┘

┌─────────────────┐
│    ROUTES       │  Endpoint Definitions
├─────────────────┤
│ trans.routes.ts │  • Route mapping
│ • POST /        │  • Swagger docs
│ • GET /balance  │  • Controller binding
│ • GET /recent   │
└─────────────────┘

┌─────────────────┐
│  VALIDATIONS    │  Request Schemas
├─────────────────┤
│ TransValidation │  • Joi schemas
│ • createTrans   │  • Query validation
│ • filterPeriod  │  • Body validation
└─────────────────┘

┌─────────────────┐
│  INTERFACES     │  Contracts
├─────────────────┤
│ ITransRepo      │  • Repository contract
│ ITransService   │  • Service contract
│                 │  • Dependency injection
└─────────────────┘
```

---

## Data Flow - Create Transaction Example

```
1. CLIENT
   POST /api/v1/transaction
   Authorization: Bearer eyJhbGc...
   Body: { "amount": 500, "type": "withdrawal", "category": "Food", "date": "2026-01-02" }
   
   ↓

2. AUTHENTICATION MIDDLEWARE
   • Extracts token from Authorization header
   • Validates JWT token
   • Extracts user ID from token payload
   • Sets req.agentId = "user123"
   
   ↓

3. VALIDATOR MIDDLEWARE
   • Validates body against TransactionValidation.createTransaction schema
   • Checks: amount > 0, type valid, category valid, date format
   • Throws BadRequestError if invalid
   
   ↓

4. CONTROLLER
   const userId = req.agentId;  // "user123"
   const data = new CreateTransactionDTO({ ...req.body, user_id: userId });
   const result = await service.createTransaction(data);
   
   ↓

5. DTO VALIDATION
   data.validate();
   • Checks all required fields present
   • Validates business rules
   • Throws BadRequestError if invalid
   
   ↓

6. SERVICE
   await repository.createTransaction(data);
   • No additional processing needed
   • Could add more business logic here
   
   ↓

7. REPOSITORY
   const modelData = TransactionMapper.toModel(data);
   // Converts: { user_id, amount, ... } → MongoDB document format
   const created = await TransactionModel.create(modelData);
   
   ↓

8. DATABASE
   • Inserts document into transactions collection
   • Auto-generates _id and timestamps
   • Returns created document
   
   ↓

9. MAPPER (toEntity)
   return TransactionMapper.toEntity(created);
   // Converts: { _id, ... } → { id, ... }
   
   ↓

10. RESPONSE
   new SuccessResponse('Transaction created successfully', result).send(res);
   
   ↓

11. CLIENT RECEIVES
   {
     "statusCode": 200,
     "message": "Transaction created successfully",
     "data": {
       "id": "507f1f77bcf86cd799439011",
       "user_id": "user123",
       "amount": 500,
       "type": "withdrawal",
       "category": "Food",
       "date": "2026-01-02T00:00:00.000Z",
       "createdAt": "2026-01-02T10:30:00.000Z",
       "updatedAt": "2026-01-02T10:30:00.000Z"
     }
   }
```

---

## Analytics Flow - Get Spending Analysis Example

```
1. CLIENT
   GET /api/v1/transaction/spending-analysis?period=month
   Authorization: Bearer eyJhbGc...
   
   ↓

2. MIDDLEWARE
   • Authentication → user_id = "user123"
   • Validator → period = "month" ✓
   
   ↓

3. CONTROLLER
   const userId = req.agentId;
   const period = req.query.period;
   const result = await service.getSpendingAnalysis(userId, period);
   
   ↓

4. SERVICE - Complex Business Logic
   
   Step 1: Get Date Range
   const { startDate, endDate } = getDateRange('month');
   // Returns: { startDate: Jan 1, endDate: Jan 31 }
   
   Step 2: Fetch Transactions
   const transactions = await repository.findTransactionsByPeriod(
     userId, startDate, endDate
   );
   
   Step 3: Filter Expenses
   const expenses = transactions.filter(t => t.type === 'withdrawal');
   
   Step 4: Calculate Total
   const totalSpending = expenses.reduce((sum, t) => sum + t.amount, 0);
   
   Step 5: Calculate Average
   const days = differenceInDays(endDate, startDate) + 1;
   const avgDailySpending = totalSpending / days;
   
   Step 6: Category Breakdown
   const categoryTotals = expenses.reduce((acc, t) => {
     acc[t.category] = (acc[t.category] || 0) + t.amount;
     return acc;
   }, {});
   
   const categoryBreakdown = Object.entries(categoryTotals).map(
     ([category, amount]) => ({
       category,
       amount,
       percentage: (amount / totalSpending) * 100
     })
   ).sort((a, b) => b.amount - a.amount);
   
   Step 7: Top Spending Day
   const topSpendingDay = await getTopSpendingDay(userId, period);
   
   ↓

5. RESPONSE
   {
     "statusCode": 200,
     "message": "Spending analysis fetched successfully",
     "data": {
       "totalSpending": 5450.00,
       "avgDailySpending": 175.81,
       "categoryBreakdown": [
         { "category": "Food", "amount": 2500, "percentage": 45.87 },
         { "category": "Transport", "amount": 1200, "percentage": 22.02 },
         { "category": "Shopping", "amount": 1000, "percentage": 18.35 },
         { "category": "Other", "amount": 750, "percentage": 13.76 }
       ],
       "topSpendingDay": {
         "date": "2026-01-15",
         "amount": 1500
       }
     }
   }
```

---

## Database Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        MONGODB DATABASE                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│      users Collection                │
│  ┌─────────────────────────────┐    │
│  │ _id: ObjectId               │    │
│  │ first_name: String          │    │
│  │ last_name: String           │    │
│  │ email: String (unique)      │    │
│  │ password: String (hashed)   │    │
│  │ createdAt: Date             │    │
│  │ updatedAt: Date             │    │
│  └─────────────────────────────┘    │
│  Indexes:                            │
│  • { email: 1 } unique               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   transactions Collection            │
│  ┌─────────────────────────────┐    │
│  │ _id: ObjectId               │    │
│  │ user_id: String             │    │
│  │ amount: Number              │    │
│  │ type: String (enum)         │    │
│  │ category: String (enum)     │    │
│  │ date: Date                  │    │
│  │ description: String?        │    │
│  │ createdAt: Date             │    │
│  │ updatedAt: Date             │    │
│  └─────────────────────────────┘    │
│  Indexes:                            │
│  • { user_id: 1, date: -1 }         │
│  • { user_id: 1, category: 1 }      │
│  • { user_id: 1, type: 1 }          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   savinggoals Collection             │
│  ┌─────────────────────────────┐    │
│  │ _id: ObjectId               │    │
│  │ user_id: String (unique)    │    │
│  │ monthly_goal: Number        │    │
│  │ yearly_goal: Number         │    │
│  │ createdAt: Date             │    │
│  │ updatedAt: Date             │    │
│  └─────────────────────────────┘    │
│  Indexes:                            │
│  • { user_id: 1 } unique             │
└─────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────────┐
│                       ERROR SCENARIOS                           │
└────────────────────────────────────────────────────────────────┘

1. VALIDATION ERROR (Joi Schema)
   Request: { amount: -100 }
   ↓
   Validator Middleware catches
   ↓
   Throws BadRequestError('Amount must be greater than 0')
   ↓
   Response: { statusCode: 400, message: 'Amount must be greater than 0' }

2. DTO VALIDATION ERROR
   CreateTransactionDTO.validate() called
   ↓
   Checks: if (!this.amount || this.amount <= 0)
   ↓
   throw new BadRequestError('Amount must be greater than 0')
   ↓
   Caught by asyncHandler
   ↓
   Response: { statusCode: 400, message: 'Amount must be greater than 0' }

3. AUTHENTICATION ERROR
   Missing or invalid token
   ↓
   Authentication middleware
   ↓
   throw new AuthFailureError('Invalid or expired token')
   ↓
   Response: { statusCode: 401, message: 'Invalid or expired token' }

4. NOT FOUND ERROR
   Transaction/User/Goal not found
   ↓
   Service checks: if (!result)
   ↓
   throw new NotFoundError('Transaction not found')
   ↓
   Response: { statusCode: 404, message: 'Transaction not found' }

5. DATABASE ERROR
   MongoDB connection failure
   ↓
   Caught by asyncHandler
   ↓
   Response: { statusCode: 500, message: 'Internal Server Error' }
```

---

## Complete API Map

```
/api/v1
├── /auth
│   ├── POST   /signup          → AuthController.signupUser
│   ├── POST   /login           → AuthController.loginUser
│   └── GET    /me              → AuthController.userMe
│
├── /transaction
│   ├── POST   /                → TransactionController.createTransaction
│   ├── GET    /balance         → TransactionController.getBalance
│   ├── GET    /recent          → TransactionController.getRecentTransactions
│   ├── GET    /all             → TransactionController.getAllTransactions
│   ├── GET    /filter          → TransactionController.getTransactionsByPeriod
│   ├── GET    /category        → TransactionController.getTransactionsByCategory
│   ├── GET    /top-spending-day → TransactionController.getTopSpendingDay
│   ├── GET    /avg-spending    → TransactionController.getAvgSpending
│   ├── GET    /most-used-categories → TransactionController.getMostUsedCategories
│   ├── GET    /saving-rate     → TransactionController.getSavingRate
│   ├── GET    /income-vs-expense → TransactionController.getIncomeVsExpense
│   └── GET    /spending-analysis → TransactionController.getSpendingAnalysis
│
└── /goal
    ├── GET    /savings         → GoalController.getSavingGoal
    └── PUT    /savings         → GoalController.updateSavingGoal
```

---

**Architecture follows SOLID principles and Clean Architecture patterns!**
