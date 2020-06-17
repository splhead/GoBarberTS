import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;

let fakeHashProvider: IHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Doe Doe',
      email: 'jonhdoedoe@home.com',
    });

    expect(updatedUser.name).toBe('Jonh Doe Doe');
    expect(updatedUser.email).toBe('jonhdoedoe@home.com');
  });

  it('should not be able to update email to one already used', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jonh Banana',
      email: 'test@example.com',
      password: '190987',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Doe Doe',
        email: 'jonhdoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Doe Doe',
      email: 'jonhdoedoe@home.com',
      old_password: '123123',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be to update the password without inform old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Doe Doe',
        email: 'jonhdoedoe@home.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Doe Doe',
        email: 'jonhdoedoe@home.com',
        old_password: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Jonh Doe Doe',
        email: 'jonhdoedoe@home.com',
        old_password: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
