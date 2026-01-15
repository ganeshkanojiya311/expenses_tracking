import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import {
  Transaction,
  TransactionCategory,
} from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';
import { SavingGoalMapper } from '../mappers/savingGoal.mapper';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { SavingGoalModel } from '../models/savingGoal.model';
import { TransactionModel } from '../models/transaction.model';

export class TransactionRepository implements ITransactionRepository {
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const modelData = TransactionMapper.toModel(data);
    const created = await TransactionModel.create(modelData);
    return TransactionMapper.toEntity(created);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await TransactionModel.find();
    return TransactionMapper.toEntities(transactions);
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await TransactionModel.find({ user_id: userId });
    return TransactionMapper.toEntities(transactions);
  }

  async getRecentTransactions(
    limit: number,
    userId: string,
  ): Promise<Transaction[]> {
    const transactions = await TransactionModel.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return TransactionMapper.toEntities(transactions);
  }

  async getTransactionsByCategory(
    category: string,
    userId: string,
  ): Promise<Transaction[]> {
    const transactions = await TransactionModel.find({
      user_id: userId,
      category: category as unknown as TransactionCategory,
    });

    return TransactionMapper.toEntities(transactions);
  }

  async createSavingGoal(data: CreateSavingGoalDTO): Promise<SavingGoal> {
    const modelData = SavingGoalMapper.toModel(data);
    const created = await SavingGoalModel.create(modelData);
    return SavingGoalMapper.toEntity(created);
  }

  async getSavingGoalByUserId(userId: string): Promise<SavingGoal | null> {
    const goal = await SavingGoalModel.findOne({ user_id: userId });
    return goal ? SavingGoalMapper.toEntity(goal) : null;
  }

  async updateSavingGoal(
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null> {
    const updated = await SavingGoalModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updated ? SavingGoalMapper.toEntity(updated) : null;
  }
}
