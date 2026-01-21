import mongoose, { Schema } from "mongoose";
import { SavingCategoryGoal } from "../entities/savingCategoryGoal.entity";

export interface ISavingCategoryGoalDocument extends Omit<
  SavingCategoryGoal,
  'toJSON' | 'toObject' | 'id'
> {
  _id: mongoose.Types.ObjectId;
}

const SavingCategoryGoalSchema = new Schema<ISavingCategoryGoalDocument>(
  {
    user_id: {
      type: String,
      required: true,
    },
    category: {
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

export const SavingCategoryGoalModel = mongoose.model<ISavingCategoryGoalDocument>(
  'SavingCategoryGoal',
  SavingCategoryGoalSchema,
);