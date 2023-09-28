import { populate } from 'dotenv';
import { models } from '../models';

const create = (data: any) => models.Order.create(data);

const updateStatus = (orderId: string, status: string) =>
  models.Order.findByIdAndUpdate(orderId, { status }, { new: true });

export const orderControllers = {
  create,
  updateStatus,
};
