import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';
import { ApplyJobInput } from './application.validation.js';

export class ApplicationService {
  static async applyToJob(studentId: string, jobId: string, data: ApplyJobInput) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.status !== 'ACTIVE') {
      throw new AppError('This job posting is no longer active', 400);
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId,
          studentId,
        },
      },
    });

    if (existingApplication) {
      throw new AppError('You have already applied to this job', 400);
    }

    // Default to user's saved resume if not provided
    let resumeUrl: string | null | undefined = data.resumeUrl;
    let resumeName: string | null | undefined = data.resumeName;

    if (!resumeUrl) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { resumeUrl: true, resumeName: true },
      });
      resumeUrl = student?.resumeUrl ?? null;
      resumeName = student?.resumeName ?? null;
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        studentId,
        coverNote: data.coverNote,
        resumeUrl,
        resumeName,
        status: 'PENDING',
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
            workplaceType: true,
          },
        },
      },
    });

    return application;
  }

  static async getStudentApplications(studentId: string) {
    const applications = await prisma.application.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
            workplaceType: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            status: true,
          },
        },
      },
    });

    return applications;
  }

  static async getJobApplications(userId: string, jobId: string, userRole: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (userRole !== 'ADMIN' && job.postedById !== userId) {
      throw new AppError('Not authorized to view applicants for this job', 403);
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            skills: true,
            education: true,
            experience: true,
            avatarUrl: true,
            githubUrl: true,
            linkedinUrl: true,
            portfolioUrl: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });

    return applications.map((app) => ({
      ...app,
      student: {
        ...app.student,
        skills: JSON.parse(app.student.skills || '[]'),
      },
    }));
  }

  static async getRecruiterApplications(recruiterId: string) {
    const applications = await prisma.application.findMany({
      where: {
        job: {
          postedById: recruiterId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            skills: true,
            education: true,
            experience: true,
            avatarUrl: true,
            githubUrl: true,
            linkedinUrl: true,
            portfolioUrl: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
          },
        },
      },
    });

    return applications.map((app) => ({
      ...app,
      student: {
        ...app.student,
        skills: JSON.parse(app.student.skills || '[]'),
      },
    }));
  }

  static async updateApplicationStatus(
    userId: string,
    applicationId: string,
    status: string,
    userRole: string
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (userRole !== 'ADMIN' && application.job.postedById !== userId) {
      throw new AppError('Not authorized to update this application', 403);
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });

    return updated;
  }

  static async getStats(userId: string, role: string) {
    if (role === 'STUDENT') {
      const [applications, savedCount] = await Promise.all([
        prisma.application.findMany({
          where: { studentId: userId },
          select: { status: true },
        }),
        prisma.savedJob.count({
          where: { userId },
        }),
      ]);

      const total = applications.length;
      const pending = applications.filter((a) => a.status === 'PENDING').length;
      const reviewing = applications.filter((a) => a.status === 'REVIEWING').length;
      const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
      const accepted = applications.filter((a) => a.status === 'ACCEPTED').length;
      const rejected = applications.filter((a) => a.status === 'REJECTED').length;

      return {
        role: 'STUDENT',
        totalApplications: total,
        pending,
        reviewing,
        shortlisted,
        accepted,
        rejected,
        savedJobs: savedCount,
      };
    } else if (role === 'RECRUITER') {
      const [jobs, applications] = await Promise.all([
        prisma.job.findMany({
          where: { postedById: userId },
          select: { id: true, status: true },
        }),
        prisma.application.findMany({
          where: { job: { postedById: userId } },
          select: { status: true },
        }),
      ]);

      const activeJobs = jobs.filter((j) => j.status === 'ACTIVE').length;
      const totalJobs = jobs.length;
      const totalApplicants = applications.length;
      const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
      const accepted = applications.filter((a) => a.status === 'ACCEPTED').length;
      const reviewing = applications.filter((a) => a.status === 'REVIEWING').length;

      return {
        role: 'RECRUITER',
        totalJobs,
        activeJobs,
        totalApplicants,
        reviewing,
        shortlisted,
        accepted,
      };
    }

    return null;
  }
}

