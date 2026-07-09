import { seedApplications, seedInterviews } from "./seed-data";
import type { JobApplication, Interview } from "@/types/job";

export const memoryStore = {
  applications: [...seedApplications] as JobApplication[],
  interviews: [...seedInterviews] as Interview[],
};
