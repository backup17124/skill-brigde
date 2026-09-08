import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@demo.com',
      passwordHash,
      role: 'ADMIN',
      headline: 'SkillBridge Platform Administrator',
      bio: 'Managing platform operations, quality control, and career opportunities.',
    }
  });
  console.log(`Created admin: ${admin.email}`);

  const student = await prisma.user.create({
    data: {
      name: 'Alex Student',
      email: 'student@demo.com',
      passwordHash,
      role: 'STUDENT',
      headline: 'Aspiring Full Stack Engineer & CS Student',
      bio: 'Final-year Computer Science student passionate about building performant web applications with React, Node.js, and TypeScript.',
      phone: '+91 9876543210',
      skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker']),
      education: 'B.Tech in Computer Science & Engineering, Expected 2025',
      experience: 'Frontend Intern at WebSolutions (6 months)',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      portfolioUrl: 'https://skillbridge.dev',
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      resumeName: 'Alex_Student_Resume.pdf',
    }
  });
  console.log(`Created student: ${student.email}`);

  const student2 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@demo.com',
      passwordHash,
      role: 'STUDENT',
      headline: 'Data Science & Machine Learning Enthusiast',
      bio: 'Passionate about predictive modeling, Python, and cloud architectures.',
      phone: '+91 9876543211',
      skills: JSON.stringify(['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas']),
      education: 'B.Sc in Data Science, Expected 2025',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
    }
  });
  console.log(`Created student 2: ${student2.email}`);

  const recruiter = await prisma.user.create({
    data: {
      name: 'Sarah Recruiter',
      email: 'recruiter@demo.com',
      passwordHash,
      role: 'RECRUITER',
      company: 'TechCorp',
      headline: 'Lead Talent Acquisition at TechCorp',
    }
  });
  console.log(`Created recruiter: ${recruiter.email}`);

  const jobData = [
    {
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      workplaceType: 'HYBRID',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['React', 'TypeScript', 'CSS']),
      experienceLevel: 'Mid',
      salaryMin: 900000,
      salaryMax: 1500000,
      description: 'We are looking for a skilled Frontend Developer to join our team. You will build modern web applications using React and TypeScript.\n\nRequirements:\n- 3+ years experience with React\n- Strong TypeScript skills\n- Good eye for design\n- Experience with responsive web development',
    },
    {
      title: 'Backend Engineer',
      company: 'DataFlow Inc',
      location: 'New York, NY',
      workplaceType: 'REMOTE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Node.js', 'PostgreSQL', 'AWS']),
      experienceLevel: 'Senior',
      salaryMin: 1500000,
      salaryMax: 2500000,
      description: 'Join DataFlow Inc as a Senior Backend Engineer. You will build scalable APIs and microservices powering our data analytics platform.',
    },
    {
      title: 'Data Science Intern',
      company: 'CloudNine Systems',
      location: 'Seattle, WA',
      workplaceType: 'ON_SITE',
      jobType: 'INTERNSHIP',
      skills: JSON.stringify(['Python', 'SQL', 'Machine Learning']),
      experienceLevel: 'Intern',
      salaryMin: 30000,
      salaryMax: 40000,
      description: 'Summer internship opportunity for aspiring data scientists. Learn from industry experts and work on real-world ML projects.',
    },
    {
      title: 'DevOps Engineer',
      company: 'GreenTech Solutions',
      location: 'Austin, TX',
      workplaceType: 'REMOTE',
      jobType: 'CONTRACT',
      skills: JSON.stringify(['Docker', 'Kubernetes', 'CI/CD']),
      experienceLevel: 'Mid',
      salaryMin: 1200000,
      salaryMax: 1800000,
      description: 'Contract role for a DevOps engineer to help migrate our infrastructure to Kubernetes and set up CI/CD pipelines.',
    },
    {
      title: 'UI/UX Designer',
      company: 'FinanceHub',
      location: 'Chicago, IL',
      workplaceType: 'HYBRID',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Figma', 'Prototyping', 'User Research']),
      experienceLevel: 'Mid',
      salaryMin: 800000,
      salaryMax: 1400000,
      description: 'Looking for a creative UI/UX designer to revamp our financial dashboard and improve user experience across our platform.',
    },
    {
      title: 'Full Stack Developer',
      company: 'TechCorp',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'MongoDB']),
      experienceLevel: 'Mid',
      salaryMin: 1000000,
      salaryMax: 1800000,
      description: 'Build end-to-end features for our SaaS platform. You will work across the full stack with React and Node.js.',
    },
    {
      title: 'Product Manager',
      company: 'CloudNine Systems',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Agile', 'Jira', 'Product Strategy']),
      experienceLevel: 'Senior',
      salaryMin: 2000000,
      salaryMax: 3000000,
      description: 'Lead our product strategy and roadmap. Work closely with engineering and design teams to deliver impactful features.',
    },
    {
      title: 'Marketing Specialist',
      company: 'FinanceHub',
      location: 'New York, NY',
      workplaceType: 'ON_SITE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['SEO', 'Content Marketing', 'Analytics']),
      experienceLevel: 'Entry',
      salaryMin: 500000,
      salaryMax: 800000,
      description: 'Entry-level marketing role. Help grow our brand presence through content marketing and SEO optimization.',
    },
    {
      title: 'QA Engineer',
      company: 'DataFlow Inc',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'CONTRACT',
      skills: JSON.stringify(['Selenium', 'Cypress', 'Jest']),
      experienceLevel: 'Mid',
      salaryMin: 800000,
      salaryMax: 1200000,
      description: 'QA automation engineer to build and maintain our test suite. Experience with modern testing frameworks required.',
    },
    {
      title: 'Systems Administrator',
      company: 'GreenTech Solutions',
      location: 'Austin, TX',
      workplaceType: 'ON_SITE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Linux', 'Networking', 'Shell Scripting']),
      experienceLevel: 'Mid',
      salaryMin: 700000,
      salaryMax: 1100000,
      description: 'Manage and maintain our server infrastructure. Strong Linux and networking skills required.',
    },
    {
      title: 'Software Engineering Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      workplaceType: 'HYBRID',
      jobType: 'INTERNSHIP',
      skills: JSON.stringify(['Java', 'C++', 'Data Structures']),
      experienceLevel: 'Intern',
      salaryMin: 40000,
      salaryMax: 50000,
      description: 'Summer internship for CS students. Work on real product features alongside senior engineers.',
    },
    {
      title: 'Cloud Architect',
      company: 'CloudNine Systems',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['AWS', 'Azure', 'Terraform']),
      experienceLevel: 'Senior',
      salaryMin: 2500000,
      salaryMax: 4000000,
      description: 'Design and architect cloud solutions for enterprise clients. Deep AWS or Azure expertise required.',
    },
    {
      title: 'Technical Writer',
      company: 'DataFlow Inc',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'PART_TIME',
      skills: JSON.stringify(['Documentation', 'Markdown', 'API Docs']),
      experienceLevel: 'Mid',
      salaryMin: 400000,
      salaryMax: 600000,
      description: 'Part-time technical writer to create and maintain API documentation and developer guides.',
    },
    {
      title: 'Mobile App Developer',
      company: 'FinanceHub',
      location: 'Chicago, IL',
      workplaceType: 'HYBRID',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Flutter', 'React Native', 'iOS', 'Android']),
      experienceLevel: 'Mid',
      salaryMin: 1200000,
      salaryMax: 1800000,
      description: 'Build cross-platform mobile apps for our financial services platform using Flutter or React Native.',
    },
    {
      title: 'Security Analyst',
      company: 'GreenTech Solutions',
      location: 'Remote',
      workplaceType: 'REMOTE',
      jobType: 'FULL_TIME',
      skills: JSON.stringify(['Cybersecurity', 'Pen Testing', 'SIEM']),
      experienceLevel: 'Senior',
      salaryMin: 1800000,
      salaryMax: 2500000,
      description: 'Protect our systems and data. Conduct security audits, penetration testing, and incident response.',
    },
  ];

  const createdJobs = [];
  for (const job of jobData) {
    const created = await prisma.job.create({
      data: {
        ...job,
        status: 'ACTIVE',
        postedById: recruiter.id,
      }
    });
    createdJobs.push(created);
  }
  
  console.log(`Created ${createdJobs.length} jobs.`);

  // Seed Applications for Alex Student
  if (createdJobs.length >= 5) {
    await prisma.application.create({
      data: {
        jobId: createdJobs[0].id, // Frontend Developer
        studentId: student.id,
        status: 'SHORTLISTED',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeName: 'Alex_Student_Resume.pdf',
        coverNote: 'I have strong expertise with React and TypeScript and have built production-level web applications. Looking forward to interviewing!',
      }
    });

    await prisma.application.create({
      data: {
        jobId: createdJobs[2].id, // Data Science Intern
        studentId: student.id,
        status: 'REVIEWING',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeName: 'Alex_Student_Resume.pdf',
        coverNote: 'Excited about machine learning and data science internships.',
      }
    });

    await prisma.application.create({
      data: {
        jobId: createdJobs[5].id, // Full Stack Developer
        studentId: student.id,
        status: 'PENDING',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeName: 'Alex_Student_Resume.pdf',
        coverNote: 'Full stack development with Node and React is my core strength.',
      }
    });

    // Seed Applications for Jane Student
    await prisma.application.create({
      data: {
        jobId: createdJobs[2].id, // Data Science Intern
        studentId: student2.id,
        status: 'ACCEPTED',
        resumeName: 'Jane_Doe_Resume.pdf',
        coverNote: 'I have hands-on experience with Python ML libraries and data pipelines.',
      }
    });

    await prisma.application.create({
      data: {
        jobId: createdJobs[0].id, // Frontend Developer
        studentId: student2.id,
        status: 'REJECTED',
        resumeName: 'Jane_Doe_Resume.pdf',
        coverNote: 'Transitioning to frontend development.',
      }
    });

    console.log('Created sample applications with various statuses.');

    // Seed Saved Jobs (Bookmarks)
    await prisma.savedJob.create({
      data: {
        jobId: createdJobs[1].id, // Backend Engineer
        userId: student.id,
      }
    });

    await prisma.savedJob.create({
      data: {
        jobId: createdJobs[3].id, // DevOps Engineer
        userId: student.id,
      }
    });

    await prisma.savedJob.create({
      data: {
        jobId: createdJobs[4].id, // UI/UX Designer
        userId: student.id,
      }
    });

    console.log('Created sample saved jobs/bookmarks.');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
