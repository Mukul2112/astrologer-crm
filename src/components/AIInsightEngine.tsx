"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  UserCheck,
  Activity,
} from "lucide-react";

interface InsightCard {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  title: string;
  subtitle: string;
  value: string;
  detail: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function AIInsightEngine() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      setInsights([
        {
          id: "risk",
          icon: ShieldAlert,
          iconColor: "text-rose-500",
          gradientFrom: "from-rose-500/20",
          gradientTo: "to-orange-500/10",
          title: "Client at Risk",
          subtitle: "Longest gap since last session",
          value: "Kavya Singh",
          detail: "Last visit 87 days ago — may need a check-in call",
        },
        {
          id: "followup",
          icon: UserCheck,
          iconColor: "text-blue-500",
          gradientFrom: "from-blue-500/20",
          gradientTo: "to-cyan-500/10",
          title: "Recommended Follow-Up",
          subtitle: "Based on consultation patterns",
          value: "Rohan Gupta",
          detail: "Saturn transit ends next week — ideal time for a progress review",
        },
        {
          id: "trending",
          icon: TrendingUp,
          iconColor: "text-emerald-500",
          gradientFrom: "from-emerald-500/20",
          gradientTo: "to-teal-500/10",
          title: "Trending Service",
          subtitle: "Most booked this month",
          value: "Career Consultation",
          detail: "42% of bookings — consider creating a premium career package",
        },
        {
          id: "retention",
          icon: Activity,
          iconColor: "text-violet-500",
          gradientFrom: "from-violet-500/20",
          gradientTo: "to-purple-500/10",
          title: "Retention Score",
          subtitle: "Client return probability",
          value: "87%",
          detail: "Above industry average of 72% — your personalized remedies are working",
        },
      ]);
      setLoaded(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-500 animate-pulse-soft" />
          <span className="text-sm font-medium text-[var(--muted-fg)]">
            AI Insights analyzing patterns...
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-[var(--foreground)]">AI Insight Engine</h3>
        <span className="text-[10px] font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          BETA
        </span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            variants={item}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-xl p-4 relative overflow-hidden group hover:card-shadow-lg transition-all duration-300"
          >
            {/* Gradient border effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${insight.gradientFrom} ${insight.gradientTo} opacity-40 group-hover:opacity-60 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-white/60 dark:bg-white/10 ${insight.iconColor}`}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {insight.title}
                    </h4>
                    <p className="text-[10px] text-[var(--muted-fg)]">
                      {insight.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                {insight.id === "retention" ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold gradient-text">
                      {insight.value}
                    </span>
                    {/* Mini gauge */}
                    <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "87%" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {insight.value}
                  </p>
                )}
              </div>

              <p className="text-xs text-[var(--muted-fg)] leading-relaxed">
                {insight.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
