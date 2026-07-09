import { memoryStore } from "@/lib/memory-store";
import type { JobApplication } from "@/types/job";
import { deleteInterviewsByApplicationId } from "./interview.service";

export function getApplications(): JobApplication[] {
  return [...memoryStore.applications].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getApplicationById(id: string): JobApplication | undefined {
  return memoryStore.applications.find((app) => app.id === id);
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
  memoryStore.applications.unshift(newApp);
  return newApp;
}

export function updateApplication(
  id: string,
  data: Partial<Omit<JobApplication, "id" | "createdAt">>
): JobApplication | null {
  const index = memoryStore.applications.findIndex((app) => app.id === id);
  if (index === -1) return null;
  const updated: JobApplication = {
    ...memoryStore.applications[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  memoryStore.applications.splice(index, 1, updated);
  return updated;
}

export function deleteApplication(id: string): boolean {
  const index = memoryStore.applications.findIndex((app) => app.id === id);
  if (index === -1) return false;
  
  memoryStore.applications.splice(index, 1);
  
  // Delete associated interviews
  deleteInterviewsByApplicationId(id);
  
  return true;
}
