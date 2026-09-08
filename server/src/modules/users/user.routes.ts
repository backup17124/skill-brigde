import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { uploadResume } from '../../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.post('/profile/resume', uploadResume.single('resume'), UserController.uploadResume);

export default router;

