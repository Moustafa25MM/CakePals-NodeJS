import { models } from '../models';

const create = (data: any) => models.Order.create(data);
const updateStatus = (orderId: string, status: string) =>
  models.Order.findByIdAndUpdate(orderId, { status });

const getByBakerId = (bakerId: string) =>
  models.Order.find({ 'productID.ownerID': bakerId });

export const orderControllers = {
  create,
  updateStatus,
  getByBakerId,
};
