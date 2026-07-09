// app/api/applications/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getApplications,
  createApplication,
} from "@/services/application.service";
import type { ApplicationStatus, WorkType } from "@/types/job";
import { isValidUrl, isValidDate, isPastOrToday } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as ApplicationStatus | null;
  const workType = searchParams.get("workType") as WorkType | null;
  const search = searchParams.get("search");
  const tagsParam = searchParams.get("tags");

  let apps = getApplications();

  if (status) {
    apps = apps.filter((app) => app.status === status);
  }

  if (workType) {
    apps = apps.filter((app) => app.workType === workType);
  }

  if (search) {
    const q = search.toLowerCase();
    apps = apps.filter(
      (app) =>
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q)
    );
  }

  if (tagsParam) {
    const tags = tagsParam.split(",").map((t) => t.trim().toLowerCase());
    apps = apps.filter((app) =>
      tags.some((tag) => app.tags.map((t) => t.toLowerCase()).includes(tag))
    );
  }

  return NextResponse.json(apps);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    console.log("creating application:", body);

    // Validate required fields
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";

    if (!company || company.length < 2) {
      return NextResponse.json(
        { error: "company is required and must be at least 2 characters" },
        { status: 400 }
      );
    }
    
    if (!role || role.length < 2) {
      return NextResponse.json(
        { error: "role is required and must be at least 2 characters" },
        { status: 400 }
      );
    }

    const url = typeof body.url === "string" ? body.url.trim() : undefined;
    if (url && !isValidUrl(url)) {
      return NextResponse.json(
        { error: "url must be a valid URL" },
        { status: 400 }
      );
    }

    const appliedDate = typeof body.appliedDate === "string" ? body.appliedDate.trim() : "";
    if (appliedDate) {
      if (!isValidDate(appliedDate)) {
        return NextResponse.json(
          { error: "appliedDate must be a valid date" },
          { status: 400 }
        );
      }
      if (!isPastOrToday(appliedDate)) {
        return NextResponse.json(
          { error: "appliedDate cannot be in the future" },
          { status: 400 }
        );
      }
    }

    const validStatuses: ApplicationStatus[] = [
      "saved",
      "applied",
      "phone-screen",
      "interview",
      "offer",
      "rejected",
      "withdrawn",
    ];
    const status = typeof body.status === "string" ? body.status as ApplicationStatus : "saved";
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const validWorkTypes: WorkType[] = ["remote", "hybrid", "on-site"];
    const workType = typeof body.workType === "string" ? body.workType as WorkType : "remote";
    if (!validWorkTypes.includes(workType)) {
      return NextResponse.json(
        { error: `workType must be one of: ${validWorkTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const newApp = createApplication({
      company,
      role,
      location: typeof body.location === "string" ? body.location : "",
      workType,
      salary: typeof body.salary === "string" ? body.salary : undefined,
      status,
      appliedDate,
      url,
      contactName: typeof body.contactName === "string" ? body.contactName : undefined,
      contactEmail: typeof body.contactEmail === "string" ? body.contactEmail : undefined,
      notes: typeof body.notes === "string" ? body.notes : "",
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
    });

    return NextResponse.json(newApp, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
