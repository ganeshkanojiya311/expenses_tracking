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
import { AnalyticsResponse, CategoryTotal, GroupedTransactionStats, PaginationMeta, PeriodFilter } from '../types/types';

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

    const categoryMap = new Map<TransactionCategory, CategoryTotal>();

    for (const transaction of result.transactions) {
      const { category, amount, type } = transaction;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          withdrawalTotal: 0,
          depositTotal: 0,
        });
      }

      const categoryTotal = categoryMap.get(category)!;

      if (type === TransactionType.DEPOSIT) {
        categoryTotal.depositTotal += amount;
      }

      if (type === TransactionType.WITHDRAWAL) {
        categoryTotal.withdrawalTotal += amount;
      }
    }

    return Array.from(categoryMap.values());
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
    const type = TransactionType.WITHDRAWAL;

    const expensesResult = await this.repository.getTransactionsByType(id || '', type, 1, 1000);

    if (expensesResult.transactions.length === 0) {
      throw new NotFoundError('Expenses not found');
    }

    const totalExpenses = expensesResult.transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    savingGoal.expenses_amount = totalExpenses;
    savingGoal.remaining_amount = savingGoal.target_amount - totalExpenses;

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

  async getTransactionAnalytics (
    token: string,
    period: PeriodFilter,
    date?: Date,
  ): Promise<AnalyticsResponse> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid || !id) {
      throw new NotFoundError('User not found');
    }

    const transactions = await this.repository.getTransactionsForAnalytics(
      id,
      period,
      date,
    );

    if (transactions.length === 0) {
      // Return empty analytics if no transactions
      const emptyTopSpendingDay: GroupedTransactionStats =
        period === 'week'
          ? { period: 'week', weekday: 1, totalAmount: 0 }
          : period === 'month'
            ? { period: 'month', date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0], totalAmount: 0 }
            : { period: 'year', month: date ? date.getMonth() : new Date().getMonth(), year: date ? date.getFullYear() : new Date().getFullYear(), totalAmount: 0 };

      return {
        topSpendingDay: emptyTopSpendingDay,
        avgDailySpend: 0,
        mostUsedCategory: {
          category: 'Other' as unknown as TransactionCategory,
          count: 0,
          totalAmount: 0,
        },
        savingRate: 0,
        incomeVsExpenses: {
          income: 0,
          expenses: 0,
        },
      };
    }

    // Calculate income vs expenses
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryMap = new Map<string, { count: number; totalAmount: number }>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.DEPOSIT) {
        totalIncome += transaction.amount;
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        totalExpenses += transaction.amount;
      }

      // Track category usage
      const categoryKey = transaction.category as unknown as string;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, { count: 0, totalAmount: 0 });
      }
      const categoryData = categoryMap.get(categoryKey)!;
      categoryData.count += 1;
      categoryData.totalAmount += transaction.amount;
    }

    // Find most used category
    let mostUsedCategory = {
      category: 'Other' as unknown as TransactionCategory,
      count: 0,
      totalAmount: 0,
    };
    for (const [category, data] of categoryMap.entries()) {
      if (data.count > mostUsedCategory.count) {
        mostUsedCategory = {
          category: category as unknown as TransactionCategory,
          count: data.count,
          totalAmount: data.totalAmount,
        };
      }
    }

    // Calculate saving rate
    const savingRate = totalIncome > 0
      ? ((totalIncome - totalExpenses) / totalIncome) * 100
      : 0;

    // Calculate top spending day and average daily spend
    const groupedByDay = new Map<string, number>();
    let totalDays = 0;

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.WITHDRAWAL) {
        const transactionDate = new Date(transaction.createdAt);
        let key: string;

        if (period === 'week') {
          // Group by weekday (1 = Monday, 2 = Tuesday, ..., 7 = Sunday)
          // Convert from JavaScript's getDay() (0 = Sunday, 1 = Monday) to ISO 8601 (1 = Monday, 7 = Sunday)
          const jsDay = transactionDate.getDay();
          const weekday = jsDay === 0 ? 7 : jsDay; // Sunday becomes 7, Monday stays 1
          key = `weekday_${weekday}`;
        } else if (period === 'month') {
          // Group by date (YYYY-MM-DD)
          key = transactionDate.toISOString().split('T')[0];
        } else {
          // Group by month and year
          const month = transactionDate.getMonth();
          const year = transactionDate.getFullYear();
          key = `${year}_${month}`;
        }

        groupedByDay.set(key, (groupedByDay.get(key) || 0) + transaction.amount);
      }
    }

    // Calculate total unique days for average calculation
    if (period === 'week') {
      totalDays = 7;
    } else if (period === 'month') {
      const uniqueDays = new Set<string>();
      for (const transaction of transactions) {
        const date = new Date(transaction.createdAt).toISOString().split('T')[0];
        uniqueDays.add(date);
      }
      totalDays = uniqueDays.size || 1;
    } else {
      // For year, count unique months
      const uniqueMonths = new Set<string>();
      for (const transaction of transactions) {
        const date = new Date(transaction.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        uniqueMonths.add(`${year}_${month}`);
      }
      totalDays = uniqueMonths.size || 1;
    }

    // Find top spending day
    let topSpendingDay: GroupedTransactionStats;
    let maxAmount = 0;
    let topKey = '';

    for (const [key, amount] of groupedByDay.entries()) {
      if (amount > maxAmount) {
        maxAmount = amount;
        topKey = key;
      }
    }

    // Use anchor date or current date as fallback
    const anchorDate = date || new Date();

    if (period === 'week') {
      let weekday: number;
      if (topKey) {
        weekday = parseInt(topKey.split('_')[1] || '1', 10);
      } else {
        // Convert from JavaScript's getDay() to ISO 8601 format
        const jsDay = anchorDate.getDay();
        weekday = jsDay === 0 ? 7 : jsDay;
      }
      topSpendingDay = {
        period: 'week',
        weekday,
        totalAmount: maxAmount,
      };
    } else if (period === 'month') {
      topSpendingDay = {
        period: 'month',
        date: topKey || anchorDate.toISOString().split('T')[0],
        totalAmount: maxAmount,
      };
    } else {
      const [year, month] = topKey
        ? topKey.split('_').map(Number)
        : [anchorDate.getFullYear(), anchorDate.getMonth()];
      topSpendingDay = {
        period: 'year',
        month: month ?? anchorDate.getMonth(),
        year: year ?? anchorDate.getFullYear(),
        totalAmount: maxAmount,
      };
    }

    // Calculate average daily spend
    const avgDailySpend = totalDays > 0 ? totalExpenses / totalDays : 0;

    return {
      topSpendingDay,
      avgDailySpend,
      mostUsedCategory,
      savingRate,
      incomeVsExpenses: {
        income: totalIncome,
        expenses: totalExpenses,
      },
    };
  }
}
