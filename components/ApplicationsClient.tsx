"use client";

// components/ApplicationsClient.tsx

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGridIcon, ListIcon, PlusIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setApplications, setViewMode, editApplication, deleteApplication } from "@/store/applicationSlice";
import { useFilteredApplications } from "@/hooks/useFilteredApplications";
import { ApplicationCard } from "./ApplicationCard";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationFiltersBar } from "./ApplicationFiltersBar";
import { cn, ALL_STATUSES } from "@/lib/utils";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import Link from "next/link";

interface ApplicationsClientProps {
  initialApplications: JobApplication[];
}

export function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const viewMode = useAppSelector((state) => state.applications.viewMode);
  const { filteredApplications, count } = useFilteredApplications();

  // Seed Redux from server-fetched data
  useEffect(() => {
    dispatch(setApplications(initialApplications));
  }, [dispatch, initialApplications]);

  const handleEdit = (application: JobApplication) => {
    router.push(`/applications/${application.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application? This will also delete all associated interviews.")) return;
    await dispatch(deleteApplication(id));
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await dispatch(editApplication({ id, data: { status } }));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {count} application{count !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => dispatch(setViewMode("list"))}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-label="List view"
            >
              <ListIcon className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => dispatch(setViewMode("kanban"))}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                viewMode === "kanban"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-label="Kanban view"
            >
              <LayoutGridIcon className="w-4 h-4" />
              Kanban
            </button>
          </div>

          <Link
            href="/add"
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add New
          </Link>
        </div>
      </div>

      {/* List view: show filters bar */}
      {viewMode === "list" && (
        <ApplicationFiltersBar />
      )}

      {/* Content */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {ALL_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={filteredApplications.filter(
                (app) => app.status === status
              )}
              onCardEdit={handleEdit}
              onCardDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <ListIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No applications found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or add a new application
              </p>
              <Link
                href="/add"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Application
              </Link>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
