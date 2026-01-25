import { TransactionCategory, TransactionType } from "../entities/transaction.entity";

export type CategoryTotal = {
  category: TransactionCategory;
  withdrawalTotal: number;
  depositTotal: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PeriodFilter = "week" | "month" | "year";

export type GroupedTransactionStats =
  | { period: 'week'; weekday: number; totalAmount: number }
  | { period: 'month'; date: string; totalAmount: number }
  | { period: 'year'; month: number; year: number; totalAmount: number };

export type AnalyticsResponse = {
  topSpendingDay: GroupedTransactionStats;
  avgDailySpend: number;
  mostUsedCategory: {
    category: TransactionCategory;
    count: number;
    totalAmount: number;
  };
  savingRate: number;
  incomeVsExpenses: {
    income: number;
    expenses: number;
  };
};