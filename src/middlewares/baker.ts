import { Request, Response } from 'express';
import { cloudi } from './imagesUpload';
import { authMethods } from './auth';
import { userControllers } from '../controllers/user';

const getBakerById = async (req: Request, res: Response) => {
  try {
    const baker = await userControllers.getBakerById(req.params.id);
    if (!baker) {
      return res.status(404).json({ error: 'Baker not found' });
    }
    return res.status(200).json(baker);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllBakers = async (req: Request, res: Response) => {
  try {
    const bakers = await userControllers.getAllBakers();
    return res.status(200).json(bakers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const bakerMiddlewares = {
  getBakerById,
  getAllBakers,
};
