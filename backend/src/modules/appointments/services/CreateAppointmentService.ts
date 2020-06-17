import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import { getHours, isBefore, startOfHour, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError({
        message: "You can't create an appointment on a past date",
      });
    }

    if (user_id === provider_id) {
      throw new AppError({
        message: "You can't create an appointment with yourself",
      });
    }

    const appointmentHour = getHours(appointmentDate);

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError({
        message: 'You can only create an appointment between 8am and 5pm',
      });
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    console.log(findAppointmentInSameDate);

    if (findAppointmentInSameDate) {
      throw new AppError({ message: 'This appointment is already booked' });
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
