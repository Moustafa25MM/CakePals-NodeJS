import { Router } from 'express';
import { userPicUpload } from '../middlewares/imagesUpload';
import { bakerMiddlewares } from '../middlewares/baker';

const router = Router();

router.get('/all', bakerMiddlewares.getAllBakers);
router.get('/:id', bakerMiddlewares.getBakerById);

export const bakerRoutes: Router = router;
