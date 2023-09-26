import { models } from '../models';

const create = (ownerID: string, data: any) => {
  const productData = { ...data, ownerID };
  const product = models.Product.create(productData);
  return product;
};

const update = (productId: string, data: any) =>
  models.Product.findByIdAndUpdate(productId, data);

const getById = (productId: string) => models.Product.findById(productId);

export const productControllers = {
  create,
  update,
  getById,
};
