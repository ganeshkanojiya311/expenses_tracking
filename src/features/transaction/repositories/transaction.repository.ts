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
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { PeriodFilter } from '../types/types';
import { CreateSavingCategoryGoalDTO } from '../dtos/savingCategoryGoal.dto';
import { SavingCategoryGoal } from '../entities/savingCategoryGoal.entity';
import { SavingCategoryGoalMapper } from '../mappers/savingCategoryGoal.mapper';
import { SavingCategoryGoalModel } from '../models/savingCategoryGoal.model';

export class TransactionRepository implements ITransactionRepository {
  private utcStartOfDay(d: Date): Date {
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
  }

  private utcEndOfDay(d: Date): Date {
    return new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
  }

  private buildCreatedAtFilter(period?: PeriodFilter, date?: Date) {
    if (!period && !date) return {};

    // If only `date` is provided, filter by that specific day.
    if (!period && date) {
      return {
        createdAt: { $gte: this.utcStartOfDay(date), $lte: this.utcEndOfDay(date) },
      };
    }

    const anchor = date ?? new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'week':
        start = startOfWeek(anchor, { weekStartsOn: 1 });
        end = endOfWeek(anchor, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(anchor);
        end = endOfMonth(anchor);
        break;
      case 'year':
        start = startOfYear(anchor);
        end = endOfYear(anchor);
        break;
      default:
        return {};
    }

    return { createdAt: { $gte: start, $lte: end } };
  }

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const modelData = TransactionMapper.toModel(data);
    const created = await TransactionModel.create(modelData);
    return TransactionMapper.toEntity(created);
  }

  async getAllTransactions(
    page: number,
    limit: number,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<{ transactions: Transaction[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const filter = this.buildCreatedAtFilter(period, date);

    const [transactions, totalItems] = await Promise.all([
      TransactionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TransactionModel.countDocuments(filter),
    ]);

    return { transactions: TransactionMapper.toEntities(transactions), totalItems };
  }

  async getTransactionsByUserId(
    userId: string,
    period?: PeriodFilter,
    date?: Date,
  ): Promise<Transaction[]> {
    const createdAtFilter = this.buildCreatedAtFilter(period, date);
    const transactions = await TransactionModel.find({
      user_id: userId,
      ...createdAtFilter,
    }).sort({ createdAt: -1 });
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

  async createSavingCategoryGoal(data: CreateSavingCategoryGoalDTO): Promise<SavingCategoryGoal> {
    const modelData = SavingCategoryGoalMapper.toModel(data);
    const created = await SavingCategoryGoalModel.create(modelData);
    return SavingCategoryGoalMapper.toEntity(created);
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
