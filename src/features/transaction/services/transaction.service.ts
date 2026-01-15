import { BadRequestError, NotFoundError } from '../../../core/ApiError';
import { IAuthService } from '../../auth/interfaces/i-auth.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
} from '../dtos/savingGoal.dto';
import { CreateTransactionDTO } from '../dtos/transaction.dto';
import { SavingGoal } from '../entities/savingGoal.entity';
import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/i-transaction.repository';
import { ITransactionService } from '../interfaces/i-transaction.service';
import { TransactionRepository } from '../repositories/transaction.repository';

export class TransactionService implements ITransactionService {
  private repository: ITransactionRepository;
  private authService: IAuthService;
  constructor() {
    this.repository = new TransactionRepository();
    this.authService = new AuthService();
  }

  async createTransaction(
    token: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    if (!id) {
      throw new NotFoundError('Invalid token payload');
    }
    const modelData = new CreateTransactionDTO({ ...data, user_id: id });
    modelData.validate();
    const transaction = await this.repository.createTransaction(modelData);
    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.repository.getAllTransactions();
  }

  async getTransactionsByUserId(token: string): Promise<Transaction[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getTransactionsByUserId(
      id || '',
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    return transactions;
  }

  async getRecentTransactions(
    limit: number,
    token: string,
  ): Promise<Transaction[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getRecentTransactions(
      limit,
      id || '',
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    return transactions;
  }

  async getTransactionsByCategory(
    category: string,
    token: string,
  ): Promise<Transaction[]> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const transactions = await this.repository.getTransactionsByCategory(
      category,
      id || '',
    );
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions not found');
    }
    return transactions;
  }

  async createSavingGoal(
    token: string,
    data: Partial<CreateSavingGoalDTO>,
  ): Promise<SavingGoal> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    if (!id) {
      throw new NotFoundError('Invalid token payload');
    }
    const modelData = new CreateSavingGoalDTO({ ...data, user_id: id });
    modelData.validate();
    const savingGoal = await this.repository.createSavingGoal(modelData);
    return savingGoal;
  }

  async getSavingGoalByUserId(token: string): Promise<SavingGoal | null> {
    const { valid, id } = await this.authService.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const savingGoal = await this.repository.getSavingGoalByUserId(id || '');
    if (!savingGoal) {
      throw new NotFoundError('Saving goal not found');
    }
    return savingGoal;
  }

  async updateSavingGoal(
    id: string,
    data: UpdateSavingGoalDTO,
  ): Promise<SavingGoal | null> {
    data.validate();
    const savingGoal = await this.repository.updateSavingGoal(id, data);
    if (!savingGoal) {
      throw new NotFoundError('Saving goal not found');
    }
    return savingGoal;
  }
}
