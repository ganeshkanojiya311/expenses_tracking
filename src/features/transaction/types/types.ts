import { TransactionCategory, TransactionType } from "../entities/transaction.entity";

export type CategoryTotal = {
  type: TransactionType;
  category: TransactionCategory;
  totalAmount: number;
  createdAt: Date;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PeriodFilter = "week" | "month" | "year";