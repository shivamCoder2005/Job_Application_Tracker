"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { editApplication } from "@/store/applicationSlice";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { cn, ALL_STATUSES, formatStatusLabel } from "@/lib/utils";
import type { JobApplication, WorkType } from "@/types/job";

const WORK_TYPES: WorkType[] = ["remote", "hybrid", "on-site"];

interface EditApplicationClientProps {
  application: JobApplication;
}

export function EditApplicationClient({ application }: EditApplicationClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);

  const { values, errors, handleChange, setFieldValue, handleSubmit, isDirty } =
    useApplicationForm(application);

  const onSubmit = handleSubmit(async (formValues) => {
    setSaving(true);
    const tagsArray = formValues.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await dispatch(
      editApplication({
        id: application.id,
        data: {
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
        },
      })
    );

    setSaving(false);

    if (editApplication.fulfilled.match(result)) {
      router.push(`/applications/${application.id}`);
    }
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href={`/applications/${application.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Application
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Edit Application
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
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.location ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location}</p>
              )}
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
                    {wt.charAt(0).toUpperCase() + wt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status + Date */}
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
                max={new Date().toISOString().split("T")[0]}
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.appliedDate ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.appliedDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.appliedDate}
                </p>
              )}
            </div>
          </div>

          {/* Salary + URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="text"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                placeholder="e.g. $100k - $120k"
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.salary ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.salary && (
                <p className="text-xs text-red-500 mt-1">{errors.salary}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
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
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.contactEmail ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.contactEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>
              )}
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
              placeholder="React, TypeScript, Startup (comma separated)"
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
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t">
            <Link
              href={`/applications/${application.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SaveIcon className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
