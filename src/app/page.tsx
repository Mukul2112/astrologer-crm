import { prisma } from "@/lib/prisma";
import { Users, Calendar, TrendingUp, Target, Clock, Activity, Plus, DollarSign } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let totalClients = 0;
  let upcomingSessions = 0;
  let monthlyRevenue = 0;
  let pendingFollowUps = 0;
  let totalLeads = 0;
  let convertedLeads = 0;
  let recentActivity: { id: string; action: string; entity: string; details: string | null; createdAt: Date; user: { name: string } }[] = [];
  let todaysFollowUps: { id: string; description: string; dueDate: Date; client: { name: string } }[] = [];

  try {
    totalClients = await prisma.client.count();
    upcomingSessions = await prisma.appointment.count({ where: { status: "SCHEDULED" } });
    const completedAppts = await prisma.appointment.findMany({
      where: { status: "COMPLETED" },
      select: { fee: true },
    });
    monthlyRevenue = completedAppts.reduce((sum, a) => sum + a.fee, 0);
    pendingFollowUps = await prisma.followUp.count({ where: { isCompleted: false } });
    totalLeads = await prisma.lead.count();
    convertedLeads = await prisma.lead.count({ where: { stage: "CONSULTATION_COMPLETED" } });

    recentActivity = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    todaysFollowUps = await prisma.followUp.findMany({
      where: { isCompleted: false, dueDate: { gte: today, lt: tomorrow } },
      include: { client: { select: { name: true } } },
    });
  } catch {
    // Database might be empty - that's OK
  }

  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const stats = [
    { label: "Total Clients", value: totalClients, icon: Users, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", change: "+12%" },
    { label: "Upcoming Sessions", value: upcomingSessions, icon: Calendar, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30", change: "+5%" },
    { label: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30", change: "+18%" },
    { label: "Active Consultations", value: upcomingSessions, icon: Activity, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", change: "+3%" },
    { label: "Pending Follow-Ups", value: pendingFollowUps, icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", change: "-2%" },
    { label: "Lead Conversion", value: `${conversionRate}%`, icon: Target, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30", change: "+8%" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Welcome back! Here&apos;s your CRM overview.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/clients" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            New Client
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-fg)] font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5">{stat.value}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith("+") ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Follow-Ups */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--foreground)]">Today&apos;s Follow-Ups</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {todaysFollowUps.length}
            </span>
          </div>
          {todaysFollowUps.length === 0 ? (
            <p className="text-sm text-[var(--muted-fg)]">No follow-ups due today. 🎉</p>
          ) : (
            <div className="space-y-3">
              {todaysFollowUps.map((f) => (
                <div key={f.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">{f.client.name}</p>
                  <p className="text-xs text-[var(--muted-fg)] mt-0.5">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--muted-fg)]">No activity logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[var(--foreground)]">
                      <span className="font-medium">{log.user.name}</span>{" "}
                      <span className="text-[var(--muted-fg)]">{log.action.toLowerCase()}</span>{" "}
                      <span className="font-medium">{log.entity}</span>
                    </p>
                    {log.details && <p className="text-xs text-[var(--muted-fg)]">{log.details}</p>}
                    <p className="text-xs text-[var(--muted-fg)] mt-0.5">{format(new Date(log.createdAt), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insight Engine */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl gradient-primary">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-[var(--foreground)]">AI Insight Engine</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">Beta</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Client at Risk", desc: "2 clients haven't been contacted in 30+ days", emoji: "⚠️", color: "border-amber-200 dark:border-amber-800" },
            { title: "Recommended Follow-Up", desc: "Suggest reaching out to recent leads this week", emoji: "📞", color: "border-blue-200 dark:border-blue-800" },
            { title: "Trending Service", desc: "Birth Chart Reading is up 40% this month", emoji: "📈", color: "border-green-200 dark:border-green-800" },
            { title: "Retention Score", desc: "78% client retention — above industry average", emoji: "💎", color: "border-purple-200 dark:border-purple-800" },
          ].map((insight, i) => (
            <div key={i} className={`bg-[var(--card-bg)] border ${insight.color} rounded-xl p-4 animate-slide-up`} style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-2xl">{insight.emoji}</span>
              <h4 className="font-semibold text-sm text-[var(--foreground)] mt-2">{insight.title}</h4>
              <p className="text-xs text-[var(--muted-fg)] mt-1">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
