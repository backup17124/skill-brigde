import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (error instanceof ZodError) {
    const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new AppError(`Validation Error: ${message}`, 400);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      error = new AppError('Duplicate field value entered', 400);
    } else if (error.code === 'P2025') {
      error = new AppError('Resource not found', 404);
    }
  } else if (error.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  } else if (error.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(error.code && { code: error.code })
    }
  });
};
