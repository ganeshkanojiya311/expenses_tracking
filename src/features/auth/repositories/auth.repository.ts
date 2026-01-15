import { CreateUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UserModel } from '../models/user.model';

export class AuthRepository implements IAuthRepository {
  async createUser(data: CreateUserDTO): Promise<User> {
    const modelData = UserMapper.toModel(data);
    const created = await UserModel.create(modelData);
    return UserMapper.toEntity(created);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? UserMapper.toEntity(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? UserMapper.toEntity(user) : null;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return UserMapper.toEntities(users);
  }

  async findExistingUser({ email }: { email?: string }): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? UserMapper.toEntity(user) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}
