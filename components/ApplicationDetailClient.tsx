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

  const handleOutcomeChange = async (id: string, outcome: Interview["outcome"]) => {
    if (!outcome) return;
    await dispatch(editInterview({ id, data: { outcome } }));
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
          onOutcomeChange={handleOutcomeChange}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
