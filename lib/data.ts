// lib/data.ts
// In-memory data store with module-level singleton arrays

import type { JobApplication, Interview } from "@/types/job";

// Seed data for initial state
const seedApplications: JobApplication[] = [
  {
    id: "app-1",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    workType: "hybrid",
    salary: "$150,000 – $190,000",
    status: "interview",
    appliedDate: "2025-01-10",
    url: "https://stripe.com/jobs",
    contactName: "Sarah Kim",
    contactEmail: "sarah@stripe.com",
    notes: "Great culture, strong product focus. Interviewer was very technical.",
    tags: ["React", "TypeScript", "FinTech"],
    createdAt: "2025-01-08T09:00:00.000Z",
    updatedAt: "2025-01-15T14:30:00.000Z",
  },
  {
    id: "app-2",
    company: "Vercel",
    role: "Developer Advocate",
    location: "Remote",
    workType: "remote",
    salary: "$120,000 – $150,000",
    status: "phone-screen",
    appliedDate: "2025-01-12",
    url: "https://vercel.com/careers",
    contactName: "Alex Chen",
    notes: "Passionate about Next.js. Good mission alignment.",
    tags: ["Next.js", "DevRel", "Remote"],
    createdAt: "2025-01-10T10:00:00.000Z",
    updatedAt: "2025-01-13T11:00:00.000Z",
  },
  {
    id: "app-3",
    company: "Linear",
    role: "Full Stack Engineer",
    location: "Remote",
    workType: "remote",
    salary: "$130,000 – $160,000",
    status: "applied",
    appliedDate: "2025-01-14",
    url: "https://linear.app/careers",
    notes: "Love the product. Clean engineering culture.",
    tags: ["TypeScript", "GraphQL", "Startup"],
    createdAt: "2025-01-14T08:00:00.000Z",
    updatedAt: "2025-01-14T08:00:00.000Z",
  },
  {
    id: "app-4",
    company: "Shopify",
    role: "React Engineer",
    location: "Toronto, Canada",
    workType: "hybrid",
    salary: "$110,000 – $140,000",
    status: "offer",
    appliedDate: "2024-12-20",
    url: "https://shopify.com/careers",
    contactName: "Mike Johnson",
    contactEmail: "mike@shopify.com",
    notes: "Received offer! Need to negotiate salary.",
    tags: ["React", "Ruby on Rails", "E-commerce"],
    createdAt: "2024-12-18T12:00:00.000Z",
    updatedAt: "2025-01-10T16:00:00.000Z",
  },
  {
    id: "app-5",
    company: "Figma",
    role: "UI Engineer",
    location: "New York, NY",
    workType: "on-site",
    salary: "$140,000 – $180,000",
    status: "rejected",
    appliedDate: "2024-12-15",
    url: "https://figma.com/careers",
    notes: "Good experience, but looking for more backend experience.",
    tags: ["Canvas API", "WebGL", "Design Tools"],
    createdAt: "2024-12-10T09:00:00.000Z",
    updatedAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: "app-6",
    company: "Notion",
    role: "Product Engineer",
    location: "Remote",
    workType: "remote",
    salary: "$125,000 – $155,000",
    status: "saved",
    appliedDate: "",
    url: "https://notion.so/careers",
    notes: "Interesting product. Should apply soon.",
    tags: ["React", "TypeScript", "Productivity"],
    createdAt: "2025-01-16T14:00:00.000Z",
    updatedAt: "2025-01-16T14:00:00.000Z",
  },
  {
    id: "app-7",
    company: "Supabase",
    role: "Frontend Engineer",
    location: "Remote",
    workType: "remote",
    salary: "$100,000 – $130,000",
    status: "applied",
    appliedDate: "2025-01-15",
    url: "https://supabase.com/careers",
    notes: "Open source first company. Love the culture.",
    tags: ["PostgreSQL", "React", "Open Source"],
    createdAt: "2025-01-15T11:00:00.000Z",
    updatedAt: "2025-01-15T11:00:00.000Z",
  },
];

const seedInterviews: Interview[] = [
  {
    id: "int-1",
    applicationId: "app-1",
    round: 1,
    type: "phone",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    duration: 30,
    interviewerName: "Sarah Kim",
    notes: "Initial screening call. Discuss background and interest in the role.",
    outcome: "pending",
  },
  {
    id: "int-2",
    applicationId: "app-1",
    round: 2,
    type: "technical",
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    duration: 90,
    interviewerName: "John Lee",
    notes: "Technical coding round. Focus on React and data structures.",
    outcome: "pending",
  },
  {
    id: "int-3",
    applicationId: "app-2",
    round: 1,
    type: "video",
    scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    duration: 45,
    interviewerName: "Alex Chen",
    notes: "Meet the team. Discuss DevRel experience and content creation.",
    outcome: "pending",
  },
  {
    id: "int-4",
    applicationId: "app-4",
    round: 1,
    type: "hr",
    scheduledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    duration: 30,
    interviewerName: "Mike Johnson",
    notes: "HR screening. Discussed compensation expectations.",
    outcome: "pass",
  },
  {
    id: "int-5",
    applicationId: "app-4",
    round: 2,
    type: "technical",
    scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    duration: 120,
    notes: "System design and live coding challenge.",
    outcome: "pass",
  },
];

// Mutable in-memory arrays
let applications: JobApplication[] = [...seedApplications];
let interviews: Interview[] = [...seedInterviews];

// Applications CRUD
export function getApplications(): JobApplication[] {
  return [...applications].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getApplicationById(id: string): JobApplication | undefined {
  return applications.find((app) => app.id === id);
}

export function createApplication(
  data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">
): JobApplication {
  const now = new Date().toISOString();
  const newApp: JobApplication = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  applications = [newApp, ...applications];
  return newApp;
}

export function updateApplication(
  id: string,
  data: Partial<Omit<JobApplication, "id" | "createdAt">>
): JobApplication | null {
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return null;
  const updated: JobApplication = {
    ...applications[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  applications = [
    ...applications.slice(0, index),
    updated,
    ...applications.slice(index + 1),
  ];
  return updated;
}

export function deleteApplication(id: string): boolean {
  const before = applications.length;
  applications = applications.filter((app) => app.id !== id);
  // Delete associated interviews
  interviews = interviews.filter((int) => int.applicationId !== id);
  return applications.length < before;
}

// Interviews CRUD
export function getInterviews(applicationId?: string): Interview[] {
  if (applicationId) {
    return interviews.filter((int) => int.applicationId === applicationId);
  }
  return [...interviews];
}

export function getInterviewById(id: string): Interview | undefined {
  return interviews.find((int) => int.id === id);
}

export function createInterview(
  data: Omit<Interview, "id">
): Interview {
  const newInterview: Interview = {
    ...data,
    id: crypto.randomUUID(),
  };
  interviews = [...interviews, newInterview];
  return newInterview;
}

export function updateInterview(
  id: string,
  data: Partial<Omit<Interview, "id">>
): Interview | null {
  const index = interviews.findIndex((int) => int.id === id);
  if (index === -1) return null;
  const updated: Interview = {
    ...interviews[index],
    ...data,
  };
  interviews = [
    ...interviews.slice(0, index),
    updated,
    ...interviews.slice(index + 1),
  ];
  return updated;
}

export function deleteInterview(id: string): boolean {
  const before = interviews.length;
  interviews = interviews.filter((int) => int.id !== id);
  return interviews.length < before;
}
