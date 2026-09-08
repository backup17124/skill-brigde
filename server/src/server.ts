import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');

    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
