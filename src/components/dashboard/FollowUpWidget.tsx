"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface FollowUp {
  id: string;
  clientName: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

interface FollowUpWidgetProps {
  followUps: FollowUp[];
}

export default function FollowUpWidget({ followUps: initial }: FollowUpWidgetProps) {
  const [followUps, setFollowUps] = useState(initial);

  const completeFollowUp = async (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isCompleted: true } : f))
    );
    toast.success("Follow-up marked as complete!");

    try {
      await fetch(`/api/follow-ups/${id}/complete`, { method: "PATCH" });
    } catch {
      // Revert on error
      setFollowUps((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isCompleted: false } : f))
      );
      toast.error("Failed to update follow-up");
    }
  };

  const pending = followUps.filter((f) => !f.isCompleted);

  if (pending.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
          Today&apos;s Follow-Ups
        </h3>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-[var(--muted-fg)] text-sm">
            All caught up! No pending follow-ups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
        Today&apos;s Follow-Ups
        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
          {pending.length}
        </span>
      </h3>
      <div className="space-y-3">
        {pending.map((followUp) => (
          <div
            key={followUp.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border-color)] hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                {followUp.clientName}
              </p>
              <p className="text-xs text-[var(--muted-fg)] mt-0.5 line-clamp-2">
                {followUp.description}
              </p>
            </div>
            <button
              onClick={() => completeFollowUp(followUp.id)}
              className="shrink-0 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-[var(--muted-fg)] hover:text-emerald-600 transition-colors"
              title="Mark complete"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
