"use client";

// components/InterviewCard.tsx

import React from "react";
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
  onEdit: (interview: Interview) => void;
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
  onEdit,
  onDelete,
  className,
}: InterviewCardProps) {
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
              Round {interview.round}
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
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(interview)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Edit interview"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>
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
