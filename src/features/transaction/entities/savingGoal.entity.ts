export class SavingGoal {
  id!: string;
  user_id!: string;
  target_amount!: number;
  remaining_amount!: number;
  expenses_amount!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<SavingGoal>) {
    Object.assign(this, data);
  }

  toJSON () {
    return {
      id: this.id,
      user_id: this.user_id,
      target_amount: this.target_amount,
      remaining_amount: this.remaining_amount,
      expenses_amount: this.expenses_amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
