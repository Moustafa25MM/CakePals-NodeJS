import { Router } from 'express';
import { userPicUpload } from '../middlewares/imagesUpload';
import { register } from '../middlewares/register';

const router = Router();

router.post('/register', userPicUpload.single('profilePicture'), register);

export const authRoutes: Router = router;
