import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/appError.js';

const COOKIE_NAME = 'refresh_token';
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.register(req.body);
      res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
      sendSuccess(res, { user, accessToken }, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req.body);
      res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
      sendSuccess(res, { user, accessToken }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (!token) {
        throw new AppError('No refresh token provided', 401);
      }

      const { accessToken, refreshToken } = await AuthService.refreshToken(token);
      res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
      sendSuccess(res, { accessToken }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (token) {
        await AuthService.logout(token);
      }
      res.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getMe(userId);
      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
