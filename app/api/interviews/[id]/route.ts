// app/api/interviews/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getInterviewById, updateInterview, deleteInterview } from "@/services/interview.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = getInterviewById(id);
  if (!existing) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  try {
    const body = await request.json() as Record<string, unknown>;

    const validTypes = ["phone", "video", "on-site", "technical", "hr"] as const;
    type InterviewType = (typeof validTypes)[number];
    const validOutcomes = ["pass", "fail", "pending"] as const;
    type Outcome = (typeof validOutcomes)[number];

    if (body.type !== undefined && !validTypes.includes(body.type as InterviewType)) {
      return NextResponse.json({ error: `Invalid type` }, { status: 400 });
    }

    if (body.outcome !== undefined && !validOutcomes.includes(body.outcome as Outcome)) {
      return NextResponse.json({ error: `Invalid outcome` }, { status: 400 });
    }

    if (body.scheduledAt !== undefined) {
      const date = new Date(String(body.scheduledAt));
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "scheduledAt must be a valid ISO timestamp" },
          { status: 400 }
        );
      }
    }

    const updated = updateInterview(id, {
      ...(body.type !== undefined && { type: body.type as InterviewType }),
      ...(typeof body.round === "number" && { round: body.round }),
      ...(typeof body.scheduledAt === "string" && { scheduledAt: body.scheduledAt }),
      ...(typeof body.duration === "number" && { duration: body.duration }),
      ...(typeof body.interviewerName === "string" && { interviewerName: body.interviewerName }),
      ...(typeof body.notes === "string" && { notes: body.notes }),
      ...(body.outcome !== undefined && { outcome: body.outcome as Outcome }),
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
  const existing = getInterviewById(id);
  if (!existing) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  const success = deleteInterview(id);
  if (!success) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
