import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class AuthValidation {
  static id = Joi.object({
    id: JoiObjectId().required(),
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required(),
  });

  static query = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    // Add other query params
  });

  static userSignup = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  static userLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
}
