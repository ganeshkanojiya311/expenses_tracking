import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import { AuthService } from '../services/auth.service';
import { AuthValidation } from '../validations/auth.validation';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import { IAuthService } from '../interfaces/i-auth.service';

export class AuthController {
  private service: IAuthService;

  constructor() {
    this.service = new AuthService();
  }

  signupUser = [
    validator(AuthValidation.userSignup, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateUserDTO(req.body);
      const result = await this.service.signupUser(data);
      new SuccessResponse('User created successfully', result).send(res);
    }),
  ];

  loginUser = [
    validator(AuthValidation.userLogin, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new LoginUserDTO(req.body);
      const result = await this.service.loginUser(data);
      const token = await this.service.generateToken(result);
      new SuccessResponse('User Logged in successfully', {
        user: result,
        token,
      }).send(res);
    }),
  ];

  userMe = [
    validator(AuthValidation.auth, ValidationSource.HEADER),
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestError('Token is required');
      }
      const result = await this.service.userMe(token);
      new SuccessResponse('User details fetched successfully', result).send(
        res,
      );
    }),
  ];
}
