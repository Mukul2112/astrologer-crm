"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import LeadCard, { type LeadData } from "./LeadCard";

export interface ColumnConfig {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface KanbanColumnProps {
  column: ColumnConfig;
  leads: LeadData[];
}

export default function KanbanColumn({ column, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div
      className={`flex flex-col min-w-[280px] max-w-[320px] rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] card-shadow transition-all duration-200 ${
        isOver ? "ring-2 ring-indigo-400 scale-[1.01]" : ""
      }`}
    >
      {/* Colored header bar */}
      <div
        className={`${column.bgColor} rounded-t-xl px-4 py-3 border-b ${column.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-sm ${column.color}`}>
            {column.title}
          </h3>
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${column.color} bg-white/60`}
          >
            {leads.length}
          </span>
        </div>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 min-h-[200px] overflow-y-auto scrollbar-thin max-h-[calc(100vh-280px)]"
      >
        <SortableContext
          items={leads.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-[var(--muted-fg)] border-2 border-dashed border-[var(--border-color)] rounded-lg">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}
