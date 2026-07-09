// app/page.tsx — Dashboard (Server Component)

import { Suspense } from "react";
import Link from "next/link";
import { PlusIcon, AlertCircleIcon } from "lucide-react";
import { DashboardStatsClient } from "@/components/DashboardStatsClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const showLoginError = params.error === "login_required";

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

      {/* Client stats widget which holds the entire dashboard content to sync with Redux */}
      <Suspense fallback={
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 rounded-2xl" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      }>
        <DashboardStatsClient />
      </Suspense>
    </div>
  );
}
