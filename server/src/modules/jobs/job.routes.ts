import { Router } from 'express';
import { JobController } from './job.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { jobSchema } from './job.validation.js';

const router = Router();

router.get('/', JobController.listJobs);
router.get('/:id', JobController.getJob);

router.post(
  '/',
  authenticate,
  requireRole('RECRUITER'),
  validate(jobSchema),
  JobController.createJob
);

router.put(
  '/:id',
  authenticate,
  requireRole('RECRUITER'),
  validate(jobSchema.partial()),
  JobController.updateJob
);

router.delete(
  '/:id',
  authenticate,
  requireRole('RECRUITER'),
  JobController.deleteJob
);

export default router;
