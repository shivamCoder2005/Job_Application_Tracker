// lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus, WorkType } from "@/types/job";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isPastOrToday(dateStr: string): boolean {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

export function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
}

export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    saved: "bg-slate-100 text-slate-700 border-slate-200",
    applied: "bg-blue-100 text-blue-700 border-blue-200",
    "phone-screen": "bg-indigo-100 text-indigo-700 border-indigo-200",
    interview: "bg-violet-100 text-violet-700 border-violet-200",
    offer: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    withdrawn: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function getStatusDotColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    saved: "bg-slate-400",
    applied: "bg-blue-500",
    "phone-screen": "bg-indigo-500",
    interview: "bg-violet-500",
    offer: "bg-emerald-500",
    rejected: "bg-red-500",
    withdrawn: "bg-orange-500",
  };
  return colors[status] ?? "bg-gray-400";
}

export function getWorkTypeBadge(workType: WorkType): string {
  const badges: Record<WorkType, string> = {
    remote: "bg-teal-100 text-teal-700",
    hybrid: "bg-amber-100 text-amber-700",
    "on-site": "bg-purple-100 text-purple-700",
  };
  return badges[workType] ?? "bg-gray-100 text-gray-700";
}

export function formatStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    saved: "Saved",
    applied: "Applied",
    "phone-screen": "Phone Screen",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  return labels[status] ?? status;
}

export function getISOWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
}

export function isWithinCurrentWeek(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const { start, end } = getISOWeekBounds();
  return date >= start && date <= end;
}

export const ALL_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone-screen",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone-screen",
  "interview",
  "offer",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = ["rejected", "withdrawn"];
