import mongoose, { Schema } from 'mongoose';
import { SavingGoal } from '../entities/savingGoal.entity';

export interface ISavingGoalDocument extends Omit<
  SavingGoal,
  'toJSON' | 'toObject' | 'id'
> {
  _id: mongoose.Types.ObjectId;
}

const SavingGoalSchema = new Schema<ISavingGoalDocument>(
  {
    user_id: {
      type: String,
      required: true,
    },
    target_amount: {
      type: Number,
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

export const SavingGoalModel = mongoose.model<ISavingGoalDocument>(
  'SavingGoal',
  SavingGoalSchema,
);
