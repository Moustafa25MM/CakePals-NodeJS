import { Schema } from 'mongoose';
import User from './user';

interface BAKER extends Document {
  isBaker: boolean;
  street: string;
  city: string;
  country: string;
  collectionTimeRange: Date;
}

const BakerSchema = new Schema<BAKER>({
  isBaker: {
    type: Boolean,
    required: true,
    default: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  collectionTimeRange: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
});

export const Baker = User.discriminator('Baker', BakerSchema);
