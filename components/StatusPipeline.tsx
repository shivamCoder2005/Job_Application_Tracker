"use client";

// components/StatusPipeline.tsx

import React from "react";
import { CheckIcon, XIcon, MinusIcon } from "lucide-react";
import { cn, formatStatusLabel, PIPELINE_STATUSES } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/job";

interface StatusPipelineProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

export function StatusPipeline({
  currentStatus,
  className,
}: StatusPipelineProps) {
  const isTerminal =
    currentStatus === "rejected" || currentStatus === "withdrawn";

  const currentPipelineIndex = isTerminal
    ? -1
    : PIPELINE_STATUSES.indexOf(currentStatus);

  return (
    <div className={cn("w-full", className)}>
      {/* Main pipeline */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {PIPELINE_STATUSES.map((status, index) => {
          const isCompleted =
            !isTerminal && index < currentPipelineIndex;
          const isCurrent =
            !isTerminal && index === currentPipelineIndex;
          const isPending =
            isTerminal || index > currentPipelineIndex;

          return (
            <React.Fragment key={status}>
              {/* Step node */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-all duration-200",
                    isCompleted &&
                      "bg-emerald-500 border-emerald-500 text-white",
                    isCurrent &&
                      "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200 scale-110",
                    isPending &&
                      "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium whitespace-nowrap",
                    isCurrent && "text-violet-600",
                    isCompleted && "text-emerald-600",
                    isPending && "text-gray-400"
                  )}
                >
                  {formatStatusLabel(status)}
                </span>
              </div>

              {/* Connector line */}
              {index < PIPELINE_STATUSES.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 min-w-[20px] mx-1 mt-[-16px] transition-all duration-200",
                    index < currentPipelineIndex
                      ? "bg-emerald-400"
                      : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Terminal state indicator */}
      {isTerminal && (
        <div
          className={cn(
            "mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            currentStatus === "rejected"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-orange-50 border border-orange-200 text-orange-700"
          )}
        >
          {currentStatus === "rejected" ? (
            <XIcon className="w-4 h-4" />
          ) : (
            <MinusIcon className="w-4 h-4" />
          )}
          <span>
            {currentStatus === "rejected"
              ? "Application was rejected"
              : "Application was withdrawn"}
          </span>
        </div>
      )}
    </div>
  );
}
