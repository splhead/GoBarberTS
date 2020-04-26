import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';

import User from '../models/User';

import AppError from '../errors/AppError';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: UserRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (checkUserExists) {
      throw new AppError({ message: 'This email already registred.' });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
