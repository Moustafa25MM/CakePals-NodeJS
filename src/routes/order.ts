import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { orderMiddlewares } from '../middlewares/order';

const router = Router();

router.post(
  '/create',
  authMethods.isMemberAuthorized,
  orderMiddlewares.placeOrder
);

export const orderRoutes: Router = router;
