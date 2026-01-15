import swaggerJsdoc from 'swagger-jsdoc';
import { Config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Analyzer API',
      version: '1.0.0',
      description: 'API documentation for Expense Analyzer application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `https://expense-analyzer-1xod.onrender.com`,
        // url: `http://localhost:${Config.PORT || 4000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            first_name: {
              type: 'string',
              description: 'First name of the user',
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            first_name: {
              type: 'string',
              description: 'First name of the user',
              example: 'John',
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'SecurePassword123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'SecurePassword123',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 200,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              example: 200,
            },
            message: {
              type: 'string',
              example: 'User Logged in successfully',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT authentication token',
                },
              },
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Transaction ID',
            },
            user_id: {
              type: 'string',
              description: 'User ID who created the transaction',
            },
            amount: {
              type: 'number',
              description: 'Transaction amount',
              example: 100.5,
            },
            type: {
              type: 'string',
              description: 'Transaction type',
              enum: ['deposit', 'withdrawal'],
              example: 'deposit',
            },
            category: {
              type: 'string',
              description: 'Transaction category',
              enum: [
                'Food',
                'Transport',
                'Rent',
                'Shopping',
                'Other',
                'Income',
              ],
              example: 'Food',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        CreateTransactionRequest: {
          type: 'object',
          required: ['amount', 'type', 'category'],
          properties: {
            amount: {
              type: 'number',
              description: 'Transaction amount',
              example: 100.5,
            },
            type: {
              type: 'string',
              description: 'Transaction type',
              enum: ['deposit', 'withdrawal'],
              example: 'deposit',
            },
            category: {
              type: 'string',
              description: 'Transaction category',
              enum: [
                'Food',
                'Transport',
                'Rent',
                'Shopping',
                'Other',
                'Income',
              ],
              example: 'Food',
            },
          },
        },
        SavingGoal: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Saving goal ID',
            },
            user_id: {
              type: 'string',
              description: 'User ID who created the saving goal',
            },
            target_amount: {
              type: 'number',
              description: 'Target amount to save',
              example: 5000,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateSavingGoalRequest: {
          type: 'object',
          required: ['target_amount'],
          properties: {
            target_amount: {
              type: 'number',
              description: 'Target amount to save',
              example: 5000,
            },
          },
        },
        UpdateSavingGoalRequest: {
          type: 'object',
          required: ['target_amount'],
          properties: {
            target_amount: {
              type: 'number',
              description: 'Updated target amount to save',
              example: 7500,
            },
          },
        },
      },
    },
  },
  apis: ['./src/features/**/routes/*.ts', './src/routers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
