import { getClient, getClientAppointments, getClientNotes } from "@/lib/data";
import { MapPin, Clock, Calendar, Mail, Phone, ArrowLeft, Star, Edit3 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClient(id);

  if (!client) {
    notFound();
  }

  const clientAppointments = getClientAppointments(id);
  const clientNotes = getClientNotes(id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-500" />
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Client Profile</h1>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors rounded-lg px-4 py-2 font-medium flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Edit Profile
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-50 blur-3xl rounded-full"></div>
            
            <img 
              src={client.avatar} 
              alt={client.name} 
              className="w-24 h-24 rounded-full border-2 border-slate-200 mx-auto mb-4 object-cover relative z-10"
            />
            <h2 className="text-2xl font-bold text-slate-900 relative z-10">{client.name}</h2>
            <div className="text-indigo-600 font-medium mb-4 relative z-10 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              {client.zodiac}
            </div>

            <div className="space-y-3 text-left border-t border-slate-200 pt-4 relative z-10">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{client.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Birth Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Date of Birth</div>
                  <div className="text-sm font-medium text-slate-900">{client.dob}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Time of Birth</div>
                  <div className="text-sm font-medium text-slate-900">{client.tob}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Place of Birth</div>
                  <div className="text-sm font-medium text-slate-900">{client.pob}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations & Notes */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Notes Section */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Consultation Notes</h3>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Add Note</button>
            </div>
            
            {clientNotes.length > 0 ? (
              <div className="space-y-4">
                {clientNotes.map((note) => (
                  <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-2">
                      {format(new Date(note.date), "MMMM d, yyyy")}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No consultation notes found for this client.
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Appointment History</h3>
            
            {clientAppointments.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {clientAppointments.map((apt) => (
                  <div key={apt.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">{apt.type}</h4>
                      <div className="text-sm text-slate-500">{format(new Date(apt.date), "MMMM d, yyyy 'at' h:mm a")}</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        apt.status === 'Upcoming' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No appointment history found.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
