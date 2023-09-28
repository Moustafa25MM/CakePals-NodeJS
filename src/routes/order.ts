import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { orderMiddlewares } from '../middlewares/order';

const router = Router();

router.post(
  '/create',
  authMethods.isMemberAuthorized,
  orderMiddlewares.placeOrder
);

router.get(
  '/baker-orders',
  authMethods.isBakerAuthorized,
  orderMiddlewares.getBakerOrders
);
export const orderRoutes: Router = router;
