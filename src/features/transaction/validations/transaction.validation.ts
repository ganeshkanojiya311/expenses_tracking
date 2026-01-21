import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class TransactionValidation {
  static id = Joi.object({
    id: JoiObjectId().required(),
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required(),
  });

  static query = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    period: Joi.string().valid('week', 'month', 'year').optional(),
    date: Joi.date().iso().optional(),
    // Add other query params
  });

  static createTransaction = Joi.object({
    amount: Joi.number().min(0).required().messages({
      'number.min': 'Amount must be greater than 0',
      'any.required': 'Amount is required',
    }),
    type: Joi.string().required(),
    category: Joi.string().required(),
  });

  static createSavingGoal = Joi.object({
    target_amount: Joi.number().min(0).required().messages({
      'number.min': 'Target amount must be greater than 0',
      'any.required': 'Target amount is required',
    }),
  });
}
