"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ConsultationPieChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function ConsultationPieChart({ data }: ConsultationPieChartProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
        Consultation Breakdown
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px var(--shadow-color)",
                color: "var(--foreground)",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [value, "Sessions"]}
              labelStyle={{ color: "var(--muted-fg)" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
