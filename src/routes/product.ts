import { Router } from 'express';
import { productUpload } from '../middlewares/imagesUpload';
import { productMiddlewares } from '../middlewares/product';
import { authMethods } from '../middlewares/auth';

const router = Router();

router.post(
  '/create',
  productUpload.single('image'),
  authMethods.isBakerAuthorized,
  productMiddlewares.createProduct
);

router.patch(
  '/update/:productId',
  productUpload.single('image'),
  authMethods.isBakerAuthorized,
  productMiddlewares.updateProduct
);

router.delete(
  '/delete/:productId',
  authMethods.isBakerAuthorized,
  productMiddlewares.removeProduct
);

export const productRoutes: Router = router;
