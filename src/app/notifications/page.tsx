"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => { setNotifications(data.notifications || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    for (const n of notifications.filter((n) => !n.isRead)) {
      await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) });
    }
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const grouped = filtered.reduce((acc, n) => {
    const date = new Date(n.createdAt);
    const key = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : "Earlier";
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  const typeIcon: Record<string, string> = {
    lead: "🎯",
    appointment: "📅",
    followup: "🔔",
    system: "⚙️",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Stay updated with your CRM activity.</p>
        </div>
        <button onClick={markAllRead} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors w-full sm:w-auto border border-indigo-100 dark:border-indigo-900/30 sm:border-transparent">
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "all" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>All</button>
        <button onClick={() => setFilter("unread")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "unread" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>Unread</button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 mx-auto text-[var(--muted-fg)] mb-3 opacity-50" />
          <p className="font-medium text-[var(--foreground)]">All caught up!</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-[var(--muted-fg)] mb-3">{group}</h3>
              <div className="space-y-2">
                {items.map((n) => (
                  <button key={n.id} onClick={() => markRead(n.id)} className={`w-full text-left bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-xl p-4 flex items-start gap-4 transition-all hover:shadow-md ${!n.isRead ? "border-l-4 border-l-indigo-500" : ""}`}>
                    <span className="text-2xl shrink-0">{typeIcon[n.type] || "📢"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${!n.isRead ? "text-[var(--foreground)]" : "text-[var(--muted-fg)]"}`}>{n.title}</p>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-[var(--muted-fg)] mt-0.5">{n.message}</p>
                      <p className="text-xs text-[var(--muted-fg)] mt-1">{format(new Date(n.createdAt), "h:mm a")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
