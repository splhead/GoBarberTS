import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/containter/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import IMailProvider from '@shared/containter/providers/MailProvider/models/IMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

let fakeUsersRepository: IUsersRepository;
let fakeMailProvider: IMailProvider;
let fakeUserTokensRepository: IUserTokensRepository;

let sendForgoPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgoPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to send email to change password', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await sendForgoPasswordEmail.execute({ email: user.email });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send email to an non existing user', async () => {
    await expect(
      sendForgoPasswordEmail.execute({ email: 'jonhdoe@example.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate password forget token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123123',
    });

    await sendForgoPasswordEmail.execute({ email: user.email });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
