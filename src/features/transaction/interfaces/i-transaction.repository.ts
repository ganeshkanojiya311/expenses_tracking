import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  createTransaction(data: CreateTransactionDTO): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getRecentTransactions(limit: number, userId: string): Promise<Transaction[]>;
  getTransactionsByCategory(
    category: string,
    userId: string,
  ): Promise<Transaction[]>;

  createSavingGoal(data: CreateSavingGoalDTO): Promise<SavingGoal>;
  getSavingGoalByUserId(userId: string): Promise<SavingGoal | null>;
  updateSavingGoal(
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null>;
}
