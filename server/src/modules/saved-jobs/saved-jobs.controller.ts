import { Request, Response, NextFunction } from 'express';
import { SavedJobService } from './saved-jobs.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class SavedJobController {
  static async toggleSave(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SavedJobService.toggleSave(req.user!.id, req.params.jobId);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async getSavedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SavedJobService.getSavedJobs(req.user!.id);
      sendSuccess(res, result, 'Saved jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getSavedJobIds(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SavedJobService.getSavedJobIds(req.user!.id);
      sendSuccess(res, result, 'Saved job IDs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

