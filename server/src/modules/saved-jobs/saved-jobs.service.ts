import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';

export class SavedJobService {
  static async toggleSave(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.savedJob.delete({
        where: { id: existing.id },
      });
      return { saved: false, message: 'Job removed from saved list' };
    } else {
      await prisma.savedJob.create({
        data: {
          jobId,
          userId,
        },
      });
      return { saved: true, message: 'Job saved successfully' };
    }
  }

  static async getSavedJobs(userId: string) {
    const saved = await prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          include: {
            postedBy: {
              select: {
                id: true,
                name: true,
                company: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return saved.map((item) => ({
      id: item.id,
      savedAt: item.createdAt,
      job: {
        ...item.job,
        skills: JSON.parse(item.job.skills || '[]'),
      },
    }));
  }

  static async getSavedJobIds(userId: string) {
    const saved = await prisma.savedJob.findMany({
      where: { userId },
      select: { jobId: true },
    });

    return saved.map((item) => item.jobId);
  }
}

