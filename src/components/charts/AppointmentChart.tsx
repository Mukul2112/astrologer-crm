"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AppointmentChartProps {
  data: { month: string; appointments: number }[];
}

export default function AppointmentChart({ data }: AppointmentChartProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
        Appointment Trends
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="var(--muted-fg)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-fg)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px var(--shadow-color)",
                color: "var(--foreground)",
              }}
              formatter={(value: number) => [value, "Appointments"]}
              labelStyle={{ color: "var(--muted-fg)" }}
            />
            <Bar
              dataKey="appointments"
              fill="#818cf8"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
