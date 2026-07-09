// app/api/applications/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "@/lib/data";
import { isValidUrl, isValidDate, isPastOrToday } from "@/lib/utils";
import type { ApplicationStatus, WorkType } from "@/types/job";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const app = getApplicationById(id);
  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  return NextResponse.json(app);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  try {
    const body = await request.json() as Record<string, unknown>;

    // Validate fields if provided
    if (typeof body.company === "string" && body.company.trim().length === 0) {
      return NextResponse.json({ error: "company cannot be empty" }, { status: 400 });
    }
    if (typeof body.role === "string" && body.role.trim().length === 0) {
      return NextResponse.json({ error: "role cannot be empty" }, { status: 400 });
    }

    const url = typeof body.url === "string" ? body.url.trim() : undefined;
    if (url && !isValidUrl(url)) {
      return NextResponse.json({ error: "url must be a valid URL" }, { status: 400 });
    }

    const appliedDate = typeof body.appliedDate === "string" ? body.appliedDate.trim() : undefined;
    if (appliedDate) {
      if (!isValidDate(appliedDate)) {
        return NextResponse.json({ error: "appliedDate must be a valid date" }, { status: 400 });
      }
      if (!isPastOrToday(appliedDate)) {
        return NextResponse.json({ error: "appliedDate cannot be in the future" }, { status: 400 });
      }
    }

    if (body.status !== undefined) {
      const validStatuses: ApplicationStatus[] = [
        "saved", "applied", "phone-screen", "interview", "offer", "rejected", "withdrawn",
      ];
      if (!validStatuses.includes(body.status as ApplicationStatus)) {
        return NextResponse.json({ error: `Invalid status` }, { status: 400 });
      }
    }

    if (body.workType !== undefined) {
      const validWorkTypes: WorkType[] = ["remote", "hybrid", "on-site"];
      if (!validWorkTypes.includes(body.workType as WorkType)) {
        return NextResponse.json({ error: `Invalid workType` }, { status: 400 });
      }
    }

    const updated = updateApplication(id, {
      ...(typeof body.company === "string" && { company: body.company.trim() }),
      ...(typeof body.role === "string" && { role: body.role.trim() }),
      ...(typeof body.location === "string" && { location: body.location }),
      ...(typeof body.workType === "string" && { workType: body.workType as WorkType }),
      ...(typeof body.salary === "string" && { salary: body.salary }),
      ...(typeof body.status === "string" && { status: body.status as ApplicationStatus }),
      ...(appliedDate !== undefined && { appliedDate }),
      ...(url !== undefined && { url }),
      ...(typeof body.contactName === "string" && { contactName: body.contactName }),
      ...(typeof body.contactEmail === "string" && { contactEmail: body.contactEmail }),
      ...(typeof body.notes === "string" && { notes: body.notes }),
      ...(Array.isArray(body.tags) && { tags: body.tags as string[] }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // deleteApplication also deletes associated interviews
  const success = deleteApplication(id);
  if (!success) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
