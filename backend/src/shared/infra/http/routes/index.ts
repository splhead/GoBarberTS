import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordsRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);

export default routes;
