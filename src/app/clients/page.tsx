import { clients } from "@/lib/data";
import { Search, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Clients Directory</h1>
          <p className="text-slate-500">Manage your astrological clients and their details.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors rounded-lg px-4 py-2 font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </header>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, zodiac, or email..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-xl py-2 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
            <option value="all">All Zodiacs</option>
            <option value="aries">Aries</option>
            <option value="taurus">Taurus</option>
            {/* Add others as needed */}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-sm uppercase text-slate-500 tracking-wider">
              <th className="p-4 font-medium">Client Name</th>
              <th className="p-4 font-medium">Zodiac Sign</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full border border-slate-200" />
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        <Link href={`/clients/${client.id}`}>{client.name}</Link>
                      </div>
                      <div className="text-xs text-slate-500">DOB: {client.dob}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {client.zodiac}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-700">{client.email}</div>
                  <div className="text-xs text-slate-500">{client.phone}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    client.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/clients/${client.id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
                      View Details
                    </Link>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
