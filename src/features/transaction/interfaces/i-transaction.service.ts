import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction } from '../entities/transaction.entity';
import { CategoryTotal, PaginationMeta, PeriodFilter } from '../types/types';

export interface ITransactionService {
  createTransaction(
    token: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction>;
  getAllTransactions(
    page?: number,
    limit?: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    pagination: PaginationMeta;
  }>;
  getTransactionsByUserId(
    token: string,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<Transaction[]>;
  getRecentTransactions(limit: number, token: string): Promise<Transaction[]>;
  getTransactionsByCategory(
    category: string,
    token: string,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }>;
  getTransactionsByCategoryWithTotalAmount(token: string): Promise<CategoryTotal[]>;

  createSavingGoal(
    token: string,
    data: Partial<CreateSavingGoalDTO>,
  ): Promise<SavingGoal>;
  getSavingGoalByUserId(token: string): Promise<SavingGoal | null>;
  updateSavingGoal(
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null>;
}
