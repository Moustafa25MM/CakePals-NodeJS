import { NextFunction, Request, Response } from 'express';
import { userControllers } from '../controllers/user';
import { productControllers } from '../controllers/product';
import { cloudi } from './imagesUpload';
import { bakingTimeFunc } from '../libs/bakingTime';

const createProduct = async (req: any, res: Response, next: NextFunction) => {
  const ownerID = req.user.id;
  const { type, price, bakingTime } = req.body;
  if (!type) {
    return res.status(404).json({ error: 'type not found' });
  }
  if (type.length < 3) {
    return res.status(404).json({ error: 'type should have 3 chars at least' });
  }
  if (!price) {
    return res.status(404).json({ error: 'Price not found' });
  }
  if (price < 9) {
    return res.status(404).json({ error: 'price should be at least 9' });
  }
  if (req.user?.type !== 'Baker') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const bakingTimeStr = req.body.bakingTime;

  try {
    let bakingTimePass;
    try {
      bakingTimePass = bakingTimeFunc(bakingTimeStr);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
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
      bakingTime: bakingTimePass.toString() + ' hours',
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req: any, res: Response, next: NextFunction) => {
  const ownerID = req.user.id;
  const productId = req.params.productId;
  const { type, price, bakingTime } = req.body;

  if (req.user?.type !== 'Baker') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const bakingTimeStr = req.body.bakingTime;
  try {
    let bakingTimePass;
    try {
      bakingTimePass = bakingTimeFunc(bakingTimeStr);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
    let image = '';

    if (req.file) {
      const uploadedImg = req.file.path;
      const images = await cloudi.uploader.upload(uploadedImg, {
        public_id: `${productId}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      image = images.url;
    } else {
      const product = await productControllers.getById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (product?.ownerID != ownerID) {
        return res
          .status(403)
          .json({ error: 'Access denied. You do not own this product.' });
      }
      image = product.image;
    }

    const product = await productControllers.update(productId, {
      type,
      image,
      price,
      bakingTime: bakingTimePass.toString() + ' hours',
    });
    const updatedProduct = await productControllers.getById(productId);
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const removeProduct = async (req: any, res: Response) => {
  const { productId } = req.params;
  const ownerID = req.user.id;
  try {
    const user = await userControllers.getUserById(ownerID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const product = await productControllers.getById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product?.ownerID != ownerID) {
      return res
        .status(403)
        .json({ error: 'Access denied. You do not own this product.' });
    }
    const result = await productControllers.remove(productId);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const productMiddlewares = {
  createProduct,
  updateProduct,
  removeProduct,
};
