import { Router } from 'express';
import { userPicUpload } from '../middlewares/imagesUpload';
import { register } from '../middlewares/register';
import { userLogin } from '../middlewares/login';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello from CakePals');
});
router.post('/register', userPicUpload.single('profilePicture'), register);
router.post('/login', userLogin);

export const authRoutes: Router = router;
