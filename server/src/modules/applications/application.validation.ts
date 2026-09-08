import { z } from 'zod';

export const applyJobSchema = z.object({
  coverNote: z.string().max(2000).optional(),
  resumeUrl: z.string().optional(),
  resumeName: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

