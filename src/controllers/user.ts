import { models } from '../models';

const getUserByEmail = (email: string) => models.User.findOne({ email });
const getUserById = (id: string) => models.User.findById(id);
const getAll = () => models.Baker.find();

export const userControllers = {
  getUserByEmail,
  getUserById,
  getAll,
};
