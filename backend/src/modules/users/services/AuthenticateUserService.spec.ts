import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate an User', async () => {
    const user = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be not be able to authenticate a non existing User', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jonhdoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate an User with a wrong password', async () => {
    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'jonhdoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
