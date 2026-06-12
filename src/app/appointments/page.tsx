"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
import { format } from "date-fns";

interface Appointment {
  id: string;
  dateTime: string;
  duration: number;
  type: string;
  status: string;
  fee: number;
  client: { name: string };
  astrologer: { name: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => { setAppointments(data.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.dateTime) >= now && a.status !== "CANCELLED" && a.status !== "COMPLETED");
  const displayed = tab === "upcoming" ? upcoming : appointments;

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Calendar }> = {
    SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: Clock },
    CONFIRMED: { label: "Confirmed", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300", icon: CheckCircle },
    COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
    NO_SHOW: { label: "No Show", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: AlertCircle },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Appointments</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Schedule and manage client sessions.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Schedule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("upcoming")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "upcoming" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>
          Upcoming ({upcoming.length})
        </button>
        <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "all" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>
          All ({appointments.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 mx-auto text-[var(--muted-fg)] mb-3 opacity-50" />
          <p className="font-medium text-[var(--foreground)]">No appointments</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Schedule your first consultation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((appt, i) => {
            const status = statusConfig[appt.status] || statusConfig.SCHEDULED;
            return (
              <div key={appt.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[var(--foreground)]">{appt.type}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                      </div>
                      <p className="text-sm text-[var(--muted-fg)] flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{appt.client.name}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{format(new Date(appt.dateTime), "MMM d, h:mm a")}</span>
                        <span>{appt.duration}min</span>
                        <span className="font-medium text-green-600">₹{appt.fee}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appt.status === "SCHEDULED" && (
                      <>
                        <button onClick={() => updateStatus(appt.id, "CONFIRMED")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 hover:bg-indigo-200 transition-colors">Confirm</button>
                        <button onClick={() => updateStatus(appt.id, "CANCELLED")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 hover:bg-red-200 transition-colors">Cancel</button>
                      </>
                    )}
                    {appt.status === "CONFIRMED" && (
                      <button onClick={() => updateStatus(appt.id, "COMPLETED")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 hover:bg-green-200 transition-colors">Complete</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
