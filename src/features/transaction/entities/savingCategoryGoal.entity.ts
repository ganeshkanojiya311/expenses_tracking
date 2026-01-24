export class SavingCategoryGoal {
    id!: string;
    user_id!: string;
    category!: string;
    target_amount!: number;
    remaining_amount!: number;
    expenses_amount!: number;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<SavingCategoryGoal>) {
        Object.assign(this, data);
    }

    toJSON () {
        return {
            id: this.id,
            user_id: this.user_id,
            category: this.category,
            target_amount: this.target_amount,
            remaining_amount: this.remaining_amount,
            expenses_amount: this.expenses_amount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}