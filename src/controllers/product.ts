import { models } from '../models';

const create = (ownerID: string, data: any) => {
  const productData = { ...data, ownerID };
  const product = models.Product.create(productData);
  return product;
};

const update = (productId: string, data: any) =>
  models.Product.findByIdAndUpdate(productId, data);

const getById = (productId: any) => models.Product.findById(productId);

const remove = (productId: string) =>
  models.Product.findByIdAndRemove(productId);

const list = (filter: any) => models.Product.find(filter).populate('ownerID');

export const productControllers = {
  create,
  update,
  getById,
  remove,
  list,
};
