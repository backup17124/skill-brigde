# SkillBridge - Technical Documentation

SkillBridge is a production-grade full-stack career platform designed to help students and freshers find internships, jobs, manage their professional profiles, and track applications, while empowering recruiters and administrators with job management and hiring analytics.

---

## 1. System Architecture

```
                                  +-----------------------+
                                  |    Client Browser     |
                                  | React 19 + TypeScript |
                                  |     Tailwind CSS      |
                                  +-----------+-----------+
                                              |
                                   HTTP / REST / JSON
                                              |
                                              v
                                  +-----------------------+
                                  |      Express API      |
                                  |   Node.js + TS Server |
                                  +-----------+-----------+
                                  |           |           |
                                  v           v           v
                          +-----------+ +-----------+ +-----------+
                          |   Auth    | |  Multer   | |  Prisma   |
                          |JWT / RBAC | | File Disk | |    ORM    |
                          +-----------+ +-----+-----+ +-----+-----+
                                              |             |
                                              v             v
                                        +-----------+ +-----------+
                                        |  Uploads  | |  SQLite / |
                                        |  Resumes  | |PostgreSQL |
                                        +-----------+ +-----------+
```

### Frontend
- **Framework**: React 18/19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React icons
- **State Management**: React Context (`AuthContext`, `ThemeContext`)
- **HTTP Client**: Axios with interceptors for auto token refresh

### Backend
- **Framework**: Express.js, TypeScript (ES Modules)
- **Database & ORM**: SQLite (development) / PostgreSQL (production) with Prisma ORM
- **Authentication**: JWT (short-lived access tokens + long-lived HttpOnly refresh cookies) + bcrypt (12 rounds)
- **File Uploads**: Multer with file type filtering (`.pdf`, `.doc`, `.docx`) and size limits (5 MB)
- **Security**: Helmet headers, CORS credentials handling, Zod request body validation

---

## 2. Database Schema (Prisma)

### Key Models

1. **`User`**:
   - `id`: Unique identifier (cuid)
   - `name`, `email` (unique), `passwordHash`
   - `role`: `'STUDENT' | 'RECRUITER' | 'ADMIN'`
   - `avatarUrl`, `headline`, `bio`, `company`, `phone`
   - `skills`: JSON string array
   - `education`, `experience`
   - `resumeUrl`, `resumeName`
   - `githubUrl`, `linkedinUrl`, `portfolioUrl`
   - Relations: `jobs`, `refreshTokens`, `applications`, `savedJobs`

2. **`Job`**:
   - `id`, `title`, `description`, `company`, `location`
   - `workplaceType`: `'ON_SITE' | 'REMOTE' | 'HYBRID'`
   - `jobType`: `'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT'`
   - `skills`: JSON string array
   - `experienceLevel`: string (e.g. `'Intern'`, `'Entry Level'`, `'Mid'`)
   - `salaryMin`, `salaryMax`, `salaryCurrency` (default `'INR'`)
   - `status`: `'ACTIVE' | 'DRAFT' | 'CLOSED'`
   - `postedById` -> `User`
   - Relations: `applications`, `savedJobs`

3. **`Application`**:
   - `id`: Unique identifier
   - `jobId` -> `Job` (Cascade on delete)
   - `studentId` -> `User` (Cascade on delete)
   - `status`: `'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'`
   - `resumeUrl`, `resumeName`, `coverNote`
   - Unique: `@@unique([jobId, studentId])` (Prevents duplicate applications)

4. **`SavedJob`**:
   - `id`: Unique identifier
   - `jobId` -> `Job` (Cascade on delete)
   - `userId` -> `User` (Cascade on delete)
   - Unique: `@@unique([jobId, userId])` (Prevents duplicate bookmarks)

---

## 3. REST API Reference

### Authentication (`/api/v1/auth`)
- `POST /register`: Register user with `{ name, email, password, role }`
- `POST /login`: Login user with `{ email, password }`
- `POST /refresh`: Refresh access token via HttpOnly refresh cookie
- `POST /logout`: Revoke refresh token and clear cookie
- `GET /me`: Get authenticated user profile

### User Profile & Resumes (`/api/v1/users`)
- `GET /profile`: Get current user's complete profile
- `PUT /profile`: Update profile fields (skills, education, phone, links, bio, headline)
- `POST /profile/resume`: Upload resume document (multipart/form-data with key `resume`)

### Jobs (`/api/v1/jobs`)
- `GET /`: List jobs with search, filters (`jobType`, `workplaceType`, `experienceLevel`, `status`, `postedById`) and pagination (`page`, `limit`)
- `GET /:id`: Get detailed job posting with company information
- `POST /`: Create new job posting (Recruiters & Admins)
- `PUT /:id`: Update job posting (Owner only)
- `DELETE /:id`: Delete job posting (Owner or Admin)

### Applications (`/api/v1/applications`)
- `POST /jobs/:jobId`: Submit job application with cover note and optional custom resume
- `GET /my`: Get all applications submitted by logged-in student
- `GET /jobs/:jobId`: Get all applications for a specific job (Recruiter/Admin)
- `GET /recruiter`: Get all applications across all jobs for logged-in recruiter
- `PATCH /:id/status`: Update application status (`PENDING` -> `REVIEWING` -> `SHORTLISTED` -> `ACCEPTED` / `REJECTED`)
- `GET /stats`: Get real-time stats for student or recruiter dashboard

### Saved Opportunities (`/api/v1/saved-jobs`)
- `POST /:jobId`: Toggle save/unsave a job posting
- `GET /`: Get all saved jobs with full job details
- `GET /ids`: Get array of saved job IDs for UI bookmark state

### Admin Management (`/api/v1/admin`)
- `GET /stats`: Platform-wide analytics (user counts, job counts, application pipeline)
- `GET /users`: List and search system users with pagination and role filters
- `PATCH /users/:id/role`: Change user role (`STUDENT`, `RECRUITER`, `ADMIN`)
- `DELETE /users/:id`: Delete platform user
- `DELETE /jobs/:id`: Moderate/remove any job posting

---

## 4. Environment Variables

### Server (`server/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

---

## 5. Development & Execution

```bash
# 1. Install dependencies
npm install

# 2. Setup database & seed
npm run db:migrate
npm run db:seed

# 3. Start development servers concurrently
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | `student@demo.com` | `password123` |
| Student 2 | `jane@demo.com` | `password123` |
| Recruiter | `recruiter@demo.com` | `password123` |
| Administrator | `admin@demo.com` | `password123` |

