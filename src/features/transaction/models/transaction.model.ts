import mongoose, { Schema } from 'mongoose';
import { Transaction } from '../entities/transaction.entity';

export interface ITransactionDocument extends Omit<
  Transaction,
  'toJSON' | 'toObject' | 'id'
> {
  _id: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    user_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const TransactionModel = mongoose.model<ITransactionDocument>(
  'Transaction',
  TransactionSchema,
);
