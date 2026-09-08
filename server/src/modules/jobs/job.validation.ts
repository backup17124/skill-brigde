import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  company: z.string().min(2),
  location: z.string(),
  workplaceType: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
  skills: z.array(z.string()).optional(),
  experienceLevel: z.string(),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  salaryCurrency: z.string().optional(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;
