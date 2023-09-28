import mongoose, { Schema } from 'mongoose';

interface RATING extends Document {
  bakerID: Schema.Types.ObjectId;
  memberID: Schema.Types.ObjectId;
  orderID: Schema.Types.ObjectId;
  rate: number;
  comment: string;
}

const ratingSchema = new Schema<RATING>(
  {
    bakerID: {
      type: Schema.Types.ObjectId,
      ref: 'Baker',
      required: true,
    },
    memberID: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    orderID: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model('rating', ratingSchema);
export default Rating;
