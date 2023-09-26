import { models } from '../models';

const create = (ownerID: string, data: any) => {
  const productData = { ...data, ownerID };
  const product = models.Product.create(productData);
  return product;
};

export const productControllers = {
  create,
};
