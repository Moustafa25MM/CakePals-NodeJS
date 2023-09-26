import { models } from '../models';

const getUserByEmail = (email: string) => models.User.findOne({ email });

export const userControllers = {
  getUserByEmail,
};
