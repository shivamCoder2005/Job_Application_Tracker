import { memoryStore } from "@/lib/memory-store";
import type { Interview } from "@/types/job";

export function getInterviews(applicationId?: string): Interview[] {
  if (applicationId) {
    return memoryStore.interviews.filter((int) => int.applicationId === applicationId);
  }
  return [...memoryStore.interviews];
}

export function getInterviewById(id: string): Interview | undefined {
  return memoryStore.interviews.find((int) => int.id === id);
}

export function createInterview(data: Omit<Interview, "id">): Interview {
  const newInterview: Interview = {
    ...data,
    id: crypto.randomUUID(),
  };
  memoryStore.interviews.push(newInterview);
  return newInterview;
}

export function updateInterview(
  id: string,
  data: Partial<Omit<Interview, "id">>
): Interview | null {
  const index = memoryStore.interviews.findIndex((int) => int.id === id);
  if (index === -1) return null;
  const updated: Interview = {
    ...memoryStore.interviews[index],
    ...data,
  };
  memoryStore.interviews.splice(index, 1, updated);
  return updated;
}

export function deleteInterview(id: string): boolean {
  const index = memoryStore.interviews.findIndex((int) => int.id === id);
  if (index === -1) return false;
  memoryStore.interviews.splice(index, 1);
  return true;
}

export function deleteInterviewsByApplicationId(applicationId: string): void {
  // To mutate array in-place, iterate backwards
  for (let i = memoryStore.interviews.length - 1; i >= 0; i--) {
    if (memoryStore.interviews[i].applicationId === applicationId) {
      memoryStore.interviews.splice(i, 1);
    }
  }
}
