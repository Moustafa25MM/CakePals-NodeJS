import { NextFunction, Request, Response } from 'express';
import { ratingControllers } from '../controllers/rating';
import { orderControllers } from '../controllers/order';
import { productControllers } from '../controllers/product';

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

export const ratingMiddlewares = {
  createRating,
};
