import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { ratingMiddlewares } from '../middlewares/rating';

const router = Router();

router.post(
  '/create',
  authMethods.isMemberAuthorized,
  ratingMiddlewares.createRating
);

router.get('/baker/:bakerId', ratingMiddlewares.getRatingsByBaker);

export const ratingRoutes: Router = router;
