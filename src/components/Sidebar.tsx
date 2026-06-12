"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Settings, Sparkles } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-white border-r border-slate-200 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <Sparkles className="w-8 h-8 text-amber-500" />
        <span className="text-2xl font-bold text-slate-900">AstroCRM</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 font-semibold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
            SJ
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Pandit Ji</p>
            <p className="text-xs text-slate-500 font-medium">Head Astrologer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
