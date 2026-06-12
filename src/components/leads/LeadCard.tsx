"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";

export interface LeadData {
  id: string;
  stage: string;
  source: string;
  lastContactDate: string | null;
  notes: string | null;
  client: {
    id: string;
    name: string;
    phone: string | null;
  };
  assignedAstrologer: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

const sourceColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-200",
  Referral: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Social Media": "bg-purple-50 text-purple-700 border-purple-200",
  Phone: "bg-amber-50 text-amber-700 border-amber-200",
  "Walk-in": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function LeadCard({ lead }: { lead: LeadData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { type: "lead", lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass rounded-xl p-4 cursor-grab active:cursor-grabbing card-shadow hover:card-shadow-lg transition-all duration-200 group ${
        isDragging ? "ring-2 ring-indigo-400 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="text-[var(--muted-fg)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-[var(--foreground)] truncate text-sm">
            {lead.client.name}
          </h4>
        </div>
        {lead.assignedAstrologer && (
          <div className="shrink-0">
            {lead.assignedAstrologer.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lead.assignedAstrologer.avatar}
                alt={lead.assignedAstrologer.name}
                className="w-7 h-7 rounded-full border border-[var(--border-color)]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-indigo-200">
                {lead.assignedAstrologer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
        )}
      </div>

      {lead.client.phone && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-fg)] mb-2">
          <Phone className="w-3 h-3" />
          <span>{lead.client.phone}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        {lead.source && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              sourceColors[lead.source] || "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {lead.source}
          </span>
        )}
        {lead.lastContactDate && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--muted-fg)]">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(lead.lastContactDate), "MMM d")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
