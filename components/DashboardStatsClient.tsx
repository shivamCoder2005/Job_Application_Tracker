"use client";

// components/DashboardStatsClient.tsx
// Client component that syncs server data to Redux for dashboard use

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { fetchApplications } from "@/store/applicationSlice";
import { fetchInterviews } from "@/store/interviewSlice";

export function DashboardStatsClient() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch latest data into Redux store on mount
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
  }, [dispatch]);

  return null;
}
