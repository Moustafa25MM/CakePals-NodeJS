import mongoose, { Document, Schema } from 'mongoose';

interface ORDER extends Document {
  memberID: Schema.Types.ObjectId;
  productID: Schema.Types.ObjectId;
  bakingStartTime: Date;
  collectionTime: Date;
  paymentMethod: string;
  status: string;
}

const orderSchema = new Schema<ORDER>(
  {
    memberID: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    bakingStartTime: {
      type: Date,
      required: true,
    },
    collectionTime: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'fulfilled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
