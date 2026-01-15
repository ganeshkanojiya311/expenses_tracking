import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export interface IAuthService {
  signupUser(data: CreateUserDTO): Promise<User>;
  loginUser(data: LoginUserDTO): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  userMe(token: string): Promise<User>;
  generateToken(user: User): Promise<string>;
  validateToken(token: string): Promise<{ valid: boolean; id: string | null }>;
}
