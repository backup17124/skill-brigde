import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      sendSuccess(res, stats, 'Platform stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listUsers(req.query);
      sendSuccess(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.updateUserRole(
        req.user!.id,
        req.params.id,
        req.body.role
      );
      sendSuccess(res, result, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.deleteUser(req.user!.id, req.params.id);
      sendSuccess(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.deleteJob(req.params.id);
      sendSuccess(res, result, 'Job removed by admin successfully');
    } catch (error) {
      next(error);
    }
  }
}

