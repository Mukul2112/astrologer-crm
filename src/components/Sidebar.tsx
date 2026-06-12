"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  Calendar,
  CalendarDays,
  DollarSign,
  FileText,
  Bell,
  Settings,
  Sparkles,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Leads", href: "/leads", icon: Target },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("astrocrm-dark");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("astrocrm-dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("astrocrm-dark", "false");
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--card-bg)] border-b border-[var(--border-color)] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-[var(--foreground)]">AstroCRM</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[var(--muted-fg)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] h-[100dvh] flex flex-col z-50",
          "fixed inset-y-0 left-0 transition-all duration-300 ease-in-out",
          "md:sticky md:top-0 md:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none",
          collapsed ? "md:w-[72px]" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 shrink-0 justify-between">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "md:hidden")}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">
              AstroCRM
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--muted-fg)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 hidden md:block"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] font-medium"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-[var(--muted-fg)] group-hover:text-[var(--foreground)]"
                  )}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="whitespace-nowrap text-sm">{item.name}</span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 space-y-3 shrink-0 border-t border-[var(--border-color)] pt-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors duration-200 text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
              collapsed && "md:justify-center"
            )}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 shrink-0 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {(!collapsed || mobileOpen) && (
              <span className="text-sm font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200",
              collapsed && "md:justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold shrink-0">
              N
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--foreground)] truncate">
                  Pandit Ji
                </p>
                <p className="text-xs text-[var(--muted-fg)] truncate">
                  Head Astrologer
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
