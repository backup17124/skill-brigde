# SkillBridge

A full-stack career platform for students and freshers. Students browse jobs, apply with resumes, and track applications. Recruiters post listings and review applicants. Admins manage users and moderate content.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4, React Router, Axios |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | SQLite (local dev) via Prisma ORM |
| Auth | JWT access tokens (15 min) + httpOnly refresh cookies (7 days), bcrypt |

## Project Structure

```
skillbridge/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # UI components
│       ├── context/        # Auth & theme providers
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Route pages
│       ├── services/       # API client layer
│       └── types/          # Shared TypeScript types
├── server/                 # Express API
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Demo data
│   │   └── migrations/     # SQL migrations
│   └── src/
│       ├── config/         # Environment & database
│       ├── middleware/     # Auth, roles, validation, uploads
│       └── modules/        # Feature modules (auth, jobs, etc.)
└── package.json            # npm workspaces root
```

## Prerequisites

- **Node.js** 20+
- **npm** 9+

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and adjust if needed:

```bash
cp server/.env.example server/.env
```

Default values work for local development:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 3. Set up the database

```bash
npm run db:setup
```

This creates the SQLite database, applies the schema, and seeds demo data.

### 4. Start development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/api/v1/health

## Demo Accounts

All seeded accounts use password: **`password123`**

| Role | Email | What to demo |
|------|-------|--------------|
| Student | `student@demo.com` | Browse jobs, apply, save bookmarks, edit profile |
| Student | `jane@demo.com` | Second student with sample applications |
| Recruiter | `recruiter@demo.com` | Post jobs, review applicants, update status |
| Admin | `admin@demo.com` | Platform stats, user management, job moderation |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client and server concurrently |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build both workspaces for production |
| `npm run db:setup` | Create DB schema + seed demo data |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:push` | Push schema to DB (dev fallback) |
| `npm run db:seed` | Re-seed demo data |
| `npm run db:studio` | Open Prisma Studio (DB browser) |
| `npm run lint` | Run ESLint |

## User Roles

| Role | Capabilities |
|------|-------------|
| **STUDENT** | Search jobs, apply, save jobs, manage profile & resume |
| **RECRUITER** | Create/edit/delete own job posts, review applicants, update application status |
| **ADMIN** | View platform stats, manage users, change roles, delete users/jobs |

## API Reference

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register (role: `STUDENT` or `RECRUITER`) |
| POST | `/auth/login` | — | Login, returns access token + sets refresh cookie |
| POST | `/auth/logout` | Yes | Logout, clears refresh cookie |
| POST | `/auth/refresh` | Cookie | Refresh access token |
| GET | `/auth/me` | Yes | Get current user |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jobs` | — | List jobs (search, filters, pagination) |
| GET | `/jobs/:id` | — | Get single job |
| POST | `/jobs` | Recruiter | Create job listing |
| PUT | `/jobs/:id` | Recruiter | Update job |
| DELETE | `/jobs/:id` | Recruiter | Delete job |

**Query params for `GET /jobs`:** `search`, `jobType`, `workplaceType`, `experienceLevel`, `status`, `page`, `limit`, `sortBy`, `sortOrder`

### Applications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/applications/stats` | Yes | Dashboard stats for current user |
| POST | `/applications/jobs/:jobId` | Student | Apply to a job |
| GET | `/applications/my` | Student | List own applications |
| GET | `/applications/recruiter` | Recruiter | All applications for recruiter's jobs |
| GET | `/applications/jobs/:jobId` | Recruiter | Applicants for a specific job |
| PATCH | `/applications/:id/status` | Recruiter | Update status |

**Application statuses:** `PENDING` → `REVIEWING` → `SHORTLISTED` → `ACCEPTED` / `REJECTED`

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | Yes | Get profile |
| PUT | `/users/profile` | Yes | Update profile |
| POST | `/users/profile/resume` | Yes | Upload resume (PDF/DOC/DOCX, max 5 MB) |

### Saved Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/saved-jobs/:jobId` | Yes | Toggle bookmark |
| GET | `/saved-jobs` | Yes | List saved jobs |
| GET | `/saved-jobs/ids` | Yes | Get saved job IDs |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Admin | Platform statistics |
| GET | `/admin/users` | Admin | List users (search, role filter, pagination) |
| PATCH | `/admin/users/:id/role` | Admin | Change user role |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| DELETE | `/admin/jobs/:id` | Admin | Delete job |

## Database Schema

| Model | Purpose |
|-------|---------|
| `User` | Accounts with role, profile, skills, resume metadata |
| `Job` | Job listings with salary, workplace type, status |
| `Application` | Student applications (unique per job + student) |
| `SavedJob` | Bookmarked jobs |
| `RefreshToken` | Hashed refresh tokens for auth |

## Authentication Flow

1. Login/register returns a short-lived **access token** (JSON) and sets an **httpOnly refresh cookie**.
2. The frontend stores the access token in memory and sends it as a `Bearer` header.
3. On 401, the client automatically calls `/auth/refresh` using the cookie.
4. Access tokens expire in **15 minutes**; refresh tokens expire in **7 days**.

## Resume Uploads

Resumes are stored locally at `server/uploads/resumes/`. Uploaded files are served at `/uploads/resumes/<filename>`. Allowed formats: `.pdf`, `.doc`, `.docx` (max 5 MB).

## CI/CD

GitHub Actions runs on push/PR to `main`, `master`, and `dev`:

- Installs dependencies
- Applies database migrations
- Builds server and client

See `.github/workflows/ci.yml`.

## Deployment Notes

The project uses **SQLite for local development**. For production deployment (Render, Railway, etc.), switch Prisma to **PostgreSQL**:

1. Change `provider` in `server/prisma/schema.prisma` to `postgresql`
2. Set `DATABASE_URL` to your cloud PostgreSQL connection string
3. Run migrations on the host: `npm run db:migrate`
4. Set environment variables: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
5. Deploy frontend to Vercel with the production API URL
6. Configure CORS (`CLIENT_URL`) to match your deployed frontend origin

## Troubleshooting

**`Cannot find module '@prisma/engines'`**

```bash
npm install
cd server && npx prisma generate
```

**Database out of sync**

```bash
npm run db:push
npm run db:seed
```

**Port already in use**

Change `PORT` in `server/.env` or the Vite port in `client/vite.config.ts`.

## License

Private — capstone project.
