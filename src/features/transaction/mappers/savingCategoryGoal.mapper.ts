import { SavingCategoryGoal } from "../entities/savingCategoryGoal.entity";
import { ISavingCategoryGoalDocument } from "../models/savingCategoryGoal.model";

export class SavingCategoryGoalMapper {
    static toEntity(doc: ISavingCategoryGoalDocument): SavingCategoryGoal {
        return new SavingCategoryGoal({
            id: doc._id.toString(),
            user_id: doc.user_id,
            category: doc.category,
            target_amount: doc.target_amount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    static toModel(entity: Partial<SavingCategoryGoal>): Partial<ISavingCategoryGoalDocument> {
        const model: any = { ...entity };
        if (entity.id) {
            model._id = entity.id;
            delete model.id;
        }
        return model;
    }

    static toEntities(docs: ISavingCategoryGoalDocument[]): SavingCategoryGoal[] {
        return docs.map((doc) => this.toEntity(doc));
    }

    static toModels(
        entities: Partial<SavingCategoryGoal>[],
    ): Partial<ISavingCategoryGoalDocument>[] {
        return entities.map((entity) => this.toModel(entity));
    }
}