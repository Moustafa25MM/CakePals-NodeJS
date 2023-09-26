import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'ValiationError') {
    return res.status(400).send({
      type: 'ValidationError',
      details: err.message,
    });
  }
  return res
    .status(err.status || 500)
    .json({ message: err.message, code: err.code });
};
