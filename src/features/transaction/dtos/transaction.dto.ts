import { BadRequestError } from '../../../core/ApiError';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDTO implements Partial<Transaction> {
  id!: string;
  user_id!: string;
  amount!: number;
  type!: TransactionType;
  category!: TransactionCategory;

  constructor(data: Partial<CreateTransactionDTO>) {
    Object.assign(this, data);
  }

  validate() {
    if (!this.user_id) {
      throw new BadRequestError('User ID is required');
    }
    if (!this.amount) {
      throw new BadRequestError('Amount is required');
    }
    if (!this.type) {
      throw new BadRequestError('Type is required');
    }
    if (!this.category) {
      throw new BadRequestError('Category is required');
    }
  }
}
