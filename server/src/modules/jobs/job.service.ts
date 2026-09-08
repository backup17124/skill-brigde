import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';
import { Prisma } from '@prisma/client';
import { JobInput } from './job.validation.js';

interface GetJobsQuery {
  search?: string;
  jobType?: string;
  workplaceType?: string;
  experienceLevel?: string;
  status?: string;
  postedById?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class JobService {
  static async listJobs(query: GetJobsQuery) {
    const {
      search,
      jobType,
      workplaceType,
      experienceLevel,
      status = 'ACTIVE',
      postedById,
      page = '1',
      limit = '12',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 50);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.JobWhereInput = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (postedById) {
      where.postedById = postedById;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (jobType) where.jobType = jobType;
    if (workplaceType) where.workplaceType = workplaceType;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              company: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    // Parse skills JSON for each job and add applicationsCount
    const parsedJobs = jobs.map((job) => ({
      ...job,
      skills: JSON.parse(job.skills || '[]'),
      applicationsCount: job._count.applications,
    }));

    return {
      jobs: parsedJobs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  static async getJobById(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            avatarUrl: true,
          }
        }
      }
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    return {
      ...job,
      skills: JSON.parse(job.skills),
    };
  }

  static async createJob(userId: string, data: JobInput) {
    const job = await prisma.job.create({
      data: {
        ...data,
        skills: JSON.stringify(data.skills),
        postedById: userId,
      },
    });
    return { ...job, skills: JSON.parse(job.skills) };
  }

  static async updateJob(userId: string, jobId: string, data: Partial<JobInput>) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    
    if (job.postedById !== userId) {
      throw new AppError('Not authorized to update this job', 403);
    }

    const updateData: any = { ...data };
    if (data.skills) {
      updateData.skills = JSON.stringify(data.skills);
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });

    return { ...updatedJob, skills: JSON.parse(updatedJob.skills) };
  }

  static async deleteJob(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    
    if (job.postedById !== userId) {
      throw new AppError('Not authorized to delete this job', 403);
    }

    await prisma.job.delete({ where: { id: jobId } });
  }
}
