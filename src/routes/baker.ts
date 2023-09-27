import { Router } from 'express';
import { userPicUpload } from '../middlewares/imagesUpload';
import { bakerMiddlewares } from '../middlewares/baker';
import { authMethods } from '../middlewares/auth';

const router = Router();

router.patch(
  '/update/:id',
  userPicUpload.single('profilePicture'),
  authMethods.isBakerAuthorized,
  bakerMiddlewares.updateBaker
);
router.get('/all', bakerMiddlewares.getAllBakers);
router.get('/:id', bakerMiddlewares.getBakerById);

export const bakerRoutes: Router = router;
