import { NextFunction, Request, Response } from 'express';
import { userControllers } from '../controllers/user';
import { productControllers } from '../controllers/product';
import { cloudi } from './imagesUpload';
import { bakingTimeFunc } from '../libs/bakingTime';
import { Schema } from 'mongoose';
import { paginationOption } from '../libs/paginations';

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

type Owner = {
  _id: Schema.Types.ObjectId;
  street: string;
  city: string;
  country: string;
};

type Product = {
  _id: Schema.Types.ObjectId;
  type: string;
  ownerID: Schema.Types.ObjectId;
  price: number;
  image: string;
  bakingTime: string;
};

type ProductWithOwner = Product & {
  ownerID: Owner;
};

const listProducts = async (req: Request, res: Response) => {
  const { street, city, country, type, ...invalidParams } = req.query;

  if (Object.keys(invalidParams).length > 0) {
    return res.status(400).json({
      error:
        "Invalid query. Please filter by either 'type',''street ,'city' or 'country'.",
    });
  }

  let products: ProductWithOwner[];

  try {
    products = (await productControllers.list(
      {}
    )) as unknown as ProductWithOwner[];
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }

  if (type) {
    products = products.filter((product) => product.type === type);
  }

  if (street) {
    products = products.filter((product) => product.ownerID.street === street);
  }

  if (city) {
    products = products.filter((product) => product.ownerID.city === city);
  }

  if (country) {
    products = products.filter(
      (product) => product.ownerID.country === country
    );
  }
  let pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 5;
  pageSize = Math.min(20, pageSize);
  const totalDocs = products.length;
  const maxPageNumber = Math.ceil(totalDocs / pageSize);

  let pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
  const paginatedProducts = products.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);

  return res.status(200).json({
    pagination: paginationOptions,
    products: paginatedProducts,
  });
};

export const productMiddlewares = {
  createProduct,
  updateProduct,
  removeProduct,
  listProducts,
};
