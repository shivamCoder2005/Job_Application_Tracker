// types/job.ts

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone-screen"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export type WorkType = "remote" | "hybrid" | "on-site";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workType: WorkType;
  salary?: string; // e.g., "$80,000 – $100,000"
  status: ApplicationStatus;
  appliedDate: string; // YYYY-MM-DD or "" if only saved
  url?: string; // Job posting URL
  contactName?: string;
  contactEmail?: string;
  notes: string;
  tags: string[]; // e.g., ["React", "TypeScript", "startup"]
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Interview {
  id: string;
  applicationId: string;
  round: number; // 1 = first round, 2 = second, etc.
  type: "phone" | "video" | "on-site" | "technical" | "hr";
  scheduledAt: string; // ISO timestamp
  duration: number; // in minutes
  interviewerName?: string;
  notes: string;
  outcome?: "pass" | "fail" | "pending";
}

export interface ApplicationFilters {
  status: ApplicationStatus | "all";
  workType: WorkType | "all";
  search: string;
  tags: string[];
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number; // % of "applied" that moved to phone-screen or beyond
  offerRate: number; // % of total that reached "offer"
  activeApplications: number; // not rejected or withdrawn
}

export interface CreateApplicationPayload {
  company: string;
  role: string;
  location: string;
  workType: WorkType;
  salary?: string;
  status: ApplicationStatus;
  appliedDate: string;
  url?: string;
  contactName?: string;
  contactEmail?: string;
  notes: string;
  tags: string[];
}

export interface CreateInterviewPayload {
  applicationId: string;
  round: number;
  type: Interview["type"];
  scheduledAt: string;
  duration: number;
  interviewerName?: string;
  notes: string;
}

export interface UpdateInterviewPayload extends Partial<Omit<Interview, "id">> {
  outcome?: "pass" | "fail" | "pending";
}
