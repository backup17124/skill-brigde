import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from './application.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class ApplicationController {
  static async applyToJob(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await ApplicationService.applyToJob(
        req.user!.id,
        req.params.jobId,
        req.body
      );
      sendSuccess(res, application, 'Application submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await ApplicationService.getStudentApplications(req.user!.id);
      sendSuccess(res, applications, 'Applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getJobApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await ApplicationService.getJobApplications(
        req.user!.id,
        req.params.jobId,
        req.user!.role
      );
      sendSuccess(res, applications, 'Job applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getRecruiterApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await ApplicationService.getRecruiterApplications(req.user!.id);
      sendSuccess(res, applications, 'All received applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ApplicationService.updateApplicationStatus(
        req.user!.id,
        req.params.id,
        req.body.status,
        req.user!.role
      );
      sendSuccess(res, updated, 'Application status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ApplicationService.getStats(req.user!.id, req.user!.role);
      sendSuccess(res, stats, 'Application stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

