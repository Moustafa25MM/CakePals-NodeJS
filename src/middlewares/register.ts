import { Request, Response } from 'express';
import { cloudi } from './imagesUpload';
import { authMethods } from './auth';
import { userControllers } from '../controllers/user';
import { models } from 'mongoose';
import { Member } from '../models/user/member';
import { Baker } from '../models/user/baker';

export const register = async (req: Request, res: Response) => {
  const data = req.body;
  let { password } = req.body;
  if (password === undefined) {
    return res.status(500);
  }
  if (!(data.type === 'member' || data.type === 'baker')) {
    return res.status(402).json({ error: 'Choose Between Member Or Baker' });
  }
  data.password = authMethods.hashPassword(password);
  try {
    const existingUser = await userControllers.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    let profilePicture = '';
    if (req.file) {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      profilePicture = uploadedImg.url;
    }
    if (data.type === 'member') {
      const member = new Member(data);
      await member.save();

      return res.status(201).json(member);
    } else if (data.type === 'baker') {
      if (!data.street || !data.city || !data.country) {
        return res.status(400).json({ error: 'missing data' });
      }
      const baker = new Baker(data);
      await baker.save();

      return res.status(201).json(baker);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
