"use client";

import { useState, useEffect } from "react";
import { Target, Plus, Phone, User, Calendar } from "lucide-react";
import { format } from "date-fns";

const STAGES = [
  { id: "NEW_LEAD", label: "New Lead", color: "bg-blue-500" },
  { id: "CONTACTED", label: "Contacted", color: "bg-yellow-500" },
  { id: "INTERESTED", label: "Interested", color: "bg-purple-500" },
  { id: "CONSULTATION_BOOKED", label: "Booked", color: "bg-indigo-500" },
  { id: "CONSULTATION_COMPLETED", label: "Completed", color: "bg-green-500" },
  { id: "LOST_LEAD", label: "Lost", color: "bg-red-500" },
];

interface Lead {
  id: string;
  stage: string;
  source: string | null;
  lastContactDate: string | null;
  client: { name: string; phone: string | null };
  assignedAstrologer: { name: string } | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (!draggedId) return;
    setLeads((prev) => prev.map((l) => (l.id === draggedId ? { ...l, stage } : l)));
    await fetch(`/api/leads/${draggedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-10 w-36" />
        </div>
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Lead Pipeline</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Track and manage your leads through the conversion funnel.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          return (
            <div
              key={stage.id}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragOver={handleDragOver}
              className="min-w-[220px] bg-[var(--muted)] rounded-xl p-3 min-h-[400px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-sm text-[var(--foreground)]">{stage.label}</h3>
                <span className="ml-auto text-xs font-bold bg-[var(--card-bg)] text-[var(--muted-fg)] px-2 py-0.5 rounded-full">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-xl p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all animate-scale-in"
                  >
                    <p className="font-semibold text-sm text-[var(--foreground)]">{lead.client.name}</p>
                    {lead.client.phone && (
                      <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" /> {lead.client.phone}
                      </p>
                    )}
                    {lead.source && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        {lead.source}
                      </span>
                    )}
                    {lead.lastContactDate && (
                      <p className="text-xs text-[var(--muted-fg)] mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(lead.lastContactDate), "MMM d")}
                      </p>
                    )}
                    {lead.assignedAstrologer && (
                      <p className="text-xs text-[var(--muted-fg)] mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> {lead.assignedAstrologer.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
