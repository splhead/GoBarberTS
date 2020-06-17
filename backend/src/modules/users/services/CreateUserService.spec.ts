import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new User', async () => {
    const User = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    expect(User).toHaveProperty('id');
    expect(User.name).toBe('Jonh Doe');
  });

  it('should do not be able to create two users with the same email', async () => {
    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await expect(
      createUser.execute({
        name: 'Jonh Doe',
        email: 'jonhdoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
