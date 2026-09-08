import { Router } from 'express';
import { SavedJobController } from './saved-jobs.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/:jobId', SavedJobController.toggleSave);
router.get('/', SavedJobController.getSavedJobs);
router.get('/ids', SavedJobController.getSavedJobIds);

export default router;

