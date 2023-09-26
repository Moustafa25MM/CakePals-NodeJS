import mongoose, { Document, Schema, Types } from 'mongoose';

interface PRODUCT extends Document {
  ownerID: Schema.Types.ObjectId;
  type: string;
  price: number;
  image: string;
  bakingTime: number;
}

const productSchema = new Schema<PRODUCT>(
  {
    ownerID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      type: String,
      required: true,
    },
    bakingTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const Product = mongoose.model('product', productSchema);
export default Product;
