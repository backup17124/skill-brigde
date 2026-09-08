import { Router } from 'express';
import { ApplicationController } from './application.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { applyJobSchema, updateApplicationStatusSchema } from './application.validation.js';

const router = Router();

router.use(authenticate);

// Stats for current user
router.get('/stats', ApplicationController.getStats);

// Student routes
router.post(
  '/jobs/:jobId',
  requireRole('STUDENT'),
  validate(applyJobSchema),
  ApplicationController.applyToJob
);
router.get('/my', requireRole('STUDENT'), ApplicationController.getMyApplications);

// Recruiter & Admin routes
router.get('/recruiter', requireRole('RECRUITER', 'ADMIN'), ApplicationController.getRecruiterApplications);
router.get('/jobs/:jobId', requireRole('RECRUITER', 'ADMIN'), ApplicationController.getJobApplications);
router.patch(
  '/:id/status',
  requireRole('RECRUITER', 'ADMIN'),
  validate(updateApplicationStatusSchema),
  ApplicationController.updateStatus
);

export default router;

