import { NotFoundError } from '../../../core/ApiError';
import { IAuthService } from '../../auth/interfaces/i-auth.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction, TransactionCategory } from '../entities/transaction.entity';
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

  async createTransaction(
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

  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{ transactions: Transaction[]; pagination: PaginationMeta }> {
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

  async getTransactionsByUserId(
    token: string,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<Transaction[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getTransactionsByUserId(
      id || '',
      period,
      date,
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    return transactions;
  }

  async getRecentTransactions(
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

  async getTransactionsByCategory(
    category: string,
    token: string,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }> {
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

  async getTransactionsByCategoryWithTotalAmount(
    token: string
  ): Promise<CategoryTotal[]> {
    const { valid, id } = await this.authService.validateToken(token);

    if (!valid) {
      throw new NotFoundError('User not found');
    }

    const transactions = await this.repository.getTransactionsByUserId(id || '');

    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }

    const categoryMap = new Map<string, number>();

    for (const { category, amount } of transactions) {
      categoryMap.set(
        category as unknown as string,
        (categoryMap.get(category as unknown as string) ?? 0) + amount
      );
    }

    return Array.from(categoryMap, ([category, totalAmount]) => ({
      type: transactions[0].type,
      category: category as unknown as TransactionCategory,
      totalAmount,
      createdAt: transactions[0].createdAt,
    }));
  }


  async createSavingGoal(
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

  async getSavingGoalByUserId(token: string): Promise<SavingGoal | null> {
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

  async updateSavingGoal(
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
