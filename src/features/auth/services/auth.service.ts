import { BadRequestError, NotFoundError } from '../../../core/ApiError';
import JWT from '../../../core/JWT';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { IAuthService } from '../interfaces/i-auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import bcrypt from 'bcrypt';

export class AuthService implements IAuthService {
  private repository: IAuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async signupUser(data: CreateUserDTO): Promise<User> {
    data.validate();
    const existingUser = await this.repository.findExistingUser({
      email: data.email,
    });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.repository.createUser(
      new CreateUserDTO({ ...data, password: hashedPassword }),
    );
    return user;
  }

  async loginUser(data: LoginUserDTO): Promise<User> {
    data.validate();
    const user = await this.repository.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.getAllUsers();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.repository.deleteUser(id);
  }

  async userMe(token: string): Promise<User> {
    const { valid, id } = await this.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const user = await this.repository.findUserById(id || '');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async generateToken(user: User): Promise<string> {
    return await JWT.encode({
      aud: 'user',
      sub: user.id,
      iss: 'api',
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
      prm: JSON.stringify({
        id: user.id,
        type: 'user',
      }),
    });
  }

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; id: string | null }> {
    try {
      const payload = await JWT.decode(token);

      // Validate audience and issuer
      if (payload.aud !== 'user' || payload.iss !== 'api') {
        return { valid: false, id: null };
      }

      // Validate expiration
      const now = new Date().getTime();
      if (payload.exp < now) {
        return { valid: false, id: null };
      }

      // Get user from payload
      const id = payload.sub;

      return {
        valid: !!id,
        id: id,
      };
    } catch (error) {
      return { valid: false, id: null };
    }
  }
}
