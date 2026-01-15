import { User } from '../entities/user.entity';
import { IUserDocument } from '../models/user.model';

export class UserMapper {
  static toEntity(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      first_name: doc.first_name,
      last_name: doc.last_name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toModel(entity: Partial<User>): Partial<IUserDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IUserDocument[]): User[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(entities: Partial<User>[]): Partial<IUserDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
