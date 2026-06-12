"use client";

import { AlertTriangle, TrendingUp, UserCheck } from "lucide-react";

interface AIInsight {
  title: string;
  description: string;
  type: "warning" | "suggestion" | "trending";
  actionLabel: string;
}

const insights: AIInsight[] = [
  {
    title: "Churn Risk Detected",
    description:
      "Kavya Singh hasn't booked a session in 45 days. Based on patterns, there's a 73% chance of churn. Consider reaching out with a personalized follow-up.",
    type: "warning",
    actionLabel: "Send Follow-Up",
  },
  {
    title: "Recommended Follow-Up",
    description:
      "Aarav Sharma's Jupiter return analysis was completed 2 weeks ago. The ideal window for a follow-up Career Consultation is approaching.",
    type: "suggestion",
    actionLabel: "Schedule Session",
  },
  {
    title: "Trending Service",
    description:
      "Relationship Compatibility readings have increased 40% this month. Mercury retrograde starts next week — expect a surge in communication-related queries.",
    type: "trending",
    actionLabel: "View Analytics",
  },
];

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-500",
    border: "border-rose-200 dark:border-rose-800/50",
    badge: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
  },
  suggestion: {
    icon: UserCheck,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    border: "border-blue-200 dark:border-blue-800/50",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
  trending: {
    icon: TrendingUp,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800/50",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  },
};

export default function AIInsightWidget() {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]">
          AI Insight Engine
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
          Beta
        </span>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${config.bg} ${config.border} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--muted-fg)] leading-relaxed mb-2">
                    {insight.description}
                  </p>
                  <button
                    className={`text-xs font-semibold px-3 py-1 rounded-lg ${config.badge} hover:opacity-80 transition-opacity`}
                  >
                    {insight.actionLabel}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
