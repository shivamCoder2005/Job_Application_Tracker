"use client";

// components/InterviewCard.tsx

import React, { useState } from "react";
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  AlertTriangleIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { Interview } from "@/types/job";

interface InterviewCardProps {
  interview: Interview;
  companyName?: string;
  onOutcomeChange: (id: string, outcome: Interview["outcome"]) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const TYPE_LABELS: Record<Interview["type"], string> = {
  phone: "📞 Phone",
  video: "🎥 Video",
  "on-site": "🏢 On-Site",
  technical: "💻 Technical",
  hr: "👤 HR",
};

const OUTCOMES: NonNullable<Interview["outcome"]>[] = ["pass", "fail", "pending"];

function OutcomeBadge({ outcome }: { outcome: Interview["outcome"] }) {
  if (!outcome || outcome === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
        <MinusCircleIcon className="w-3 h-3" />
        Pending
      </span>
    );
  }
  if (outcome === "pass") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
        <CheckCircleIcon className="w-3 h-3" />
        Passed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
      <XCircleIcon className="w-3 h-3" />
      Failed
    </span>
  );
}

export function InterviewCard({
  interview,
  companyName,
  onOutcomeChange,
  onDelete,
  className,
}: InterviewCardProps) {
  const [outcomeOpen, setOutcomeOpen] = useState(false);

  const isOverdue =
    new Date(interview.scheduledAt) < new Date() &&
    (!interview.outcome || interview.outcome === "pending");

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm p-4 transition-all duration-200 hover:shadow-md",
        isOverdue && "border-amber-200 bg-amber-50/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">
              {companyName ? `${companyName} — Round ${interview.round}` : `Round ${interview.round}`}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[interview.type]}
            </span>
            <OutcomeBadge outcome={interview.outcome} />
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <AlertTriangleIcon className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 relative">
          <button
            onClick={() => setOutcomeOpen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Update outcome"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>
          
          {outcomeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setOutcomeOpen(false);
                }}
              />
              <div className="absolute right-0 top-8 z-20 w-36 bg-white rounded-xl border border-gray-100 shadow-lg py-1">
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Outcome
                </p>
                {OUTCOMES.map((o) => (
                  <button
                    key={o}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOutcomeOpen(false);
                      onOutcomeChange(interview.id, o);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors capitalize"
                  >
                    {o === "pass" && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                    {o === "fail" && <XCircleIcon className="w-4 h-4 text-red-500" />}
                    {o === "pending" && <MinusCircleIcon className="w-4 h-4 text-gray-400" />}
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => onDelete(interview.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete interview"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className={cn(isOverdue && "text-amber-600 font-medium")}>
            {formatDateTime(interview.scheduledAt)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
          <span>{interview.duration} minutes</span>
        </div>
        {interview.interviewerName && (
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>{interview.interviewerName}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {interview.notes && (
        <p className="mt-3 text-xs text-gray-500 leading-relaxed line-clamp-2 border-t border-gray-100 pt-2">
          {interview.notes}
        </p>
      )}
    </div>
  );
}
