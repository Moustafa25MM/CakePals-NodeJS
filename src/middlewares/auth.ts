import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';

dotenv.config();

const JWTSecret = process.env.JWT_SECRET;

const hashPassword = (password: string): String =>
  bcrypt.hashSync(password as string, 10);

const comparePassword = async (
  enteredPassword: string,
  DB_Password: any
): Promise<boolean> => {
  const result = await bcrypt.compare(enteredPassword, DB_Password);
  return result;
};

type TokenPayLoad = {
  id: string;
};
const generateJWT = (payload: TokenPayLoad): String =>
  jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

export const authMethods = {
  hashPassword,
  comparePassword,
  generateJWT,
};
