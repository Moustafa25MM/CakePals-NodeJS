import { Router } from 'express';
import { authRoutes } from './auth';
import { productRoutes } from './product';
import { bakerRoutes } from './baker';

const router = Router();

router.use('', authRoutes);
router.use('/product', productRoutes);
router.use('/baker', bakerRoutes);

export const indexRouter: Router = router;
