import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ListProvidersService from './ListProvidersService';

// import AppError from '@shared/errors/AppError';

let fakeUsersRepository: IUsersRepository;

let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jonh Trê',
      email: 'jonhtre@example.com',
      password: '123412',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Jonh Qua',
      email: 'jonhqua@example.com',
      password: '112233',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
