import { BadRequestError } from '../../../core/ApiError';
import { SavingGoal } from '../entities/savingGoal.entity';

export class CreateSavingGoalDTO implements Partial<SavingGoal> {
  id!: string;
  user_id!: string;
  target_amount!: number;

  constructor(data: Partial<CreateSavingGoalDTO>) {
    Object.assign(this, data);
  }

  validate() {
    if (!this.user_id) {
      throw new BadRequestError('User ID is required');
    }
    if (!this.target_amount) {
      throw new BadRequestError('Target amount is required');
    }
  }
}

export class UpdateSavingGoalDTO implements Partial<SavingGoal> {
  target_amount!: number;

  constructor(data: Partial<UpdateSavingGoalDTO>) {
    Object.assign(this, data);
  }

  validate() {
    if (!this.target_amount) {
      throw new BadRequestError('Target amount is required');
    }
  }
}
