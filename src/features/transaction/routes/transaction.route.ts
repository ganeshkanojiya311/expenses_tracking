import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

const controller = new TransactionController();

/**
 * @swagger
 * /v1/transaction/create:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionRequest'
 *     responses:
 *       200:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', controller.createTransaction);

/**
 * @swagger
 * /v1/transaction/all-transactions:
 *   get:
 *     summary: Get all transactions (Admin)
 *     tags: [Transactions]
 *     description: Retrieves all transactions from all users (admin endpoint)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Filter transactions by week/month/year (based on createdAt). If omitted and `date` is provided, filters by that exact day.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Optional anchor date (ISO). If `period` is set, it anchors week/month/year; if `period` is omitted, it filters by that exact day.
 *     responses:
 *       200:
 *         description: All transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             totalItems:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 */
router.get('/all-transactions', controller.getAllTransactions);

/**
 * @swagger
 * /v1/transaction/transactionByUserId:
 *   get:
 *     summary: Get transactions by user ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves all transactions for the authenticated user with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Filter transactions by week/month/year (based on createdAt). If omitted and `date` is provided, filters by that exact day.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Optional anchor date (ISO). If `period` is set, it anchors week/month/year; if `period` is omitted, it filters by that exact day.
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             totalItems:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/transactionByUserId', controller.getTransactionsByUserId);

/**
 * @swagger
 * /v1/transaction/recent:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves recent transactions for the authenticated user
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recent transactions to retrieve
 *         example: 10
 *     responses:
 *       200:
 *         description: Recent transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/recent', controller.getRecentTransactions);

/**
 * @swagger
 * /v1/transaction/category/{category}:
 *   get:
 *     summary: Get transactions by category
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves transactions filtered by category for the authenticated user
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Food, Transport, Rent, Shopping, Other, Income]
 *         description: Category to filter transactions
 *         example: Food
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request - Category is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/category/:category', controller.getTransactionsByCategory);

/**
 * @swagger
 * /v1/transaction/total-amounts-by-category:
 *   get:
 *     summary: Get total amounts by category
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves total withdrawal and deposit amounts grouped by category for the authenticated user
 *     responses:
 *       200:
 *         description: Category totals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             enum: [Food, Transport, Rent, Shopping, Other]
 *                           withdrawalTotal:
 *                             type: number
 *                             description: Total amount of withdrawals in this category
 *                           depositTotal:
 *                             type: number
 *                             description: Total amount of deposits in this category
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - No transactions found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/total-amounts-by-category', controller.getTransactionsByCategoryWithTotalAmount);

/**
 * @swagger
 * /v1/transaction/get-transaction-by-type:
 *   get:
 *     summary: Get transactions by type
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves transactions filtered by type (deposit or withdrawal) for the authenticated user
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [deposit, withdrawal]
 *         description: Transaction type to filter by
 *         example: withdrawal
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Filter transactions by week/month/year (based on createdAt). If omitted and `date` is provided, filters by that exact day.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Optional anchor date (ISO). If `period` is set, it anchors week/month/year; if `period` is omitted, it filters by that exact day.
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             totalItems:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *       400:
 *         description: Bad request - Transaction type is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - No transactions found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get-transaction-by-type', controller.getTransactionsByType);

/**
 * @swagger
 * /v1/transaction/saving-category-goal:
 *   post:
 *     summary: Create a new saving category goal
 *     tags: [Saving Category Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - target_amount
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Rent, Shopping, Other]
 *                 description: Category for the saving goal
 *               target_amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Target amount to save for this category
 *     responses:
 *       200:
 *         description: Saving category goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                         category:
 *                           type: string
 *                         target_amount:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/saving-category-goal', controller.createSavingCategoryGoal);

/**
 * @swagger
 * /v1/transaction/saving-category-goal:
 *   get:
 *     summary: Get saving category goals by user ID
 *     tags: [Saving Category Goals]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves all saving category goals for the authenticated user, including current expenses and remaining amounts
 *     responses:
 *       200:
 *         description: Saving category goals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           user_id:
 *                             type: string
 *                           category:
 *                             type: string
 *                           target_amount:
 *                             type: number
 *                           expenses_amount:
 *                             type: number
 *                             description: Current total expenses in this category
 *                           remaining_amount:
 *                             type: number
 *                             description: Remaining amount until goal is reached (target_amount - expenses_amount)
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - Saving category goals not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/saving-category-goal', controller.getSavingCategoryGoalByUserId);

/**
 * @swagger
 * /v1/transaction/saving-category-goal/{id}:
 *   put:
 *     summary: Update a saving category goal
 *     tags: [Saving Category Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saving category goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Rent, Shopping, Other]
 *                 description: Category for the saving goal
 *               target_amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Target amount to save for this category
 *     responses:
 *       200:
 *         description: Saving category goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                         category:
 *                           type: string
 *                         target_amount:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - Saving category goal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/saving-category-goal/:id', controller.updateSavingCategoryGoal);

/**
 * @swagger
 * /v1/transaction/saving-goal:
 *   post:
 *     summary: Create a new saving goal
 *     tags: [Saving Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSavingGoalRequest'
 *     responses:
 *       200:
 *         description: Saving Goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SavingGoal'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/saving-goal', controller.createSavingGoal);

/**
 * @swagger
 * /v1/transaction/saving-goal:
 *   get:
 *     summary: Get saving goal by user ID
 *     tags: [Saving Goals]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the saving goal for the authenticated user
 *     responses:
 *       200:
 *         description: Saving Goal fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SavingGoal'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - Saving goal not found for user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/saving-goal', controller.getSavingGoalByUserId);

/**
 * @swagger
 * /v1/transaction/saving-goal/{id}:
 *   put:
 *     summary: Update a saving goal
 *     tags: [Saving Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saving goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSavingGoalRequest'
 *     responses:
 *       200:
 *         description: Saving Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SavingGoal'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not found - Saving goal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/saving-goal/:id', controller.updateSavingGoal);

/**
 * @swagger
 * /v1/transaction/analytics:
 *   get:
 *     summary: Get transaction analytics
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Retrieves comprehensive analytics including top spending day, average daily spend, most used category, saving rate, and income vs expenses.
 *       
 *       **Weekday Numbering (for week period):**
 *       - 1 = Monday
 *       - 2 = Tuesday
 *       - 3 = Wednesday
 *       - 4 = Thursday
 *       - 5 = Friday
 *       - 6 = Saturday
 *       - 7 = Sunday
 *     parameters:
 *       - in: query
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Period to analyze (week, month, or year)
 *         example: week
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Optional anchor date (ISO). If provided, analytics will be calculated for the period containing this date.
 *         example: "2026-01-25T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Transaction analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         topSpendingDay:
 *                           oneOf:
 *                             - type: object
 *                               properties:
 *                                 period:
 *                                   type: string
 *                                   enum: [week]
 *                                   example: week
 *                                 weekday:
 *                                   type: number
 *                                   minimum: 1
 *                                   maximum: 7
 *                                   description: Weekday number (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday)
 *                                   example: 1
 *                                 totalAmount:
 *                                   type: number
 *                                   description: Total amount spent on this weekday
 *                                   example: 150
 *                             - type: object
 *                               properties:
 *                                 period:
 *                                   type: string
 *                                   enum: [month]
 *                                   example: month
 *                                 date:
 *                                   type: string
 *                                   format: date
 *                                   description: Date in YYYY-MM-DD format
 *                                   example: "2026-01-22"
 *                                 totalAmount:
 *                                   type: number
 *                                   description: Total amount spent on this date
 *                                   example: 300
 *                             - type: object
 *                               properties:
 *                                 period:
 *                                   type: string
 *                                   enum: [year]
 *                                   example: year
 *                                 month:
 *                                   type: number
 *                                   minimum: 0
 *                                   maximum: 11
 *                                   description: Month number (0=January, 11=December)
 *                                   example: 0
 *                                 year:
 *                                   type: number
 *                                   description: Year
 *                                   example: 2026
 *                                 totalAmount:
 *                                   type: number
 *                                   description: Total amount spent in this month
 *                                   example: 4200
 *                         avgDailySpend:
 *                           type: number
 *                           description: Average daily spending amount for the period
 *                           example: 50.5
 *                         mostUsedCategory:
 *                           type: object
 *                           description: Category with the highest number of transactions
 *                           properties:
 *                             category:
 *                               type: string
 *                               enum: [Food, Transport, Rent, Shopping, Other]
 *                               example: Food
 *                             count:
 *                               type: number
 *                               description: Number of transactions in this category
 *                               example: 15
 *                             totalAmount:
 *                               type: number
 *                               description: Total amount in this category
 *                               example: 750
 *                         savingRate:
 *                           type: number
 *                           description: Saving rate as a percentage ((Income - Expenses) / Income * 100)
 *                           example: 25.5
 *                         incomeVsExpenses:
 *                           type: object
 *                           description: Total income and expenses for the period
 *                           properties:
 *                             income:
 *                               type: number
 *                               description: Total income (deposits) for the period
 *                               example: 5000
 *                             expenses:
 *                               type: number
 *                               description: Total expenses (withdrawals) for the period
 *                               example: 3750
 *       400:
 *         description: Bad request - Invalid period or missing required parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/analytics', controller.getTransactionAnalytics);

export default router;
