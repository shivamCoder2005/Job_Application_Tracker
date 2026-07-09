"use client";

// components/ApplicationFiltersBar.tsx

import React, { useState } from "react";
import { SearchIcon, XIcon, SlidersHorizontalIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setFilters, clearFilters } from "@/store/applicationSlice";
import { cn, ALL_STATUSES, formatStatusLabel } from "@/lib/utils";
import type { ApplicationStatus, WorkType } from "@/types/job";

interface ApplicationFiltersBarProps {
  className?: string;
}

const WORK_TYPES: WorkType[] = ["remote", "hybrid", "on-site"];

export function ApplicationFiltersBar({ className }: ApplicationFiltersBarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.applications.filters);
  const [tagInput, setTagInput] = useState("");

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.workType !== "all" ||
    filters.search !== "" ||
    filters.tags.length > 0;

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.trim();
      if (!filters.tags.includes(tag)) {
        dispatch(setFilters({ tags: [...filters.tags, tag] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    dispatch(setFilters({ tags: filters.tags.filter((t) => t !== tag) }));
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              !
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              dispatch(setFilters({ search: e.target.value }))
            }
            placeholder="Search company, role..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setFilters({ status: e.target.value as ApplicationStatus | "all" })
            )
          }
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent bg-white transition-all"
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatusLabel(s)}
            </option>
          ))}
        </select>

        {/* Work Type */}
        <select
          value={filters.workType}
          onChange={(e) =>
            dispatch(
              setFilters({ workType: e.target.value as WorkType | "all" })
            )
          }
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent bg-white transition-all"
        >
          <option value="all">All Work Types</option>
          {WORK_TYPES.map((wt) => (
            <option key={wt} value={wt}>
              {wt.charAt(0).toUpperCase() + wt.slice(1)}
            </option>
          ))}
        </select>

        {/* Tag input */}
        <div className="relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Filter by tag..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Active Tags */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filters.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full font-medium"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-violet-900 transition-colors"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
