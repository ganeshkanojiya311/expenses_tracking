import { Request, Response } from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { ITransactionService } from '../interfaces/i-transaction.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionValidation } from '../validations/transaction.validation';
import { BadRequestError } from '../../../core/ApiError';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';

export class TransactionController {
  private service: ITransactionService;
  constructor() {
    this.service = new TransactionService();
  }

  createTransaction = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    validator(TransactionValidation.createTransaction, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const data = new CreateTransactionDTO(req.body);
      const result = await this.service.createTransaction(token, data);
      new SuccessResponse('Transaction created successfully', result).send(res);
    }),
  ];

  getAllTransactions = [
    asyncHandler(async (req: Request, res: Response) => {
      const result = await this.service.getAllTransactions();
      new SuccessResponse('All transactions fetched successfully', result).send(
        res,
      );
    }),
  ];

  getTransactionsByUserId = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const result = await this.service.getTransactionsByUserId(token);
      new SuccessResponse('Transactions fetched successfully', result).send(
        res,
      );
    }),
  ];

  getRecentTransactions = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const result = await this.service.getRecentTransactions(limit, token);
      new SuccessResponse(
        'Recent transactions fetched successfully',
        result,
      ).send(res);
    }),
  ];

  getTransactionsByCategory = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const category = req.params.category as string;
      if (!category) {
        throw new BadRequestError('Category is required');
      }
      const result = await this.service.getTransactionsByCategory(
        category,
        token,
      );
      new SuccessResponse('Transactions fetched successfully', result).send(
        res,
      );
    }),
  ];

  createSavingGoal = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const data = new CreateSavingGoalDTO(req.body);
      const result = await this.service.createSavingGoal(token, data);
      new SuccessResponse('Saving Goal created successfully', result).send(res);
    }),
  ];

  getSavingGoalByUserId = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const result = await this.service.getSavingGoalByUserId(token);
      new SuccessResponse('Saving Goal fetched successfully', result).send(res);
    }),
  ];

  updateSavingGoal = [
    validator(TransactionValidation.auth, ValidationSource.HEADER),
    validator(TransactionValidation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const id = req.params.id as string;
      const data = new UpdateSavingGoalDTO(req.body);
      data.validate();
      const result = await this.service.updateSavingGoal(id, data);
      new SuccessResponse('Saving Goal updated successfully', result).send(res);
    }),
  ];
}
