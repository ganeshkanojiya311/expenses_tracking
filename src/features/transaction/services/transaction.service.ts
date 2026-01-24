import { NotFoundError } from '../../../core/ApiError';
import { IAuthService } from '../../auth/interfaces/i-auth.service';
import { AuthService } from '../../auth/services/auth.service';
import { CreateSavingCategoryGoalDTO, UpdateSavingCategoryGoalDTO } from '../dtos/savingCategoryGoal.dto';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingCategoryGoal } from '../entities/savingCategoryGoal.entity';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction, TransactionCategory, TransactionType } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';
import { ITransactionService } from '../interfaces/i-transaction.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryTotal, PaginationMeta, PeriodFilter } from '../types/types';

export class TransactionService implements ITransactionService {
  private repository: ITransactionRepository;
  private authService: IAuthService;
  constructor() {
    this.repository = new TransactionRepository();
    this.authService = new AuthService();
  }

  async createTransaction (
    token: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    if (!id) {
      throw new NotFoundError('Invalid token payload');
    }
    const modelData = new CreateTransactionDTO({ ...data, user_id: id });
    modelData.validate();
    const transaction = await this.repository.createTransaction(modelData);
    return transaction;
  }

  async getAllTransactions (
    page: number = 1,
    limit: number = 10,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{ transactions: Transaction[]; pagination: PaginationMeta; }> {
    const { transactions, totalItems } = await this.repository.getAllTransactions(
      page,
      limit,
      period,
      date,
    );

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
      transactions,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getTransactionsByUserId (
    token: string,
    page: number = 1,
    limit: number = 10,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{ transactions: Transaction[]; pagination: PaginationMeta; }> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const { transactions, totalItems } = await this.repository.getTransactionsByUserId(
      id || '',
      page,
      limit,
      period,
      date,
    );

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
      transactions,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    };
  }

  async getRecentTransactions (
    limit: number,
    token: string,
  ): Promise<Transaction[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getRecentTransactions(
      limit,
      id || '',
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    return transactions;
  }

  async getTransactionsByCategory (
    category: string,
    token: string,
  ): Promise<{ transactions: Transaction[]; totalAmount: number; }> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getTransactionsByCategory(
      category,
      id || '',
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    let totalAmount = 0;
    for (const transaction of transactions) {
      totalAmount += transaction.amount;
    }
    return { transactions, totalAmount };
  }

  async getTransactionsByCategoryWithTotalAmount (
    token: string
  ): Promise<CategoryTotal[]> {
    const { valid, id } = await this.authService.validateToken(token);

    if (!valid) {
      throw new NotFoundError('User not found');
    }

    const result = await this.repository.getTransactionsByUserId(id || '', 1, 1000);

    if (result.transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }

    const categoryMap = new Map<string, number>();

    for (const { category, amount } of result.transactions) {
      categoryMap.set(
        category as unknown as string,
        (categoryMap.get(category as unknown as string) ?? 0) + amount
      );
    }

    return Array.from(categoryMap, ([category, totalAmount]) => ({
      type: result.transactions[0].type,
      category: category as unknown as TransactionCategory,
      totalAmount,
      createdAt: result.transactions[0].createdAt,
    }));
  }

  async getTransactionsByType (
    token: string,
    type: TransactionType,
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date
  ): Promise<{ transactions: Transaction[]; pagination: PaginationMeta; }> {
    const { valid, id } = await this.authService.validateToken(token);

    if (!valid) {
      throw new NotFoundError('User not found');
    }

    if (!type) {
      throw new NotFoundError('Transaction type is required');
    }

    const { transactions, totalItems } = await this.repository.getTransactionsByType(
      id || '',
      type,
      page,
      limit,
      period,
      date,
    );

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
      transactions,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    };
  }

  async createSavingCategoryGoal (token: string, data: Partial<CreateSavingCategoryGoalDTO>): Promise<SavingCategoryGoal> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    if (!id) {
      throw new NotFoundError('Invalid token payload');
    }
    const modelData = new CreateSavingCategoryGoalDTO({ ...data, user_id: id });
    modelData.validate();
    const savingCategoryGoal = await this.repository.createSavingCategoryGoal(modelData);
    return savingCategoryGoal;
  }

  async getSavingCategoryGoalByUserId (token: string): Promise<SavingCategoryGoal[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const savingCategoryGoal = await this.repository.getSavingCategoryGoalByUserId(id || '');
    if (!savingCategoryGoal) {
      throw new NotFoundError('Saving category goals not found');
    }
    let currentAmount: any = {};
    for (const goal of savingCategoryGoal) {
      currentAmount[goal.category] = goal.target_amount;
    }

    const type = TransactionType.WITHDRAWAL;

    const expensesResult = await this.repository.getTransactionsByType(id || '', type, 1, 1000);

    if (expensesResult.transactions.length === 0) {
      throw new NotFoundError('Expenses not found');
    }

    const categoryMap = new Map<string, number>();
    for (const { category, amount } of expensesResult.transactions) {
      categoryMap.set(
        category as unknown as string,
        (categoryMap.get(category as unknown as string) ?? 0) + amount
      );
    }

    for (const goal of savingCategoryGoal) {
      goal.expenses_amount = categoryMap.get(goal.category as unknown as string) ?? 0;
      goal.remaining_amount = goal.target_amount - goal.expenses_amount;
    }

    return savingCategoryGoal;
  }

  async updateSavingCategoryGoal (id: string, data: UpdateSavingCategoryGoalDTO): Promise<SavingCategoryGoal | null> {
    data.validate();
    const savingCategoryGoal = await this.repository.updateSavingCategoryGoal(id, data);
    if (!savingCategoryGoal) {
      throw new NotFoundError('Saving category goal not found');
    }
    return savingCategoryGoal;
  }

  async createSavingGoal (
    token: string,
    data: Partial<CreateSavingGoalDTO>,
  ): Promise<SavingGoal> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    if (!id) {
      throw new NotFoundError('Invalid token payload');
    }
    const modelData = new CreateSavingGoalDTO({ ...data, user_id: id });
    modelData.validate();
    const savingGoal = await this.repository.createSavingGoal(modelData);
    return savingGoal;
  }

  async getSavingGoalByUserId (token: string): Promise<SavingGoal | null> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const savingGoal = await this.repository.getSavingGoalByUserId(id || '');
    if (!savingGoal) {
      throw new NotFoundError('Saving goal not found');
    }
    return savingGoal;
  }

  async updateSavingGoal (
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null> {
    data.validate();
    const savingGoal = await this.repository.updateSavingGoal(id, data);
    if (!savingGoal) {
      throw new NotFoundError('Saving goal not found');
    }
    return savingGoal;
  }
}
