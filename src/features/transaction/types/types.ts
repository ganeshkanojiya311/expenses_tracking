import { TransactionCategory, TransactionType } from "../entities/transaction.entity";

export type CategoryTotal = {
    type: TransactionType;
    category: TransactionCategory;
    totalAmount: number;
    createdAt: Date;
};