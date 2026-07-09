"use client";

// components/ApplicationCard.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "lucide-react";
import {
  cn,
  formatDate,
  getStatusColor,
  getWorkTypeBadge,
  formatStatusLabel,
  ALL_STATUSES,
} from "@/lib/utils";
import type { JobApplication, ApplicationStatus } from "@/types/job";

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  compact?: boolean;
  className?: string;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
  compact = false,
  className,
}: ApplicationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const router = useRouter();

  const visibleTags = application.tags.slice(0, 3);
  const extraTags = application.tags.length - 3;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest("[data-no-navigate]")) return;
    router.push(`/applications/${application.id}`);
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
        compact ? "p-3" : "p-4",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        {/* Company Logo Placeholder + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {application.company.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold text-gray-900 truncate leading-tight",
                compact ? "text-sm" : "text-base"
              )}
            >
              {application.company}
            </h3>
            <p
              className={cn(
                "text-gray-500 truncate",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {application.role}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div data-no-navigate className="flex items-center gap-1">
          {/* Status badge */}
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              getStatusColor(application.status)
            )}
          >
            {formatStatusLabel(application.status)}
          </span>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
                setStatusOpen(false);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="More actions"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit(application);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setStatusOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BriefcaseIcon className="w-4 h-4" />
                    Change Status
                  </button>
                  {application.url && (
                    <a
                      href={application.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                      View Job Post
                    </a>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete(application.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}

            {/* Status Dropdown */}
            {statusOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusOpen(false);
                  }}
                />
                <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Move to
                  </p>
                  {ALL_STATUSES.filter((s) => s !== application.status).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusOpen(false);
                          onStatusChange(application.id, status);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            getStatusColor(status)
                              .split(" ")
                              .find((c) => c.startsWith("bg-")) ?? "bg-gray-400"
                          )}
                        />
                        {formatStatusLabel(status)}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      {!compact && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5" />
              {application.location}
            </span>
            <span
              className={cn(
                "inline-flex px-1.5 py-0.5 rounded-md text-xs font-medium",
                getWorkTypeBadge(application.workType)
              )}
            >
              {application.workType}
            </span>
          </div>

          {application.appliedDate && (
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <CalendarIcon className="w-3.5 h-3.5" />
              Applied {formatDate(application.appliedDate)}
            </div>
          )}

          {application.salary && (
            <div className="text-xs text-gray-500 font-medium">
              💰 {application.salary}
            </div>
          )}
        </div>
      )}

      {/* Compact location */}
      {compact && (
        <div className="mt-1 flex items-center gap-1 text-gray-400 text-xs">
          <MapPinIcon className="w-3 h-3" />
          {application.location}
        </div>
      )}

      {/* Tags */}
      {application.tags.length > 0 && (
        <div data-no-navigate className="mt-3 flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-400 text-xs rounded-full font-medium border border-gray-200">
              +{extraTags} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
