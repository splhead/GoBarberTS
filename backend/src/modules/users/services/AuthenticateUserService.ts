import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError({ message: 'Incorret email/password combination' });
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError({ message: 'Incorret email/password combination' });
    }

    const token = sign({}, authConfig.secret, {
      subject: user.id,
      expiresIn: authConfig.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
