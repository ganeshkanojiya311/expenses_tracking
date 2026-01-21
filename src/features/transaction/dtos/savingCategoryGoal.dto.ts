import { BadRequestError } from "../../../core/ApiError";

export class CreateSavingCategoryGoalDTO {
    id!: string;
    user_id!: string;
    category!: string;
    target_amount!: number;

    constructor(data: Partial<CreateSavingCategoryGoalDTO>) {
        Object.assign(this, data);
    }

    validate() {
        if (!this.user_id) {
            throw new BadRequestError('User ID is required');
        }
        if (!this.category) {
            throw new BadRequestError('Category is required');
        }
        if (!this.target_amount) {
            throw new BadRequestError('Target amount is required');
        }
    }
}

export class UpdateSavingCategoryGoalDTO {
    target_amount!: number;

    constructor(data: Partial<UpdateSavingCategoryGoalDTO>) {
        Object.assign(this, data);
    }

    validate() {
        if (!this.target_amount) {
            throw new BadRequestError('Target amount is required');
        }
    }
}