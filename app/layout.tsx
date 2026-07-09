// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { JobSearchProvider } from "@/context/JobSearchContext";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Job Tracker — Application Manager",
  description:
    "Track your job applications, manage interview schedules, and visualize your job search progress with Job Tracker.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ReduxProvider>
          <JobSearchProvider>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
              <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
                {children}
              </div>
            </main>
          </JobSearchProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
