import mongoose, { Document, Schema } from 'mongoose';
import type { Auth } from '../entities/auth.entity';

export interface IAuthDocument
  extends Omit<Auth, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const AuthSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
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

export const AuthModel = mongoose.model<IAuthDocument>('Auth', AuthSchema);
