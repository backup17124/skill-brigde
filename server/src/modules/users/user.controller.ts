import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await UserService.getProfile(req.user!.id);
      sendSuccess(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const allowedUpdates = [
        'name',
        'avatarUrl',
        'bio',
        'headline',
        'company',
        'phone',
        'skills',
        'education',
        'experience',
        'githubUrl',
        'linkedinUrl',
        'portfolioUrl',
      ];
      const data: any = {};

      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          data[key] = req.body[key];
        }
      }

      const profile = await UserService.updateProfile(req.user!.id, data);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No resume file uploaded' },
        });
      }

      const relativeUrl = `/uploads/resumes/${req.file.filename}`;
      const originalName = req.file.originalname;

      const profile = await UserService.updateResume(req.user!.id, relativeUrl, originalName);
      sendSuccess(res, profile, 'Resume uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}
