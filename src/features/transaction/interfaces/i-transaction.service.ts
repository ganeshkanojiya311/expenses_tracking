import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction } from '../entities/transaction.entity';

export interface ITransactionService {
  createTransaction(
    token: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByUserId(token: string): Promise<Transaction[]>;
  getRecentTransactions(limit: number, token: string): Promise<Transaction[]>;
  getTransactionsByCategory(
    category: string,
    token: string,
  ): Promise<Transaction[]>;

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
