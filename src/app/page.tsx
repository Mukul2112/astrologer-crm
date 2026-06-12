import { Users, Calendar as CalendarIcon, TrendingUp, Moon } from "lucide-react";
import { clients, appointments } from "@/lib/data";
import { format } from "date-fns";

export default function Dashboard() {
  const upcomingAppointments = appointments.filter(a => a.status === "Upcoming");
  const totalRevenue = appointments.filter(a => a.status === "Completed").reduce((sum, a) => sum + a.amount, 0);

  const stats = [
    { title: "Total Clients", value: clients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Upcoming Sessions", value: upcomingAppointments.length, icon: CalendarIcon, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Monthly Revenue", value: `₹${totalRevenue}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Active Transits", value: "3", icon: Moon, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-slate-900">Welcome Back, <span className="text-indigo-600">Pandit Ji</span></h1>
        <p className="text-slate-500">Here's what's happening with your clients today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 flex items-start justify-between border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Sessions</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-100">
              {upcomingAppointments.map((apt) => {
                const client = clients.find(c => c.id === apt.clientId);
                return (
                  <div key={apt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={client?.avatar} alt={client?.name} className="w-12 h-12 rounded-full border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900">{client?.name}</h4>
                        <p className="text-sm text-slate-500">{apt.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-900">{format(new Date(apt.date), "MMM d, h:mm a")}</div>
                      <div className="text-sm text-slate-500">{client?.zodiac}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & Insight */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Add New Client
            </button>
            <button className="w-full py-2 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors flex items-center justify-center gap-2 border border-slate-200">
              <CalendarIcon className="w-5 h-5" />
              Schedule Session
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 shadow-sm rounded-xl p-6 relative overflow-hidden">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              <Moon className="w-5 h-5 text-amber-600" /> Astrological Insight
            </h3>
            <p className="text-sm text-amber-900/80 leading-relaxed relative z-10">
              Mercury enters retrograde next week. Expect clients asking about communication issues and returning exes. Good time to promote relationship readings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
