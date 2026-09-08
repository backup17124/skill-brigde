import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import jobRoutes from './modules/jobs/job.routes.js';
import applicationRoutes from './modules/applications/application.routes.js';
import savedJobRoutes from './modules/saved-jobs/saved-jobs.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Static file serving for resumes & uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/saved-jobs', savedJobRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;

