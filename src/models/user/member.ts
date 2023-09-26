import { Schema } from 'mongoose';
import User from './user';

const MemberSchema = new Schema({});

export const Member = User.discriminator('Member', MemberSchema);
