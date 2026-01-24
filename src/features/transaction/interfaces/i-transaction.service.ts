import { CreateSavingCategoryGoalDTO, UpdateSavingCategoryGoalDTO } from '../dtos/savingCategoryGoal.dto';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingCategoryGoal } from '../entities/savingCategoryGoal.entity';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { CategoryTotal, PaginationMeta, PeriodFilter } from '../types/types';

export interface ITransactionService {
  createTransaction (
    token: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction>;
  getAllTransactions (
    page?: number,
    limit?: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    pagination: PaginationMeta;
  }>;
  getTransactionsByUserId (
    token: string,
    page?: number,
    limit?: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    pagination: PaginationMeta;
  }>;
  getRecentTransactions (limit: number, token: string): Promise<Transaction[]>;
  getTransactionsByCategory (
    category: string,
    token: string,
  ): Promise<{ transactions: Transaction[]; totalAmount: number; }>;
  getTransactionsByCategoryWithTotalAmount (token: string): Promise<CategoryTotal[]>;
  getTransactionsByType (
    token: string,
    type: TransactionType,
    page?: number,
    limit?: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{
    transactions: Transaction[];
    pagination: PaginationMeta;
  }>;

  createSavingCategoryGoal (
    token: string,
    data: Partial<CreateSavingCategoryGoalDTO>,
  ): Promise<SavingCategoryGoal>;
  getSavingCategoryGoalByUserId (token: string): Promise<SavingCategoryGoal[]>;
  updateSavingCategoryGoal (id: string, data: UpdateSavingCategoryGoalDTO): Promise<SavingCategoryGoal | null>;

  createSavingGoal (
    token: string,
    data: Partial<CreateSavingGoalDTO>,
  ): Promise<SavingGoal>;
  getSavingGoalByUserId (token: string): Promise<SavingGoal | null>;
  updateSavingGoal (
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null>;
}
