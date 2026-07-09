"use client";

// app/interviews/page.tsx — Client Component

import React, { useEffect, useState } from "react";
import { CalendarPlusIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchInterviews, cancelInterview, editInterview } from "@/store/interviewSlice";
import { fetchApplications } from "@/store/applicationSlice";
import { InterviewCard } from "@/components/InterviewCard";
import { InterviewModal } from "@/components/InterviewModal";
import type { Interview } from "@/types/job";

export default function InterviewsPage() {
  const dispatch = useAppDispatch();
  const interviews = useAppSelector((state) => state.interviews.interviews);
  const applications = useAppSelector((state) => state.applications.applications);
  const interviewStatus = useAppSelector((state) => state.interviews.status);
  const [modalOpen, setModalOpen] = useState(false);
  const [pastExpanded, setPastExpanded] = useState(false);

  useEffect(() => {
    dispatch(fetchInterviews());
    dispatch(fetchApplications());
  }, [dispatch]);

  const now = new Date();

  const upcoming = interviews
    .filter((i) => new Date(i.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  const past = interviews
    .filter((i) => new Date(i.scheduledAt) <= now)
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  const handleOutcomeChange = async (id: string, outcome: Interview["outcome"]) => {
    if (!outcome) return;
    await dispatch(editInterview({ id, data: { outcome } }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    await dispatch(cancelInterview(id));
  };

  const getCompanyName = (applicationId: string) => {
    return applications.find((a) => a.id === applicationId)?.company;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
        >
          <CalendarPlusIcon className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Upcoming</h2>
        {interviewStatus === "loading" ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10">
            <CalendarPlusIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No upcoming interviews</p>
            <p className="text-gray-400 text-sm mt-1">
              Schedule your next interview to get started
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              <CalendarPlusIcon className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                companyName={getCompanyName(interview.applicationId)}
                onOutcomeChange={handleOutcomeChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Interviews (collapsible) */}
      {past.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <button
            onClick={() => setPastExpanded((v) => !v)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="font-semibold text-gray-900">
              Past Interviews{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({past.length})
              </span>
            </h2>
            {pastExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {pastExpanded && (
            <div className="mt-4 space-y-3">
              {past.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  companyName={getCompanyName(interview.applicationId)}
                  onOutcomeChange={handleOutcomeChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <InterviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
