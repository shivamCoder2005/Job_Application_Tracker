"use client";

// app/applications/[id]/edit/page.tsx — Client Component

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, SaveIcon, LoaderIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { editApplication } from "@/store/applicationSlice";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { cn, ALL_STATUSES, formatStatusLabel } from "@/lib/utils";
import type { JobApplication, ApplicationStatus, WorkType } from "@/types/job";

const WORK_TYPES: WorkType[] = ["remote", "hybrid", "on-site"];

export default function EditApplicationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApp() {
      try {
        const res = await fetch(`/api/applications/${params.id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setFetchError("Application not found");
          return;
        }
        const data = (await res.json()) as JobApplication;
        setApplication(data);
      } catch {
        setFetchError("Failed to load application");
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [params.id]);

  const { values, errors, handleChange, setFieldValue, handleSubmit, isDirty } =
    useApplicationForm(application ?? undefined);

  const onSubmit = handleSubmit(async (formValues) => {
    setSaving(true);
    const tagsArray = formValues.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await dispatch(
      editApplication({
        id: params.id,
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
      router.push(`/applications/${params.id}`);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoaderIcon className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{fetchError}</p>
        <Link href="/applications" className="mt-4 inline-block text-violet-600 hover:underline">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href={`/applications/${params.id}`}
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
              placeholder="React, TypeScript, Remote (comma-separated)"
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
              href={`/applications/${params.id}`}
              className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <SaveIcon className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
