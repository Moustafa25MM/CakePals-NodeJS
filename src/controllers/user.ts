import { models } from '../models';

const getUserByEmail = (email: string) => models.User.findOne({ email });
const getUserById = (id: string) => models.User.findById(id);

const getBakerById = (id: string) => models.Baker.findById(id);
const getAllBakers = () => models.Baker.find();

export const userControllers = {
  getUserByEmail,
  getUserById,
  getBakerById,
  getAllBakers,
};
