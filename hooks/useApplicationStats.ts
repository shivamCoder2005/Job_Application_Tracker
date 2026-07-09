// hooks/useApplicationStats.ts

import { useMemo } from "react";
import { useAppSelector } from "@/store";
import type { ApplicationStats, ApplicationStatus } from "@/types/job";
import { ALL_STATUSES } from "@/lib/utils";

export function useApplicationStats(): ApplicationStats {
  const applications = useAppSelector(
    (state) => state.applications.applications
  );

  return useMemo((): ApplicationStats => {
    const total = applications.length;

    // Build byStatus record
    const byStatus = ALL_STATUSES.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status).length;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    // responseRate: (apps where status is not "saved" and not "applied")
    //               / (apps where status is not "saved") * 100
    const notSaved = applications.filter((app) => app.status !== "saved");
    const responded = notSaved.filter((app) => app.status !== "applied");
    const responseRate =
      notSaved.length > 0 ? (responded.length / notSaved.length) * 100 : 0;

    // offerRate: byStatus["offer"] / total * 100
    const offerRate = total > 0 ? (byStatus["offer"] / total) * 100 : 0;

    // activeApplications: not rejected, not withdrawn
    const activeApplications = applications.filter(
      (app) => app.status !== "rejected" && app.status !== "withdrawn"
    ).length;

    return {
      total,
      byStatus,
      responseRate,
      offerRate,
      activeApplications,
    };
  }, [applications]);
}
