// app/applications/loading.tsx

import { KanbanSkeleton } from "@/components/skeletons/KanbanSkeleton";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";

export default function ApplicationsLoading() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-7 bg-gray-200 rounded-lg w-36 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-xl w-36 animate-pulse" />
          <div className="h-10 bg-violet-200 rounded-xl w-28 animate-pulse" />
        </div>
      </div>

      {/* Default to Kanban skeleton */}
      <KanbanSkeleton />
    </div>
  );
}
