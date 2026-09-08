import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash: _, ...profile } = user;
    let parsedSkills: string[] = [];
    try {
      parsedSkills = profile.skills ? JSON.parse(profile.skills) : [];
    } catch {
      parsedSkills = [];
    }

    return { ...profile, skills: parsedSkills };
  }

  static async updateProfile(userId: string, data: any) {
    const updateData: any = { ...data };
    // Prevent updating sensitive fields
    delete updateData.id;
    delete updateData.email;
    delete updateData.passwordHash;
    delete updateData.role;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (data.skills && Array.isArray(data.skills)) {
      updateData.skills = JSON.stringify(data.skills);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { passwordHash: _, ...profile } = updatedUser;
    let parsedSkills: string[] = [];
    try {
      parsedSkills = profile.skills ? JSON.parse(profile.skills) : [];
    } catch {
      parsedSkills = [];
    }

    return { ...profile, skills: parsedSkills };
  }

  static async updateResume(userId: string, resumeUrl: string, resumeName: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { resumeUrl, resumeName },
    });

    const { passwordHash: _, ...profile } = updatedUser;
    let parsedSkills: string[] = [];
    try {
      parsedSkills = profile.skills ? JSON.parse(profile.skills) : [];
    } catch {
      parsedSkills = [];
    }

    return { ...profile, skills: parsedSkills };
  }
}
