"use client";

import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  details: string | null;
  createdAt: string;
  user: { name: string };
}

interface ActivityFeedProps {
  entries: AuditEntry[];
}

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  UPDATE: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  DELETE: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  MOVE: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  LOGIN: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
  LOGOUT: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
};

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <Clock className="w-10 h-10 text-[var(--muted-fg)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted-fg)] text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--background)] transition-colors"
          >
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                actionColors[entry.action] ||
                "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {entry.action}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--foreground)]">
                <span className="font-medium">{entry.user.name}</span>{" "}
                {entry.action.toLowerCase()}d{" "}
                <span className="font-medium">{entry.entity}</span>
              </p>
              {entry.details && (
                <p className="text-xs text-[var(--muted-fg)] mt-0.5 truncate">
                  {entry.details}
                </p>
              )}
              <p className="text-xs text-[var(--muted-fg)] mt-1">
                {formatDistanceToNow(new Date(entry.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
