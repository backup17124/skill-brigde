export type Role = 'STUDENT' | 'RECRUITER' | 'ADMIN';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type WorkplaceType = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  company?: string;
  phone?: string;
  skills?: string[];
  education?: string;
  experience?: string;
  resumeUrl?: string;
  resumeName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  workplaceType: WorkplaceType;
  jobType: JobType;
  skills: string[];
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: JobStatus;
  postedById: string;
  postedBy?: {
    id?: string;
    name: string;
    email?: string;
    company?: string;
    avatarUrl?: string;
  };
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  resumeName?: string;
  coverNote?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  student?: User;
}

export interface SavedJob {
  id: string;
  savedAt: string;
  job: Job;
}

export interface StudentStats {
  role: 'STUDENT';
  totalApplications: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
  savedJobs: number;
}

export interface RecruiterStats {
  role: 'RECRUITER';
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  reviewing: number;
  shortlisted: number;
  accepted: number;
}

export interface AdminStats {
  users: {
    total: number;
    students: number;
    recruiters: number;
    admins: number;
  };
  jobs: {
    total: number;
    active: number;
    closed: number;
  };
  applications: {
    total: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    student: { id: string; name: string; email: string };
    job: { id: string; title: string; company: string };
    status: ApplicationStatus;
    createdAt: string;
  }>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export interface JobFilters {
  search?: string;
  jobType?: JobType | '';
  workplaceType?: WorkplaceType | '';
  experienceLevel?: string;
  postedById?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

