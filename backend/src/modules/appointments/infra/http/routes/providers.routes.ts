import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import ProviderDayAvailability from '../controllers/ProviderDayAvailability';
import ProviderMonthAvailability from '../controllers/ProviderMonthAvailability';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailability = new ProviderDayAvailability();
const providerMonthAvailability = new ProviderMonthAvailability();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailability.index,
);

providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailability.index,
);

export default providersRouter;
