export interface TransactionType {
  DEPOSIT: 'deposit';
  WITHDRAWAL: 'withdrawal';
}

export interface TransactionCategory {
  FOOD: 'withdrawal';
  TRANSPORT: 'Transport';
  RENT: 'Rent';
  SHOPPING: 'Shopping';
  OTHER: 'Other';
  INCOME: 'Income';
}

export class Transaction {
  id!: string;
  user_id!: string;
  amount!: number;
  type!: TransactionType;
  category!: TransactionCategory;
  // note?: string;
  createdAt!: Date;

  constructor(data: Partial<Transaction>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      amount: this.amount,
      type: this.type,
      category: this.category,
      // note: this.note,
      createdAt: this.createdAt,
    };
  }
}
