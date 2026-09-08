import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authorized, token missing', 401));
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('Not authorized, token missing', 401));
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new AppError('Not authorized, invalid token', 401));
  }
};
