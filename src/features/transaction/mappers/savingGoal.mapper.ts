import { SavingGoal } from '../entities/savingGoal.entity';
import { ISavingGoalDocument } from '../models/savingGoal.model';

export class SavingGoalMapper {
  static toEntity(doc: ISavingGoalDocument): SavingGoal {
    return new SavingGoal({
      id: doc._id.toString(),
      user_id: doc.user_id,
      target_amount: doc.target_amount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toModel(entity: Partial<SavingGoal>): Partial<ISavingGoalDocument> {
    const models: any = { ...entity };
    if (entity.id) {
      models._id = entity.id;
      delete models.id;
    }
    return models;
  }

  static toEntities(docs: ISavingGoalDocument[]): SavingGoal[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(
    entities: Partial<SavingGoal>[],
  ): Partial<ISavingGoalDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
