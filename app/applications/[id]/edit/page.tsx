import { notFound } from "next/navigation";
import { EditApplicationClient } from "@/components/EditApplicationClient";
import { JobApplication } from "@/types/job";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: PageProps) {
  const { id } = await params;

  // Build the absolute URL for the fetch calls using the host header
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const forwardedProto = headersList.get("x-forwarded-proto");
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/applications/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const application: JobApplication = await res.json();

  return <EditApplicationClient application={application} />;
}
