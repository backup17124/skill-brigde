import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';

export class AdminService {
  static async getPlatformStats() {
    const [
      totalUsers,
      totalStudents,
      totalRecruiters,
      totalAdmins,
      totalJobs,
      activeJobs,
      totalApplications,
      applications,
      recentUsers,
      recentApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'RECRUITER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count(),
      prisma.application.findMany({ select: { status: true } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, email: true } },
          job: { select: { id: true, title: true, company: true } },
        },
      }),
    ]);

    const statusCounts = {
      pending: applications.filter((a) => a.status === 'PENDING').length,
      reviewing: applications.filter((a) => a.status === 'REVIEWING').length,
      shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
      accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
      rejected: applications.filter((a) => a.status === 'REJECTED').length,
    };

    return {
      users: {
        total: totalUsers,
        students: totalStudents,
        recruiters: totalRecruiters,
        admins: totalAdmins,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: totalJobs - activeJobs,
      },
      applications: {
        total: totalApplications,
        ...statusCounts,
      },
      recentUsers,
      recentApplications,
    };
  }

  static async listUsers(query: { search?: string; role?: string; page?: string; limit?: string }) {
    const { search, role, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          company: true,
          createdAt: true,
          _count: {
            select: {
              jobs: true,
              applications: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  static async updateUserRole(adminUserId: string, targetUserId: string, role: string) {
    if (!['STUDENT', 'RECRUITER', 'ADMIN'].includes(role)) {
      throw new AppError('Invalid role specified', 400);
    }

    if (adminUserId === targetUserId && role !== 'ADMIN') {
      throw new AppError('You cannot demote your own admin account', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return updatedUser;
  }

  static async deleteUser(adminUserId: string, targetUserId: string) {
    if (adminUserId === targetUserId) {
      throw new AppError('You cannot delete your own admin account', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({ where: { id: targetUserId } });
    return { success: true };
  }

  static async deleteJob(jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    await prisma.job.delete({ where: { id: jobId } });
    return { success: true };
  }
}

