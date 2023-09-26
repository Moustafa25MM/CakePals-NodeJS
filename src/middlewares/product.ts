import { NextFunction, Request, Response } from 'express';
import { userControllers } from '../controllers/user';
import { productControllers } from '../controllers/product';
import { cloudi } from './imagesUpload';

const createProduct = async (req: any, res: Response, next: NextFunction) => {
  const ownerID = req.user.id;
  const { type, price, bakingTime } = req.body;
  if (!type) {
    return res.status(404).json({ error: 'type not found' });
  }
  if (type.length < 5) {
    return res.status(404).json({ error: 'type should have 5 chars at least' });
  }
  if (!price) {
    return res.status(404).json({ error: 'Price not found' });
  }
  if (price < 9) {
    return res.status(404).json({ error: 'price should be at least 9' });
  }
  const bakingTimeStr = req.body.bakingTime;
  let bakingTimes: number;

  if (typeof bakingTimeStr === 'string') {
    const match = bakingTimeStr.match(/(\d+)(m|h|minutes|hours)/i);

    if (match) {
      const quantity = Number(match[1]);
      const unit = match[2].toLowerCase();

      if (unit === 'm' || unit === 'minutes') {
        bakingTimes = quantity >= 60 ? quantity / 60 : quantity / 60.0; // convert to hours
      } else {
        bakingTimes = quantity;
      }
    } else {
      return res.status(400).json({
        error: 'Invalid baking time format. Use h, hours, m, or minutes.',
      });
    }
  } else {
    return res
      .status(400)
      .json({ error: 'Baking time not provided or not a string.' });
  }

  try {
    const user = await userControllers.getUserById(ownerID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let image: any = '';
    if (!req.file) {
      return res.status(400).json({ error: 'No Image was uploaded' });
    } else {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      image = uploadedImg.url;
    }

    const product = await productControllers.create(ownerID, {
      type,
      image,
      price,
      bakingTime,
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const productMiddlewares = {
  createProduct,
};
