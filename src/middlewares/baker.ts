import { Request, Response } from 'express';
import { cloudi } from './imagesUpload';
import { authMethods } from './auth';
import { userControllers } from '../controllers/user';
import { paginationOption } from '../libs/paginations';

const getBakerById = async (req: Request, res: Response) => {
  try {
    const baker = await userControllers.getBakerById(req.params.id);
    if (!baker) {
      return res.status(404).json({ error: 'Baker not found' });
    }
    return res.status(200).json(baker);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllBakers = async (req: Request, res: Response) => {
  try {
    const bakers = await userControllers.getAllBakers();
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = bakers.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedBakers = bakers.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      paginations: paginationOptions,
      bakers: paginatedBakers,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const updateBaker = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    let data = req.body;

    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    if (data.password) {
      data.password = authMethods.hashPassword(data.password);
    }

    if (req.file) {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      data.profilePicture = uploadedImg.url;
    }

    if (data.start || data.end) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(data.start) || !timeRegex.test(data.end)) {
        return res.status(400).json({
          error: 'Start and end times must be in the format HH:mm',
        });
      }

      const today = new Date().toISOString().split('T')[0];
      data.start = new Date(`${today}T${data.start}:00Z`);
      data.end = new Date(`${today}T${data.end}:00Z`);
      data.collectionTimeRange = { start: data.start, end: data.end };
    }

    const updatedBaker = await userControllers.updateBakerById(id, data);
    if (!updatedBaker) {
      return res.status(404).json({ error: 'Baker not found' });
    }

    return res.status(200).json(updatedBaker);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const bakerMiddlewares = {
  getBakerById,
  getAllBakers,
  updateBaker,
};
