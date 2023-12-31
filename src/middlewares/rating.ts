import { NextFunction, Request, Response } from 'express';
import { ratingControllers } from '../controllers/rating';
import { orderControllers } from '../controllers/order';
import { productControllers } from '../controllers/product';
import { userControllers } from '../controllers/user';
import { paginationOption } from '../libs/paginations';

const createRating = async (req: any, res: Response, next: NextFunction) => {
  const memberId = req.user.id;
  const { orderId, rate, comment } = req.body;

  const order = await orderControllers.getById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.status !== 'fulfilled') {
    return res
      .status(400)
      .json({ error: 'Only fulfilled orders can be rated' });
  }
  const productId = order.productID;
  const product = await productControllers.getById(productId);
  const bakerID = product?.ownerID;

  if (req.user?.type !== 'Member') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (req.user?.id !== String(order.memberID)) {
    return res.status(403).json({ error: 'this order is not yours to rate' });
  }

  const rating = await ratingControllers.create(orderId, memberId, {
    rate,
    comment,
    bakerID,
  });
  return res.status(201).json(rating);
};

const getRatingsByBaker = async (req: Request, res: Response) => {
  const { bakerId } = req.params;

  const ratings = await ratingControllers.getRatingsByBaker(bakerId);
  if (!ratings) {
    return res.status(404).json({ error: 'No ratings found for this baker' });
  }

  const result = ratings.map((rating) => {
    return {
      memberId: rating.memberID,
      rate: rating.rate,
      comment: rating.comment,
    };
  });

  const totalRate = ratings.reduce((sum, rating) => sum + rating.rate, 0);
  const avgRate = totalRate / ratings.length;

  const baker = await userControllers.getBakerById(bakerId);
  baker.rating = avgRate;
  await baker.save();

  let pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 5;
  pageSize = Math.min(20, pageSize);
  const totalDocs = result.length;
  const maxPageNumber = Math.ceil(totalDocs / pageSize);

  let pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
  const paginatedRatings = result.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
  return res.status(200).json({
    avgRate,
    pagination: paginationOptions,
    ratings: paginatedRatings,
  });
};

export const ratingMiddlewares = {
  createRating,
  getRatingsByBaker,
};
