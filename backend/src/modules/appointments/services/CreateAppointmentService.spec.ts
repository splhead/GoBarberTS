import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/containter/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new Appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'id-provider',
      user_id: 'id-user',
      date: new Date(2020, 5, 14, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('id-provider');
  });

  it("shouldn't be able to create two appointment in the same time", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 12).getTime();
    });

    await createAppointment.execute({
      provider_id: 'id-provider',
      user_id: 'id-user',
      date: new Date(2020, 5, 15, 13),
    });

    await expect(
      createAppointment.execute({
        provider_id: 'id-provider',
        user_id: 'id-user',
        date: new Date(2020, 5, 15, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'id-provider',
        user_id: 'id-user',
        date: new Date(2020, 5, 14, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'same-id',
        user_id: 'same-id',
        date: new Date(2020, 5, 14, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 20).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 5, 15, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 5, 15, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
