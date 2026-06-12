"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Video } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";

interface Appointment {
  id: string;
  dateTime: string;
  type: string;
  status: string;
  client: { name: string };
  astrologer: { name: string };
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => { setAppointments(data.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((a) => isSameDay(new Date(a.dateTime), day));

  const selectedAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  const statusColor: Record<string, string> = {
    SCHEDULED: "bg-blue-500",
    CONFIRMED: "bg-indigo-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
    NO_SHOW: "bg-amber-500",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Calendar</h1>
          <p className="text-[var(--muted-fg)] mt-1">View appointments on a calendar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors">
              <ChevronLeft className="w-5 h-5 text-[var(--muted-fg)]" />
            </button>
            <h2 className="text-xl font-bold text-[var(--foreground)]">{format(currentMonth, "MMMM yyyy")}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors">
              <ChevronRight className="w-5 h-5 text-[var(--muted-fg)]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-[var(--muted-fg)] py-2">{d}</div>
            ))}
            {days.map((day) => {
              const dayAppts = getAppointmentsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-2 rounded-xl text-sm transition-all min-h-[64px] flex flex-col items-center
                    ${!isSameMonth(day, currentMonth) ? "text-[var(--muted-fg)] opacity-40" : "text-[var(--foreground)]"}
                    ${isToday(day) ? "ring-2 ring-indigo-500" : ""}
                    ${isSelected ? "bg-indigo-50 dark:bg-indigo-950/40" : "hover:bg-[var(--surface-hover)]"}
                  `}
                >
                  <span className={`font-medium ${isToday(day) ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}`}>
                    {format(day, "d")}
                  </span>
                  {dayAppts.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayAppts.slice(0, 3).map((a) => (
                        <div key={a.id} className={`w-1.5 h-1.5 rounded-full ${statusColor[a.status] || "bg-gray-400"}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail Panel */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">
            {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
          </h3>
          {selectedDate && selectedAppointments.length === 0 && (
            <p className="text-[var(--muted-fg)] text-sm">No appointments on this day.</p>
          )}
          <div className="space-y-3">
            {selectedAppointments.map((a) => (
              <div key={a.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 animate-scale-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-[var(--foreground)]">{a.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${statusColor[a.status] || "bg-gray-400"}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {format(new Date(a.dateTime), "h:mm a")}
                </p>
                <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" /> {a.client.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
