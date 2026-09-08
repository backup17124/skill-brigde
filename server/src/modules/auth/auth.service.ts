import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/appError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { RegisterInput, LoginInput } from './auth.validation.js';

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async refreshToken(oldRefreshToken: string) {
    const tokenHash = hashToken(oldRefreshToken);
    
    const storedToken = await prisma.refreshToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError('Refresh token expired', 401);
    }

    try {
      verifyRefreshToken(oldRefreshToken);
    } catch (e) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError('Invalid refresh token', 401);
    }

    const payload = { id: storedToken.user.id, email: storedToken.user.email, role: storedToken.user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newRefreshToken),
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
