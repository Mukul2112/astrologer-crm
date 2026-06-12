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

  useEffect(() => {
    const stored = localStorage.getItem("astrocrm-dark");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

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
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-50 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-[var(--foreground)] whitespace-nowrap animate-fade-in">
              AstroCRM
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--muted-fg)] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
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
              {!collapsed && (
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
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors duration-200 text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]",
            collapsed && "justify-center"
          )}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 shrink-0 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200",
            collapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0 border border-indigo-200 dark:border-indigo-800">
            PJ
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-fade-in">
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
  );
}
