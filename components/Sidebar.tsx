"use client";

// components/Sidebar.tsx

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  CalendarIcon,
  TargetIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyGoalWidget } from "./WeeklyGoalWidget";
import { useJobSearch } from "@/context/JobSearchContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/applications", label: "Applications", icon: BriefcaseIcon },
  { href: "/add", label: "Add Application", icon: PlusCircleIcon },
  { href: "/interviews", label: "Interviews", icon: CalendarIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { weeklyGoal, goalProgress } = useJobSearch();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-gradient-to-b from-violet-950 via-violet-900 to-indigo-900 text-white fixed left-0 top-0 bottom-0 z-30 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <TargetIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Job Tracker</h1>
            <p className="text-white/50 text-xs">Application Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Weekly Goal Widget */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <WeeklyGoalWidget goal={weeklyGoal} progress={goalProgress} />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all",
                  isActive ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
