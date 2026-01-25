import { CreateSavingCategoryGoalDTO, UpdateSavingCategoryGoalDTO } from '../dtos/savingCategoryGoal.dto';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingCategoryGoal } from '../entities/savingCategoryGoal.entity';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { PeriodFilter } from '../types/types';

export interface ITransactionRepository {
  createTransaction (data: CreateTransactionDTO): Promise<Transaction>;
  getAllTransactions (
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    totalItems: number;
  }>;
  getTransactionsByUserId (
    userId: string,
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[],
    totalItems: number;
  }>;
  getRecentTransactions (limit: number, userId: string): Promise<Transaction[]>;
  getTransactionsByCategory (
    category: string,
    userId: string,
  ): Promise<Transaction[]>;
  getTransactionsByType (
    userId: string,
    type: TransactionType,
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    totalItems: number;
  }>;

  createSavingCategoryGoal (data: CreateSavingCategoryGoalDTO): Promise<SavingCategoryGoal>;
  getSavingCategoryGoalByUserId (userId: string): Promise<SavingCategoryGoal[]>;
  updateSavingCategoryGoal (id: string, data: UpdateSavingCategoryGoalDTO): Promise<SavingCategoryGoal | null>;

  createSavingGoal (data: CreateSavingGoalDTO): Promise<SavingGoal>;
  getSavingGoalByUserId (userId: string): Promise<SavingGoal | null>;
  updateSavingGoal (
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null>;
  getTransactionsForAnalytics (
    userId: string,
    period: PeriodFilter,
    date?: Date,
  ): Promise<Transaction[]>;
}
