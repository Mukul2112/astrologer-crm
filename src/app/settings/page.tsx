"use client";

import { useState } from "react";
import { User, Shield, Bell, Info, Moon, Sun, Save } from "lucide-react";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="text-[var(--muted-fg)] mt-1">Manage your account and preferences.</p>
      </div>

      <div className="flex gap-2 border-b border-[var(--border-color)] pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              tab === t.id
                ? "text-indigo-600 border-indigo-600"
                : "text-[var(--muted-fg)] border-transparent hover:text-[var(--foreground)]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 max-w-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-[var(--foreground)]">Profile Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">PJ</div>
            <button className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors">Change Avatar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Full Name</label>
              <input defaultValue="Pandit Ji" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Email</label>
              <input defaultValue="pandit@astrocrm.com" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Phone</label>
              <input defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Timezone</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                <option>Asia/Kolkata (IST)</option>
                <option>US/Eastern (EST)</option>
                <option>US/Pacific (PST)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="font-medium text-sm text-[var(--foreground)]">Dark Mode</p>
                <p className="text-xs text-[var(--muted-fg)]">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                document.documentElement.classList.toggle("dark");
              }}
              className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? "bg-indigo-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-medium">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 max-w-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-[var(--foreground)]">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Current Password</label>
              <input type="password" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">New Password</label>
              <input type="password" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Confirm New Password</label>
              <input type="password" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-medium">
              <Shield className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 max-w-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-[var(--foreground)]">Notification Preferences</h3>
          {["New Lead Assigned", "Appointment Reminders", "Follow-Up Reminders", "Client Updates", "System Alerts"].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
              <p className="text-sm font-medium text-[var(--foreground)]">{item}</p>
              <button className="w-12 h-7 rounded-full bg-indigo-500 relative">
                <div className="w-5 h-5 rounded-full bg-white absolute top-1 translate-x-6" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "about" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-6 max-w-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-[var(--foreground)]">About AstroCRM</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 rounded-xl bg-[var(--surface)]">
              <span className="text-[var(--muted-fg)]">Version</span>
              <span className="font-medium text-[var(--foreground)]">1.0.0</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[var(--surface)]">
              <span className="text-[var(--muted-fg)]">Framework</span>
              <span className="font-medium text-[var(--foreground)]">Next.js 16</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[var(--surface)]">
              <span className="text-[var(--muted-fg)]">Database</span>
              <span className="font-medium text-[var(--foreground)]">SQLite (Prisma)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
