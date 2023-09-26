import { Router } from 'express';
import { productUpload } from '../middlewares/imagesUpload';
import { productMiddlewares } from '../middlewares/product';

const router = Router();

router.post(
  '/create',
  productUpload.single('image'),
  productMiddlewares.createProduct
);

export const productRoutes: Router = router;
