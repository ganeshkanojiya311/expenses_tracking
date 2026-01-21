import { CreateSavingCategoryGoalDTO } from '../dtos/savingCategoryGoal.dto';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingCategoryGoal } from '../entities/savingCategoryGoal.entity';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction } from '../entities/transaction.entity';
import { PeriodFilter } from '../types/types';

export interface ITransactionRepository {
  createTransaction(data: CreateTransactionDTO): Promise<Transaction>;
  getAllTransactions(
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    totalItems: number;
  }>;
  getTransactionsByUserId(
    userId: string,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<Transaction[]>;
  getRecentTransactions(limit: number, userId: string): Promise<Transaction[]>;
  getTransactionsByCategory(
    category: string,
    userId: string,
  ): Promise<Transaction[]>;

  createSavingCategoryGoal(data: CreateSavingCategoryGoalDTO): Promise<SavingCategoryGoal>

  createSavingGoal(data: CreateSavingGoalDTO): Promise<SavingGoal>;
  getSavingGoalByUserId(userId: string): Promise<SavingGoal | null>;
  updateSavingGoal(
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null>;
}
