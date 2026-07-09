// app/applications/page.tsx — Server Component
// PDF Section 12: "Server Component with fetch('/api/applications', { cache: 'no-store' })"

import { ApplicationsClient } from "@/components/ApplicationsClient";
import type { JobApplication } from "@/types/job";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  // Build the absolute URL for the fetch call using the host header
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`${protocol}://${host}/api/applications`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const applications: JobApplication[] = await res.json();

  return <ApplicationsClient initialApplications={applications} />;
}
