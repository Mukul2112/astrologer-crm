"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Phone, Mail, Star } from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  zodiacSign: string | null;
  consultationPreference: string | null;
  avatar: string | null;
  createdAt: string;
  _count?: { appointments: number };
}

const ZODIAC_SIGNS = ["All", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const fetchClients = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter !== "All") params.set("zodiacSign", filter);
    fetch(`/api/clients?${params}`)
      .then((r) => r.json())
      .then((data) => { setClients(data.clients || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        zodiacSign: form.get("zodiacSign"),
        birthPlace: form.get("birthPlace"),
        consultationPreference: form.get("preference"),
      }),
    });
    setShowAdd(false);
    fetchClients();
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Clients</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Manage your astrological consultations and client data.</p>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            New Client
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-fg)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] placeholder:text-[var(--muted-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ZODIAC_SIGNS.slice(0, 6).map((z) => (
            <button
              key={z}
              onClick={() => setFilter(z)}
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === z
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Client Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20">
          <Star className="w-12 h-12 mx-auto text-[var(--muted-fg)] mb-3 opacity-40" />
          <p className="font-medium text-[var(--foreground)]">No clients found</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Add your first client to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-2xl p-5 hover:shadow-lg transition-all animate-slide-up group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                {client.avatar ? (
                  <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(client.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--foreground)] truncate group-hover:text-indigo-600 transition-colors">{client.name}</p>
                  {client.zodiacSign && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {client.zodiacSign}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {client.phone && (
                  <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {client.phone}
                  </p>
                )}
                {client.email && (
                  <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {client.email}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Add New Client</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input name="name" required placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              <input name="phone" placeholder="Phone" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              <input name="email" type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              <input name="birthPlace" placeholder="Birth Place" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              <select name="zodiacSign" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                <option value="">Select Zodiac Sign</option>
                {ZODIAC_SIGNS.filter(z => z !== "All").map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <select name="preference" className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                <option value="">Consultation Preference</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone">Phone</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--foreground)] font-medium hover:bg-[var(--surface-hover)] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
