import bcrypt from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IUserRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError({ message: 'This email already registred.' });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}

export default CreateUserService;
