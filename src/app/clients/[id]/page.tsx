import { prisma } from "@/lib/prisma";
import { MapPin, Clock, Calendar, Mail, Phone, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { dateTime: "desc" },
        include: { astrologer: { select: { name: true } } },
      },
      followUps: { orderBy: { dueDate: "desc" } },
      leads: true,
    },
  });

  if (!client) {
    notFound();
  }

  const totalSpent = client.appointments
    .filter((a) => a.status === "COMPLETED")
    .reduce((sum, a) => sum + a.fee, 0);

  const lastVisit = client.appointments.find((a) => a.status === "COMPLETED");

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Navigation */}
      <Link href="/clients" className="inline-flex items-center gap-2 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      {/* Profile Hero */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
        <div className="flex items-start gap-6">
          {client.avatar ? (
            <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {getInitials(client.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{client.name}</h1>
              {client.zodiacSign && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {client.zodiacSign}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-fg)] mt-2">
              {client.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{client.email}</span>}
              {client.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{client.phone}</span>}
              {client.birthPlace && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{client.birthPlace}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[var(--foreground)]">{client.appointments.length}</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Total Sessions</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Total Spent</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[var(--foreground)]">{lastVisit ? format(new Date(lastVisit.dateTime), "MMM d") : "N/A"}</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Last Visit</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Personal Details</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Date of Birth", value: client.dob ? format(new Date(client.dob), "MMMM d, yyyy") : "Not set" },
              { label: "Birth Time", value: client.birthTime || "Not set" },
              { label: "Birth Place", value: client.birthPlace || "Not set" },
              { label: "Gender", value: client.gender || "Not set" },
              { label: "Zodiac Sign", value: client.zodiacSign || "Not set" },
              { label: "Preference", value: client.consultationPreference || "Not set" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-[var(--border-color)] last:border-0">
                <span className="text-[var(--muted-fg)]">{item.label}</span>
                <span className="font-medium text-[var(--foreground)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Appointment History</h3>
          {client.appointments.length === 0 ? (
            <p className="text-sm text-[var(--muted-fg)]">No appointments yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {client.appointments.map((appt) => {
                const statusColors: Record<string, string> = {
                  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                  CONFIRMED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
                  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                  NO_SHOW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                };
                return (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
                    <Calendar className="w-4 h-4 text-[var(--muted-fg)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)]">{appt.type}</p>
                      <p className="text-xs text-[var(--muted-fg)]">{format(new Date(appt.dateTime), "MMM d, yyyy · h:mm a")}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[appt.status] || ""}`}>
                      {appt.status}
                    </span>
                    <span className="text-sm font-medium text-green-600">₹{appt.fee}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Follow-Ups */}
      {client.followUps.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Follow-Ups</h3>
          <div className="space-y-2">
            {client.followUps.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
                <div className={`w-3 h-3 rounded-full shrink-0 ${f.isCompleted ? "bg-green-500" : "bg-amber-500"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{f.description}</p>
                  <p className="text-xs text-[var(--muted-fg)]">Due: {format(new Date(f.dueDate), "MMM d, yyyy")}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.isCompleted ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {f.isCompleted ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {client.notes && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-3">Notes</h3>
          <p className="text-sm text-[var(--muted-fg)] whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}
    </div>
  );
}
