"use client";

// app/add/page.tsx — Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { createApplication } from "@/store/applicationSlice";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { cn, ALL_STATUSES, formatStatusLabel } from "@/lib/utils";
import type { ApplicationStatus, WorkType } from "@/types/job";

const WORK_TYPES: WorkType[] = ["remote", "hybrid", "on-site"];

export default function AddApplicationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);

  const { values, errors, handleChange, handleSubmit } = useApplicationForm();

  const onSubmit = handleSubmit(async (formValues) => {
    setSaving(true);
    const tagsArray = formValues.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await dispatch(
      createApplication({
        company: formValues.company,
        role: formValues.role,
        location: formValues.location,
        workType: formValues.workType,
        salary: formValues.salary || undefined,
        status: formValues.status,
        appliedDate: formValues.appliedDate,
        url: formValues.url || undefined,
        contactName: formValues.contactName || undefined,
        contactEmail: formValues.contactEmail || undefined,
        notes: formValues.notes,
        tags: tagsArray,
      })
    );

    setSaving(false);

    if (createApplication.fulfilled.match(result)) {
      router.push("/applications");
    }
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Applications
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Add New Application
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Company + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={values.company}
                onChange={handleChange}
                placeholder="e.g., Stripe"
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.company ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.company && (
                <p className="text-xs text-red-500 mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={values.role}
                onChange={handleChange}
                placeholder="e.g., Senior Frontend Engineer"
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.role ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Location + Work Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={values.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type
              </label>
              <select
                name="workType"
                value={values.workType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              >
                {WORK_TYPES.map((wt) => (
                  <option key={wt} value={wt}>
                    {wt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status + Applied Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white",
                  errors.status ? "border-red-300" : "border-gray-200"
                )}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {formatStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applied Date
              </label>
              <input
                type="date"
                name="appliedDate"
                value={values.appliedDate}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.appliedDate ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.appliedDate && (
                <p className="text-xs text-red-500 mt-1">{errors.appliedDate}</p>
              )}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={values.salary}
              onChange={handleChange}
              placeholder="e.g., $80,000 – $100,000"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Posting URL
            </label>
            <input
              type="url"
              name="url"
              value={values.url}
              onChange={handleChange}
              placeholder="https://..."
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                errors.url ? "border-red-300" : "border-gray-200"
              )}
            />
            {errors.url && (
              <p className="text-xs text-red-500 mt-1">{errors.url}</p>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={values.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={values.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="React, TypeScript, Startup (comma-separated)"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this application..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/applications"
              className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              {saving ? "Adding..." : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
