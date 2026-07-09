// app/api/interviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getInterviews, createInterview } from "@/services/interview.service";
import { getApplicationById } from "@/services/application.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId") ?? undefined;

  const interviews = getInterviews(applicationId);
  return NextResponse.json(interviews);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;

    const applicationId = typeof body.applicationId === "string" ? body.applicationId.trim() : "";
    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    // Validate that applicationId references an existing application
    const existingApp = getApplicationById(applicationId);
    if (!existingApp) {
      return NextResponse.json(
        { error: "applicationId does not reference an existing application" },
        { status: 400 }
      );
    }

    const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt.trim() : "";
    if (!scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt is required" },
        { status: 400 }
      );
    }

    // Validate scheduledAt is a valid future ISO timestamp
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "scheduledAt must be a valid ISO timestamp" },
        { status: 400 }
      );
    }
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "scheduledAt must be a future timestamp" },
        { status: 400 }
      );
    }

    const round = typeof body.round === "number" ? body.round : parseInt(String(body.round), 10);
    if (isNaN(round) || round < 1) {
      return NextResponse.json(
        { error: "round must be a positive integer" },
        { status: 400 }
      );
    }

    const validTypes = ["phone", "video", "on-site", "technical", "hr"] as const;
    type InterviewType = (typeof validTypes)[number];
    const type = typeof body.type === "string" ? body.type as InterviewType : undefined;
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const duration = typeof body.duration === "number" ? body.duration : parseInt(String(body.duration), 10);
    if (isNaN(duration) || duration < 1) {
      return NextResponse.json(
        { error: "duration must be a positive number (in minutes)" },
        { status: 400 }
      );
    }

    const newInterview = createInterview({
      applicationId,
      round,
      type,
      scheduledAt,
      duration,
      interviewerName: typeof body.interviewerName === "string" ? body.interviewerName : undefined,
      notes: typeof body.notes === "string" ? body.notes : "",
      outcome: "pending",
    });

    return NextResponse.json(newInterview, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
