"use client";

import React, { useState, useEffect } from "react";
import { XIcon, TargetIcon } from "lucide-react";
import { useJobSearch } from "@/context/JobSearchContext";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const {
    targetRole,
    setTargetRole,
    targetSalary,
    setTargetSalary,
    weeklyGoal,
    setWeeklyGoal,
  } = useJobSearch();

  const [localRole, setLocalRole] = useState(targetRole);
  const [localSalary, setLocalSalary] = useState(targetSalary);
  const [localGoal, setLocalGoal] = useState(weeklyGoal.toString());

  // Sync local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalRole(targetRole);
      setLocalSalary(targetSalary);
      setLocalGoal(weeklyGoal.toString());
    }
  }, [open, targetRole, targetSalary, weeklyGoal]);

  if (!open) return null;

  const handleSave = () => {
    setTargetRole(localRole);
    setTargetSalary(localSalary);
    
    const parsedGoal = parseInt(localGoal, 10);
    if (!isNaN(parsedGoal) && parsedGoal >= 0) {
      setWeeklyGoal(parsedGoal);
    }
    
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900">
            <TargetIcon className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-lg">Job Search Goals</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Role
            </label>
            <input
              type="text"
              value={localRole}
              onChange={(e) => setLocalRole(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Salary
            </label>
            <input
              type="text"
              value={localSalary}
              onChange={(e) => setLocalSalary(e.target.value)}
              placeholder="e.g. $120,000"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Application Goal
            </label>
            <input
              type="number"
              min="0"
              value={localGoal}
              onChange={(e) => setLocalGoal(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            Save Goals
          </button>
        </div>
      </div>
    </>
  );
}
