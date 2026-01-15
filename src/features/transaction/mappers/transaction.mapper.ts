import {
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../entities/transaction.entity';
import { ITransactionDocument } from '../models/transaction.model';

export class TransactionMapper {
  static toEntity(doc: ITransactionDocument): Transaction {
    return new Transaction({
      id: doc._id.toString(),
      user_id: doc.user_id,
      amount: doc.amount,
      type: doc.type as TransactionType,
      category: doc.category as TransactionCategory,
      createdAt: doc.createdAt,
    });
  }

  static toModel(entity: Partial<Transaction>): Partial<ITransactionDocument> {
    const models: any = { ...entity };
    if (entity.id) {
      models._id = entity.id;
      delete models.id;
    }
    return models;
  }

  static toEntities(docs: ITransactionDocument[]): Transaction[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(
    entities: Partial<Transaction>[],
  ): Partial<ITransactionDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
