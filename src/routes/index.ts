import { Router } from 'express';
import { authRoutes } from './auth';
import { productRoutes } from './product';

const router = Router();

router.use('', authRoutes);
router.use('/product', productRoutes);

export const indexRouter: Router = router;
