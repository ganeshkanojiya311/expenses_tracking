import { BadRequestError } from '../../../core/ApiError';
import { User } from '../entities/user.entity';

export class CreateUserDTO implements Partial<User> {
  first_name!: string;
  last_name!: string;
  email!: string;
  password!: string;

  constructor(data: Partial<CreateUserDTO>) {
    Object.assign(this, data);
  }

  validate() {
    if (!this.first_name) {
      throw new BadRequestError('First name is required');
    }
    if (!this.last_name) {
      throw new BadRequestError('Last name is required');
    }
    if (!this.email) {
      throw new BadRequestError('Email is required');
    }
    if (!this.password) {
      throw new BadRequestError('Password is required');
    }
  }
}

export class LoginUserDTO implements Partial<User> {
  email!: string;
  password!: string;

  constructor(data: Partial<LoginUserDTO>) {
    Object.assign(this, data);
  }

  validate() {
    if (!this.email) {
      throw new BadRequestError('Email is required');
    }
    if (!this.password) {
      throw new BadRequestError('Password is required');
    }
  }
}
