"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, BarChart3, Award } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/revenue")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-10 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="skeleton h-80 rounded-xl" />
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `₹${(data.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "This Month", value: `₹${(data.thisMonth || 0).toLocaleString()}`, icon: TrendingUp, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" },
    { label: "Avg per Session", value: `₹${(data.avgPerSession || 0).toLocaleString()}`, icon: BarChart3, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
    { label: "Top Service", value: data.topService || "N/A", icon: Award, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Revenue</h1>
        <p className="text-[var(--muted-fg)] mt-1">Track your earnings and financial performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-[var(--muted-fg)] font-medium">{s.label}</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthly || []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--muted-fg)" fontSize={12} />
              <YAxis stroke="var(--muted-fg)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4">By Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.services || []} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} label>
                {(data.services || []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
