// hooks/useFilteredApplications.ts

import { useMemo } from "react";
import { useAppSelector } from "@/store";
import type { JobApplication } from "@/types/job";

interface FilteredApplicationsResult {
  filteredApplications: JobApplication[];
  count: number;
}

export function useFilteredApplications(): FilteredApplicationsResult {
  const applications = useAppSelector(
    (state) => state.applications.applications
  );
  const filters = useAppSelector((state) => state.applications.filters);

  return useMemo((): FilteredApplicationsResult => {
    let filtered = [...applications];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    // WorkType filter
    if (filters.workType !== "all") {
      filtered = filtered.filter((app) => app.workType === filters.workType);
    }

    // Search filter (company, role, location)
    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query) ||
          app.location.toLowerCase().includes(query)
      );
    }

    // Tags filter (any tag match)
    if (filters.tags.length > 0) {
      filtered = filtered.filter((app) =>
        filters.tags.some((tag) =>
          app.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    return {
      filteredApplications: filtered,
      count: filtered.length,
    };
  }, [applications, filters]);
}
