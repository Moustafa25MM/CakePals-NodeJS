import { NextFunction, Request, Response } from 'express';
import { orderControllers } from '../controllers/order';
import { productControllers } from '../controllers/product';
import { userControllers } from '../controllers/user';
import { models } from 'mongoose';

const placeOrder = async (req: any, res: Response, next: NextFunction) => {
  const memberID = req.user.id;
  const { productID, collectionTime, paymentMethod } = req.body;

  // assuming collectionTime is in format "HH:mm"
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = collectionTime.split(':');

  try {
    const product = await productControllers.getById(productID);
    if (!product) {
      return res.status(400).json({ error: 'product not found!' });
    }
    const baker = await userControllers.getBakerById(
      product.ownerID.toString()
    );
    const bakingTimeHours = parseInt(product.bakingTime.split(' ')[0]);

    let desiredCollectionDate = new Date(
      Date.UTC(year, month, day, hours, minutes)
    );
    let bakingStartTime = new Date(
      desiredCollectionDate.getTime() - bakingTimeHours * 60 * 60 * 1000
    );
    let bakerStartTime = new Date(baker.collectionTimeRange.start);
    let bakerEndTime = new Date(baker.collectionTimeRange.end);

    if (
      bakingStartTime < bakerStartTime ||
      desiredCollectionDate > bakerEndTime
    ) {
      return res
        .status(400)
        .json({ error: 'Collection time outside baker availability' });
    }
    const overlappingOrder = await models.Order.findOne({
      'productID.ownerID': baker._id,
      status: 'accepted',
      $or: [
        {
          bakingStartTime: {
            $lt: desiredCollectionDate,
            $gt: bakingStartTime,
          },
        },
        {
          collectionTime: {
            $lt: desiredCollectionDate,
            $gt: bakingStartTime,
          },
        },
      ],
    });
    if (overlappingOrder) {
      return res.status(400).json({ error: 'There is an overlapping order' });
    }
    const orderData = {
      memberID,
      productID,
      bakingStartTime: bakingStartTime.toISOString(),
      collectionTime: desiredCollectionDate.toISOString(),
      paymentMethod,
      status: 'pending',
    };

    const order = await models.Order.create(orderData);
    if (!order) {
      return res.status(400).json({ error: 'failed to place order' });
    }
    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const orderMiddlewares = {
  placeOrder,
};
