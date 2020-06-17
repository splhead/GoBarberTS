import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IStoregeProvider from '@shared/containter/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStoregeProvider,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError({
        message: 'Only authenticated user can change avatar',
      });
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
