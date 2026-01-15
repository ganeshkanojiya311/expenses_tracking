import { CreateUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  findExistingUser({ email }: { email?: string }): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
