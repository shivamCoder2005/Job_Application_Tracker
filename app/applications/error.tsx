"use client";

// app/applications/error.tsx

import { useEffect } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ApplicationsError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Applications Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangleIcon className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Failed to Load Applications
      </h2>
      <p className="text-gray-500 text-sm max-w-md mb-2">
        {error.message ||
          "An unexpected error occurred while loading your applications. Please try again."}
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
      >
        <RefreshCwIcon className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
