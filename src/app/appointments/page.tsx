import { appointments, clients } from "@/lib/data";
import { Calendar as CalendarIcon, Clock, Plus, Video, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function AppointmentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Appointments</h1>
          <p className="text-slate-500">Manage your upcoming readings and consultations.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors rounded-lg px-4 py-2 font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Schedule Session
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Widget placeholder */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">June 2026</h3>
              <div className="flex gap-2 text-slate-600">
                <button className="p-1 hover:bg-slate-100 rounded">&lt;</button>
                <button className="p-1 hover:bg-slate-100 rounded">&gt;</button>
              </div>
            </div>
            {/* Simple mock calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-sm text-slate-500 mb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({length: 30}).map((_, i) => (
                <div key={i} className={`p-2 rounded-lg flex items-center justify-center cursor-pointer ${
                  i === 11 ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-100 text-slate-700'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 shadow-sm rounded-xl p-6">
            <h3 className="font-bold text-amber-800 mb-2">Auspicious Timing</h3>
            <p className="text-sm text-amber-900/80">
              Rahu Kaal today is between 13:30 to 15:00. Avoid scheduling new chart readings during this window.
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
              <button className="text-indigo-700 font-medium border-b-2 border-indigo-600 pb-1">Upcoming</button>
              <button className="text-slate-500 font-medium pb-1 hover:text-slate-700 transition-colors">Completed</button>
              <button className="text-slate-500 font-medium pb-1 hover:text-slate-700 transition-colors">Cancelled</button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => {
                const client = clients.find(c => c.id === apt.clientId);
                return (
                  <div key={apt.id} className="p-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center border border-indigo-200 shrink-0">
                          <span className="text-xs font-medium uppercase">{format(new Date(apt.date), "MMM")}</span>
                          <span className="font-bold text-lg leading-none">{format(new Date(apt.date), "d")}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{apt.type}</h4>
                          <div className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                            <span>with</span>
                            <span className="text-slate-900 font-medium">{client?.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(apt.date), "h:mm a")}</span>
                            <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Google Meet</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm">
                          Join Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
