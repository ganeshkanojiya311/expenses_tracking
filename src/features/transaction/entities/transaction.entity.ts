export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export interface TransactionCategory {
  FOOD: 'Food';
  TRANSPORT: 'Transport';
  RENT: 'Rent';
  SHOPPING: 'Shopping';
  OTHER: 'Other';
}

export class Transaction {
  id!: string;
  user_id!: string;
  amount!: number;
  type!: TransactionType;
  category!: TransactionCategory;
  createdAt!: Date;

  constructor(data: Partial<Transaction>) {
    Object.assign(this, data);
  }

  toJSON () {
    return {
      id: this.id,
      user_id: this.user_id,
      amount: this.amount,
      type: this.type,
      category: this.category,
      createdAt: this.createdAt,
    };
  }
}
