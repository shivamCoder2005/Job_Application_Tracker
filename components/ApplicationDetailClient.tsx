"use client";

// components/ApplicationDetailClient.tsx

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setInterviews, editInterview, cancelInterview } from "@/store/interviewSlice";
import { InterviewCard } from "./InterviewCard";
import type { Interview } from "@/types/job";

interface ApplicationDetailClientProps {
  initialInterviews: Interview[];
  applicationId: string;
}

export function ApplicationDetailClient({
  initialInterviews,
  applicationId,
}: ApplicationDetailClientProps) {
  const dispatch = useAppDispatch();
  const allInterviews = useAppSelector((state) => state.interviews.interviews);

  useEffect(() => {
    dispatch(setInterviews(initialInterviews));
  }, [dispatch, initialInterviews]);

  const interviews = allInterviews.filter(
    (i) => i.applicationId === applicationId
  );

  const handleEdit = async (interview: Interview) => {
    const outcomeInput = window.prompt(
      `Update outcome for Round ${interview.round} (pass/fail/pending):`,
      interview.outcome ?? "pending"
    );
    if (!outcomeInput) return;
    const outcome = outcomeInput.trim() as "pass" | "fail" | "pending";
    if (!["pass", "fail", "pending"].includes(outcome)) {
      alert("Invalid outcome. Use: pass, fail, or pending");
      return;
    }
    await dispatch(editInterview({ id: interview.id, data: { outcome } }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    await dispatch(cancelInterview(id));
  };

  return (
    <div className="space-y-3">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
