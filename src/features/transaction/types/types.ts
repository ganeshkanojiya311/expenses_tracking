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