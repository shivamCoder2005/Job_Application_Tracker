"use client";

// components/WeeklyGoalWidget.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface WeeklyGoalWidgetProps {
  goal: number;
  progress: number;
  className?: string;
}

export function WeeklyGoalWidget({
  goal,
  progress,
  className,
}: WeeklyGoalWidgetProps) {
  const percentage = goal > 0 ? Math.min((progress / goal) * 100, 100) : 0;
  const isGoalMet = progress >= goal;
  const isHalfway = percentage >= 50;

  // Circular progress calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const ringColor = isGoalMet
    ? "#10b981" // emerald
    : isHalfway
    ? "#f59e0b" // amber
    : "#94a3b8"; // gray

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl backdrop-blur-sm",
        className
      )}
    >
      {/* Circular Progress */}
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 72 72"
        >
          {/* Track */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {progress}/{goal}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-white/80 text-xs font-medium">Weekly Goal</p>
        <p className="text-white/60 text-xs mt-0.5">
          {isGoalMet
            ? "🎉 Goal met!"
            : `${goal - progress} more to go`}
        </p>
      </div>
    </div>
  );
}
