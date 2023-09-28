import { Router } from 'express';
import { authRoutes } from './auth';
import { productRoutes } from './product';
import { bakerRoutes } from './baker';
import { orderRoutes } from './order';

const router = Router();

router.use('', authRoutes);
router.use('/product', productRoutes);
router.use('/baker', bakerRoutes);
router.use('/order', orderRoutes);

export const indexRouter: Router = router;
