import { Request, Response, NextFunction } from 'express';
import { JobService } from './job.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class JobController {
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await JobService.listJobs(req.query);
      sendSuccess(res, result, 'Jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await JobService.getJobById(req.params.id);
      sendSuccess(res, job, 'Job retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await JobService.createJob(req.user!.id, req.body);
      sendSuccess(res, job, 'Job created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await JobService.updateJob(req.user!.id, req.params.id, req.body);
      sendSuccess(res, job, 'Job updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      await JobService.deleteJob(req.user!.id, req.params.id);
      sendSuccess(res, null, 'Job deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
