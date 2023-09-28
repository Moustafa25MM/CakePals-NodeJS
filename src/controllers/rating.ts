import { models } from '../models';

const create = (orderID: string, memberID: string, data: any) => {
  const ratingData = { ...data, orderID, memberID };
  const rating = models.Rating.create(ratingData);
  return rating;
};

const getByOrderId = (orderID: string) =>
  models.Rating.find({ orderID }).populate('memberID');

const getRatingsByBaker = (bakerID: string) =>
  models.Rating.find({ bakerID }).populate('memberID');

export const ratingControllers = {
  create,
  getByOrderId,
  getRatingsByBaker,
};
