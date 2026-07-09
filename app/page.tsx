// app/page.tsx — Dashboard (Server Component)

import { Suspense } from "react";
import Link from "next/link";
import { getApplications, getInterviews } from "@/lib/data";
import {
  BriefcaseIcon,
  TrendingUpIcon,
  CalendarIcon,
  PlusIcon,
  ArrowRightIcon,
  AlertCircleIcon,
} from "lucide-react";
import { formatStatusLabel, getStatusColor, formatDateTime } from "@/lib/utils";
import type { JobApplication, Interview } from "@/types/job";
import { DashboardStatsClient } from "@/components/DashboardStatsClient";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}

function StatCard({ label, value, sub, color, icon: Icon }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-5 ${color} text-white shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-white/70 text-xs mt-1">{sub}</p>}
        </div>
        <div className="p-2 bg-white/20 rounded-xl">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function RecentApplicationRow({ app }: { app: JobApplication }) {
  return (
    <Link
      href={`/applications/${app.id}`}
      className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {app.company.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {app.company}
          </p>
          <p className="text-xs text-gray-500 truncate">{app.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(app.status)}`}
        >
          {formatStatusLabel(app.status)}
        </span>
        <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </Link>
  );
}

function UpcomingInterviewRow({ interview, apps }: { interview: Interview; apps: JobApplication[] }) {
  const app = apps.find((a) => a.id === interview.applicationId);
  if (!app) return null;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {app.company.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {app.company} — Round {interview.round}
        </p>
        <p className="text-xs text-gray-500">{formatDateTime(interview.scheduledAt)}</p>
      </div>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
        {interview.duration}m
      </span>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const showLoginError = params.error === "login_required";

  // Server-side data fetching
  const allApplications = getApplications();
  const allInterviews = getInterviews();

  // Compute stats server-side for SSR
  const total = allApplications.length;
  const activeApps = allApplications.filter(
    (a) => a.status !== "rejected" && a.status !== "withdrawn"
  ).length;
  const offers = allApplications.filter((a) => a.status === "offer").length;
  const notSaved = allApplications.filter((a) => a.status !== "saved");
  const responded = notSaved.filter(
    (a) => a.status !== "applied"
  );
  const responseRate =
    notSaved.length > 0
      ? Math.round((responded.length / notSaved.length) * 100)
      : 0;

  // Recent applications (top 5)
  const recentApps = allApplications.slice(0, 5);

  // Upcoming interviews (future, sorted by scheduledAt)
  const now = new Date();
  const upcomingInterviews = allInterviews
    .filter((i) => new Date(i.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Login required banner */}
      {showLoginError && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Session Required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              You need to set the{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
                job_tracker_session
              </code>{" "}
              cookie to access protected pages. Open DevTools → Application →
              Cookies and add{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
                job_tracker_session=demo
              </code>
              .
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your job search overview
          </p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Application
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={total}
          sub={`${activeApps} active`}
          color="bg-gradient-to-br from-violet-600 to-indigo-600"
          icon={BriefcaseIcon}
        />
        <StatCard
          label="Active"
          value={activeApps}
          sub="Not rejected/withdrawn"
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
          icon={TrendingUpIcon}
        />
        <StatCard
          label="Response Rate"
          value={`${responseRate}%`}
          sub="Applied → Screen+"
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
          icon={TrendingUpIcon}
        />
        <StatCard
          label="Offers"
          value={offers}
          sub={`${total > 0 ? Math.round((offers / total) * 100) : 0}% offer rate`}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
          icon={CalendarIcon}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link
              href="/applications"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              View all →
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No applications yet</p>
              <Link
                href="/add"
                className="mt-3 inline-flex text-sm text-violet-600 hover:underline"
              >
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map((app) => (
                <RecentApplicationRow key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Interviews</h2>
            <Link
              href="/interviews"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              View all →
            </Link>
          </div>
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No upcoming interviews</p>
              <Link
                href="/interviews"
                className="mt-3 inline-flex text-sm text-violet-600 hover:underline"
              >
                Schedule an interview
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingInterviews.map((interview) => (
                <UpcomingInterviewRow
                  key={interview.id}
                  interview={interview}
                  apps={allApplications}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client stats widget */}
      <Suspense fallback={null}>
        <DashboardStatsClient />
      </Suspense>
    </div>
  );
}
