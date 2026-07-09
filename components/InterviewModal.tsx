"use client";

// components/InterviewModal.tsx

import React, { useState } from "react";
import { XIcon, CalendarPlusIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { scheduleInterview } from "@/store/interviewSlice";
import { cn } from "@/lib/utils";

interface InterviewModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  applicationId: string;
  round: string;
  type: "phone" | "video" | "on-site" | "technical" | "hr";
  scheduledAt: string;
  duration: string;
  interviewerName: string;
  notes: string;
}

const INTERVIEW_TYPES = [
  { value: "phone", label: "📞 Phone" },
  { value: "video", label: "🎥 Video" },
  { value: "on-site", label: "🏢 On-Site" },
  { value: "technical", label: "💻 Technical" },
  { value: "hr", label: "👤 HR" },
] as const;

export function InterviewModal({ open, onClose }: InterviewModalProps) {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(
    (state) => state.applications.applications
  );
  const interviewStatus = useAppSelector((state) => state.interviews.status);

  const [form, setForm] = useState<FormState>({
    applicationId: "",
    round: "1",
    type: "phone",
    scheduledAt: "",
    duration: "30",
    interviewerName: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [search, setSearch] = useState("");

  const selectedApp = applications.find(a => a.id === form.applicationId);
  const searchString = selectedApp ? `${selectedApp.company} — ${selectedApp.role}` : "";
  const showDropdown = search !== searchString;

  const filteredApps = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase())
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!form.applicationId) newErrors.applicationId = "Select an application";
    if (!form.scheduledAt) {
      newErrors.scheduledAt = "Scheduled date & time is required";
    } else if (new Date(form.scheduledAt) <= new Date()) {
      newErrors.scheduledAt = "Must be a future date & time";
    }
    const round = parseInt(form.round, 10);
    if (isNaN(round) || round < 1) newErrors.round = "Must be a positive number";
    const duration = parseInt(form.duration, 10);
    if (isNaN(duration) || duration < 1) newErrors.duration = "Must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      scheduleInterview({
        applicationId: form.applicationId,
        round: parseInt(form.round, 10),
        type: form.type,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        duration: parseInt(form.duration, 10),
        interviewerName: form.interviewerName || undefined,
        notes: form.notes,
      })
    );

    if (scheduleInterview.fulfilled.match(result)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setForm({
      applicationId: "",
      round: "1",
      type: "phone",
      scheduledAt: "",
      duration: "30",
      interviewerName: "",
      notes: "",
    });
    setErrors({});
    setSearch("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CalendarPlusIcon className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Schedule Interview
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Application selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (form.applicationId) setForm(f => ({ ...f, applicationId: "" }));
              }}
              placeholder="Search company or role..."
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300",
                errors.applicationId ? "border-red-300" : "border-gray-200",
                showDropdown ? "mb-2" : "mb-0"
              )}
            />
            {showDropdown && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg rounded-lg max-h-48 overflow-y-auto">
                {filteredApps.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No applications found
                  </p>
                ) : (
                  filteredApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, applicationId: app.id }));
                        setSearch(`${app.company} — ${app.role}`);
                        if (errors.applicationId)
                          setErrors((e) => ({ ...e, applicationId: undefined }));
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-violet-50 border-b border-gray-50 last:border-0",
                        form.applicationId === app.id &&
                          "bg-violet-100 text-violet-700"
                      )}
                    >
                      <span className="font-medium">{app.company}</span>
                      <span className="text-gray-400 ml-1">— {app.role}</span>
                    </button>
                  ))
                )}
              </div>
            )}
            {errors.applicationId && (
              <p className="text-xs text-red-500 mt-1">{errors.applicationId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Round */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="round"
                value={form.round}
                onChange={(e) => setForm((f) => ({ ...f, round: e.target.value }))}
                min="1"
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300",
                  errors.round ? "border-red-300" : "border-gray-200"
                )}
              />
              {errors.round && (
                <p className="text-xs text-red-500 mt-1">{errors.round}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as FormState["type"] }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              >
                {INTERVIEW_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, scheduledAt: e.target.value }))
              }
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300",
                errors.scheduledAt ? "border-red-300" : "border-gray-200"
              )}
            />
            {errors.scheduledAt && (
              <p className="text-xs text-red-500 mt-1">{errors.scheduledAt}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              min="1"
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300",
                errors.duration ? "border-red-300" : "border-gray-200"
              )}
            />
            {errors.duration && (
              <p className="text-xs text-red-500 mt-1">{errors.duration}</p>
            )}
          </div>

          {/* Interviewer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interviewer Name
            </label>
            <input
              type="text"
              value={form.interviewerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, interviewerName: e.target.value }))
              }
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={3}
              placeholder="Add any notes about this interview..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={interviewStatus === "loading"}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl transition-colors"
            >
              {interviewStatus === "loading" ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
