import { models } from '../models';

const create = (data: any) => models.Order.create(data);

const updateStatus = (orderId: string, status: string) =>
  models.Order.findByIdAndUpdate(orderId, { status }, { new: true });

const getById = (orderId: string) => models.Order.findById(orderId);

export const orderControllers = {
  create,
  updateStatus,
  getById,
};
