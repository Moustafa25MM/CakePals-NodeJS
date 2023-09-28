import { Router } from 'express';
import { authRoutes } from './auth';
import { productRoutes } from './product';
import { bakerRoutes } from './baker';
import { orderRoutes } from './order';
import { ratingRoutes } from './rating';

const router = Router();

router.use('', authRoutes);
router.use('/product', productRoutes);
router.use('/baker', bakerRoutes);
router.use('/order', orderRoutes);
router.use('/rating', ratingRoutes);

export const indexRouter: Router = router;
