"use client";

// components/KanbanColumn.tsx

import React from "react";
import { cn, formatStatusLabel, getStatusColor } from "@/lib/utils";
import { ApplicationCard } from "./ApplicationCard";
import type { ApplicationStatus, JobApplication } from "@/types/job";
import { InboxIcon } from "lucide-react";

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: JobApplication[];
  onCardEdit: (application: JobApplication) => void;
  onCardDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  className?: string;
}

const STATUS_COLUMN_COLORS: Record<ApplicationStatus, string> = {
  saved: "border-t-slate-400",
  applied: "border-t-blue-500",
  "phone-screen": "border-t-indigo-500",
  interview: "border-t-violet-500",
  offer: "border-t-emerald-500",
  rejected: "border-t-red-500",
  withdrawn: "border-t-orange-500",
};

export function KanbanColumn({
  status,
  applications,
  onCardEdit,
  onCardDelete,
  onStatusChange,
  className,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-gray-50/80 rounded-2xl border border-gray-200 border-t-4 min-w-[260px] w-[260px] max-h-full",
        STATUS_COLUMN_COLORS[status],
        className
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">
            {formatStatusLabel(status)}
          </span>
          <span
            className={cn(
              "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold border",
              getStatusColor(status)
            )}
          >
            {applications.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <InboxIcon className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 font-medium">
              No applications
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onCardEdit}
              onDelete={onCardDelete}
              onStatusChange={onStatusChange}
              compact={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
