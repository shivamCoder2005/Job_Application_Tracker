"use client";

// context/JobSearchContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAppSelector } from "@/store";
import { isWithinCurrentWeek } from "@/lib/utils";

interface JobSearchContextValue {
  targetRole: string;
  setTargetRole: (role: string) => void;
  targetSalary: string;
  setTargetSalary: (salary: string) => void;
  weeklyGoal: number;
  setWeeklyGoal: (n: number) => void;
  goalProgress: number;
}

const JobSearchContext = createContext<JobSearchContextValue | undefined>(
  undefined
);

const STORAGE_KEYS = {
  TARGET_ROLE: "job_tracker_target_role",
  TARGET_SALARY: "job_tracker_target_salary",
  WEEKLY_GOAL: "job_tracker_weekly_goal",
};

function getStoredString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function getStoredNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? fallback : parsed;
}

export function JobSearchProvider({ children }: { children: ReactNode }) {
  const [targetRole, setTargetRoleState] = useState<string>("");
  const [targetSalary, setTargetSalaryState] = useState<string>("");
  const [weeklyGoal, setWeeklyGoalState] = useState<number>(5);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    setTargetRoleState(getStoredString(STORAGE_KEYS.TARGET_ROLE, ""));
    setTargetSalaryState(getStoredString(STORAGE_KEYS.TARGET_SALARY, ""));
    setWeeklyGoalState(getStoredNumber(STORAGE_KEYS.WEEKLY_GOAL, 5));
    setMounted(true);
  }, []);

  const setTargetRole = (role: string) => {
    setTargetRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TARGET_ROLE, role);
    }
  };

  const setTargetSalary = (salary: string) => {
    setTargetSalaryState(salary);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TARGET_SALARY, salary);
    }
  };

  const setWeeklyGoal = (n: number) => {
    setWeeklyGoalState(n);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, String(n));
    }
  };

  // Derive goalProgress from Redux state
  const applications = useAppSelector((state) => state.applications.applications);
  const goalProgress = useMemo(() => {
    return applications.filter(
      (app) =>
        app.appliedDate && isWithinCurrentWeek(app.appliedDate)
    ).length;
  }, [applications]);

  const value: JobSearchContextValue = {
    targetRole: mounted ? targetRole : "",
    setTargetRole,
    targetSalary: mounted ? targetSalary : "",
    setTargetSalary,
    weeklyGoal: mounted ? weeklyGoal : 5,
    setWeeklyGoal,
    goalProgress,
  };

  return (
    <JobSearchContext.Provider value={value}>
      {children}
    </JobSearchContext.Provider>
  );
}

export function useJobSearch(): JobSearchContextValue {
  const ctx = useContext(JobSearchContext);
  if (!ctx) {
    throw new Error("useJobSearch must be used within a JobSearchProvider");
  }
  return ctx;
}
