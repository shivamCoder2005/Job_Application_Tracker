// app/applications/[id]/page.tsx — Server Component

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  UserIcon,
  MailIcon,
  TagIcon,
  PencilIcon,
} from "lucide-react";
import { getApplicationById, getInterviews } from "@/lib/data";
import { StatusPipeline } from "@/components/StatusPipeline";
import { ApplicationDetailClient } from "@/components/ApplicationDetailClient";
import {
  formatDate,
  getStatusColor,
  getWorkTypeBadge,
  formatStatusLabel,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const application = getApplicationById(id);

  if (!application) {
    notFound();
  }

  const interviews = getInterviews(id);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Applications
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {application.company}
              </h1>
              <p className="text-gray-500 text-base">{application.role}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}
                >
                  {formatStatusLabel(application.status)}
                </span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium ${getWorkTypeBadge(application.workType)}`}
                >
                  {application.workType}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/applications/${application.id}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors flex-shrink-0"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </Link>
        </div>

        {/* Status Pipeline */}
        <div className="mt-6">
          <StatusPipeline currentStatus={application.status} />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide text-gray-500">
            Details
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{application.location}</span>
            </div>
            {application.appliedDate && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">
                  Applied {formatDate(application.appliedDate)}
                </span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 text-base">💰</span>
                <span className="text-gray-700">{application.salary}</span>
              </div>
            )}
            {application.url && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 hover:underline truncate"
                >
                  View Job Posting
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        {(application.contactName || application.contactEmail) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
              Contact
            </h2>
            <div className="space-y-2.5">
              {application.contactName && (
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{application.contactName}</span>
                </div>
              )}
              {application.contactEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${application.contactEmail}`}
                    className="text-violet-600 hover:underline"
                  >
                    {application.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {application.tags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
              Tags
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {application.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {application.notes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">
            Notes
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {application.notes}
          </p>
        </div>
      )}

      {/* Interviews */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Interviews{" "}
            <span className="text-gray-400 font-normal text-sm">
              ({interviews.length})
            </span>
          </h2>
          <Link
            href="/interviews"
            className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            Schedule Interview →
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No interviews scheduled yet</p>
          </div>
        ) : (
          <ApplicationDetailClient
            initialInterviews={interviews}
            applicationId={id}
          />
        )}
      </div>
    </div>
  );
}
