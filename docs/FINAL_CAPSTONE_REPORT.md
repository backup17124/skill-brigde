# Final Capstone Report: SkillBridge Full-Stack Career Portal

**Project Title**: SkillBridge: Full-Stack Career Portal  
**Domain**: Full-Stack Web Development  
**Tech Stack**: React 19, TypeScript, Tailwind CSS, Node.js, Express.js, Prisma ORM, SQLite / PostgreSQL, Docker, GitHub Actions  

---

## 1. Executive Summary & Problem Statement

### Problem Statement
Students, freshers, and early-career job seekers face significant friction when trying to discover internships, entry-level jobs, and career resources in one organized environment. Existing job portals are overloaded with sponsored noise, cluttered interfaces, lack transparency in application review stages, and offer few tools for personal career tracking and resume curation.

### Solution Overview
**SkillBridge** is an end-to-end full-stack career platform where students explore verified jobs and internships, save opportunities, submit applications with resume documents, track real-time application stages, and manage comprehensive candidate profiles. Simultaneously, recruiters can post opportunities, review candidates, inspect resumes, and update application statuses, while administrators have access to platform metrics and moderation controls.

---

## 2. Implemented Features & Capabilities

### 1. User Authentication with JWT & Security
- Secure token-based authentication using **JSON Web Tokens (JWT)**.
- Dual-token flow: short-lived access tokens stored in memory and HttpOnly refresh cookies to mitigate XSS and CSRF risks.
- Passwords hashed with **bcrypt** (cost factor 12).
- Automatic token renewal using Axios response interceptors.

### 2. Role-Based Access Control (RBAC)
- Implemented three distinct roles:
  - **STUDENT**: Explore jobs, save opportunities, submit applications with custom cover notes and resumes, monitor status progression, edit profile.
  - **RECRUITER**: Create, edit, and delete job postings; review applicant submissions; view candidate resumes; update application statuses (`PENDING` -> `REVIEWING` -> `SHORTLISTED` -> `ACCEPTED` / `REJECTED`).
  - **ADMIN**: Platform overview analytics, user management (role modifications and account deletion), and global job moderation.
- Protected server routes enforced via `authenticate` and `requireRole(...)` middleware.
- Protected client routes using `<ProtectedRoute allowedRole={...} />`.

### 3. Job & Internship Listings
- Clean card-based and detailed views with metadata: Job Type (Full-time, Part-time, Internship, Contract), Workplace (Remote, Hybrid, On-site), Experience Level, and Salary in INR.
- Skills badges and company information.

### 4. Application Tracking Dashboard
- Students track all submitted applications with real-time status indicators:
  - **PENDING**: Application submitted and awaiting recruiter triage.
  - **REVIEWING**: Recruiter is reviewing the profile and resume.
  - **SHORTLISTED**: Candidate selected for interview / screening.
  - **ACCEPTED**: Candidate offered the role or advanced.
  - **REJECTED**: Application declined with clear feedback.
- Deduplication: Enforced database constraint `@@unique([jobId, studentId])` so students cannot accidentally apply multiple times to the same position.

### 5. Resume Upload & Profile Management
- Direct file uploads for `.pdf`, `.doc`, and `.docx` using **Multer** with server-side validation and 5MB size limits.
- Static serving of uploaded documents with CORS protection.
- Student profile editor supporting:
  - Full Name, Phone Number, Professional Headline, Bio
  - Interactive Skills Tagging (add on Enter/comma, remove with click)
  - Education & Experience fields
  - Portfolio, GitHub, and LinkedIn links

### 6. Search, Filter & Pagination
- Full-text search across job titles, companies, and descriptions.
- Multi-criteria filtering by Job Type, Workplace Type, Experience Level, and Salary.
- Server-side pagination with limit, page offset, and total count metadata.

### 7. Admin Dashboard
- Live Platform Metrics:
  - User counts (Students, Recruiters, Admins)
  - Active and closed jobs
  - Total applications and pipeline stage distributions
- User Management table with search, role elevation/demotion, and user deletion.
- Job Moderation table with direct post viewing and deletion.

### 8. Responsive UI with Dark & Light Mode
- Modern dark theme by default with neon accents (Indigo & Cyan).
- Persistent **Light Mode** toggle powered by `ThemeContext` and CSS variables, saved in `localStorage`.
- Fully responsive across mobile screens, tablets, and desktop displays.

---

## 3. Architecture & Tech Stack

| Layer | Technology | Key Libraries / Modules |
|---|---|---|
| **Frontend** | React 18/19, TypeScript, Vite | Tailwind CSS v4, Lucide React, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, TypeScript | Prisma ORM, Multer, Helmet, Cookie-Parser, Zod, bcrypt, jsonwebtoken |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | Prisma Schema, Foreign keys, Unique constraints, Cascading deletes |
| **DevOps & CI/CD** | GitHub Actions, Docker | Multi-stage Docker Compose, Automated build & typecheck workflows |

---

## 4. Implementation Steps Accomplished

1. **UI Wireframing & Design**: Designed modern dashboard layouts, card grids, modals, and responsive navigation.
2. **Responsive Frontend**: Developed reusable components (`Button`, `Card`, `Badge`, `Modal`, `Input`, `Spinner`, `Pagination`).
3. **REST APIs**: Built modular Express routes, controllers, and services with standard response envelopes (`sendSuccess`, `AppError`).
4. **Database Models & Relationships**: Engineered relational schema with Prisma linking `User`, `Job`, `Application`, `SavedJob`, and `RefreshToken`.
5. **Authentication & RBAC**: Implemented secure JWT issue/verify, refresh tokens, and role-checking middleware.
6. **API Integration**: Linked React services with backend endpoints using Axios interceptors.
7. **Search, Filters & Analytics**: Implemented SQL-level Prisma queries for filtering and real-time dashboard analytics calculation.
8. **DevOps & CI/CD**: Added GitHub Actions pipeline for build verification and Docker configurations.

---

## 5. Verification & Testing

- **Backend TypeScript Compilation**: Passed `npm run build` in `server/` with 0 errors.
- **Frontend Vite & TypeScript Build**: Passed `npm run build` in `client/` with 0 errors (`dist/` generated).
- **Database Migrations & Seeding**: Successfully executed `npx prisma db push` and `npm run db:seed` creating test users (Student, Recruiter, Admin), 15 diverse job postings, sample applications in various statuses, and bookmarks.
- **File Upload Verification**: Multer uploads `.pdf`/`.doc`/`.docx` documents to `/uploads/resumes/` with validated mime-types and size limits.

---

## 6. Learning Outcomes

1. Mastery of scalable monorepo full-stack web architecture using modern TypeScript across both client and server.
2. Practical implementation of JWT authentication, refresh token rotation, and robust Role-Based Access Control (RBAC).
3. Relational data modeling, foreign key constraints, cascading actions, and schema management with Prisma ORM.
4. Seamless file handling, disk storage, and static file serving using Express and Multer.
5. Component-driven frontend architecture with state management and theme switching in Tailwind CSS.
6. Professional DevOps pipeline setup using GitHub Actions CI and Docker.

