import { NextFunction, Request, Response } from 'express';
import { orderControllers } from '../controllers/order';
import { productControllers } from '../controllers/product';
import { userControllers } from '../controllers/user';
import { models } from '../models';

const placeOrder = async (req: any, res: Response, next: NextFunction) => {
  const memberID = req.user.id;
  const { productID, collectionTime, paymentMethod } = req.body;

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

    let adjustedBakerStartTime = new Date(
      bakerStartTime.getTime() + bakingTimeHours * 60 * 60 * 1000
    );
    if (
      bakingStartTime < bakerStartTime ||
      desiredCollectionDate > bakerEndTime
    ) {
      return res.status(400).json({
        error: 'Collection time outside baker availability',
        bakerAvailability: {
          start: adjustedBakerStartTime.toISOString(),
          end: bakerEndTime.toISOString(),
        },
      });
    }

    const overlappingOrder = await models.Order.findOne({
      productID: product._id,
      status: 'accepted',
      $or: [
        {
          bakingStartTime: {
            $lte: desiredCollectionDate,
            $gte: bakingStartTime,
          },
        },
        {
          collectionTime: {
            $lte: desiredCollectionDate,
            $gt: bakingStartTime,
          },
        },
      ],
    }).populate({
      path: 'productID',
      match: { ownerID: baker._id },
    });
    if (overlappingOrder && overlappingOrder.productID) {
      const lastOrderBeforeDesired = await models.Order.findOne({
        productID: product._id,
        status: 'accepted',
        collectionTime: { $lt: desiredCollectionDate },
      }).sort('-collectionTime');

      if (!lastOrderBeforeDesired) {
        return res.status(400).json({
          error: 'There is an overlapping order',
          nextAvailableDate: null,
        });
      }

      let bakingTimeHours = parseInt(product.bakingTime.split(' ')[0]);
      let nextAvailableDate = new Date(
        new Date(lastOrderBeforeDesired.collectionTime).getTime() +
          bakingTimeHours * 60 * 60 * 1000
      );

      return res.status(400).json({
        error: 'There is an overlapping order',
        nextAvailableDate: nextAvailableDate.toISOString(),
      });
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

const getBakerOrders = async (req: any, res: Response, next: NextFunction) => {
  const bakerID = req.user.id;
  const { status } = req.query;

  const validStatuses = ['pending', 'accepted', 'rejected', 'fulfilled'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const queryKeys = Object.keys(req.query);
  if (
    queryKeys.length > 1 ||
    (queryKeys.length === 1 && !queryKeys.includes('status'))
  ) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }
  try {
    const products = await models.Product.find({
      ownerID: bakerID,
    });
    let productIds = products.map((product) => product._id);

    let orders;
    if (status) {
      orders = await models.Order.find({
        productID: { $in: productIds },
        status,
      });
    } else {
      orders = await models.Order.find({
        productID: { $in: productIds },
      });
    }

    if (!orders) {
      return res.status(404).json({ error: 'No orders found' });
    }
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const acceptOrder = async (req: any, res: Response, next: NextFunction) => {
  const bakerID = req.user.id;
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({ error: 'Invalid order id' });
    }
    const order = await orderControllers.getById(orderId);
    if (!order) {
      return res.status(400).json({ error: 'order is not found' });
    }
    const productId = order.productID;
    const product = await productControllers.getById(productId);
    if (bakerID !== String(product?.ownerID)) {
      return res.status(400).json({ error: 'order is not yours to accept' });
    }

    const overlappingOrder = await models.Order.findOne({
      productID: product?._id,
      status: 'accepted',
      $or: [
        {
          bakingStartTime: {
            $lte: order.collectionTime,
            $gte: order.bakingStartTime,
          },
        },
        {
          collectionTime: {
            $lte: order.collectionTime,
            $gt: order.bakingStartTime,
          },
        },
      ],
    }).populate({
      path: 'productID',
      match: { ownerID: bakerID },
    });

    if (overlappingOrder && overlappingOrder.productID) {
      return res.status(400).json({ error: 'There is an overlapping order' });
    }
    const updatedOrder = await orderControllers.updateStatus(
      orderId,
      'accepted'
    );
    if (!updatedOrder) {
      return res
        .status(400)
        .json({ error: 'Order not found or update failed' });
    }
    return res.status(200).json(updatedOrder);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const rejectOrder = async (req: any, res: Response, next: NextFunction) => {
  const bakerID = req.user.id;

  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({ error: 'Invalid order id' });
    }
    const order = await orderControllers.getById(orderId);
    if (!order) {
      return res.status(400).json({ error: 'order is not found' });
    }
    const productId = order.productID;
    const product = await productControllers.getById(productId);
    if (bakerID !== String(product?.ownerID)) {
      return res.status(400).json({ error: 'order is not yours to reject' });
    }
    const updatedOrder = await orderControllers.updateStatus(
      orderId,
      'rejected'
    );
    if (!updatedOrder) {
      return res
        .status(400)
        .json({ error: 'Order not found or update failed' });
    }
    return res.status(200).json(updatedOrder);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const fulfillOrder = async (req: any, res: Response, next: NextFunction) => {
  const bakerID = req.user.id;
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({ error: 'Invalid order id' });
    }
    const order = await orderControllers.getById(orderId);
    if (!order) {
      return res.status(400).json({ error: 'order is not found' });
    }
    if (order.status !== 'accepted') {
      return res.status(400).json({ error: 'you should accept it first' });
    }
    const productId = order.productID;
    const product = await productControllers.getById(productId);
    if (bakerID !== String(product?.ownerID)) {
      return res.status(400).json({ error: 'order is not yours to fulfil' });
    }
    const updatedOrder = await orderControllers.updateStatus(
      orderId,
      'fulfilled'
    );
    if (!updatedOrder) {
      return res
        .status(400)
        .json({ error: 'Order not found or update failed' });
    }
    return res.status(200).json(updatedOrder);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const orderMiddlewares = {
  placeOrder,
  getBakerOrders,
  acceptOrder,
  rejectOrder,
  fulfillOrder,
};
