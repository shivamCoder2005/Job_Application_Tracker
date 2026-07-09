// components/skeletons/KanbanSkeleton.tsx

import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        <div className="h-5 bg-gray-100 rounded-full w-12" />
        <div className="h-5 bg-gray-100 rounded-full w-16" />
      </div>
    </div>
  );
}

function SkeletonColumn() {
  return (
    <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 min-w-[260px] w-[260px] p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="space-y-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonColumn key={i} />
      ))}
    </div>
  );
}
