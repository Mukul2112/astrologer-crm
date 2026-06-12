"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: NotificationItem[] = [
      {
        id: "n1",
        title: "New Lead Assigned",
        message: "Aarav Sharma has been assigned to you as a new lead.",
        type: "lead",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "n2",
        title: "Appointment Reminder",
        message: "You have a Birth Chart Reading with Meera Patel tomorrow at 10:00 AM.",
        type: "appointment",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "n3",
        title: "Payment Received",
        message: "₹2,500 received from Rohan Gupta for Relationship Compatibility session.",
        type: "payment",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "n4",
        title: "Follow-up Due",
        message: "Follow-up with Kavya Singh is overdue by 2 days.",
        type: "followup",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "n5",
        title: "New Review",
        message: "Aarav Sharma left a 5-star review for your Career Consultation.",
        type: "review",
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(mockNotifications);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const typeIcons: Record<string, string> = {
    lead: "🎯",
    appointment: "📅",
    payment: "💰",
    followup: "🔔",
    review: "⭐",
  };

  const recent5 = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[var(--muted-fg)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl card-shadow-lg overflow-hidden z-50 animate-slide-down">
          <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--foreground)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                  setUnreadCount(0);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto scrollbar-thin divide-y divide-[var(--border-color)]">
            {recent5.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full text-left px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors ${
                  !notification.isRead ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                }`}
              >
                <div className="flex gap-3">
                  <span className="text-lg shrink-0">
                    {typeIcons[notification.type] || "📌"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-fg)] line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-[var(--muted-fg)] mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-[var(--border-color)]">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
