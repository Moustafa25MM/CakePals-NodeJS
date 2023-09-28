import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';
import { userControllers } from '../controllers/user';

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

const isBakerAuthorized = async (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    const payload: { id: string } = jwt.verify(token, JWTSecret as string) as {
      id: string;
    };
    const userData = await userControllers.getUserById(payload.id);
    if (!userData) {
      return res.status(400);
    }
    if (userData.__t !== 'Baker') {
      return res.status(403).json({ error: 'Forbidden: User is not a baker' });
    }
    req.user = {
      id: userData.id,
      email: userData.email,
      type: userData.__t,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const isMemberAuthorized = async (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    const payload: { id: string } = jwt.verify(token, JWTSecret as string) as {
      id: string;
    };
    const userData = await userControllers.getUserById(payload.id);
    if (!userData) {
      return res.status(400);
    }
    if (userData.__t !== 'Member') {
      return res.status(403).json({ error: 'Forbidden: not a member' });
    }
    req.user = {
      id: userData.id,
      email: userData.email,
      type: userData.__t,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const authMethods = {
  hashPassword,
  comparePassword,
  generateJWT,
  isBakerAuthorized,
  isMemberAuthorized,
};
