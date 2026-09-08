import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);
router.delete('/jobs/:id', AdminController.deleteJob);

export default router;

