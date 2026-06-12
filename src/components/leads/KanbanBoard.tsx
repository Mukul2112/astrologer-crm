"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import KanbanColumn, { type ColumnConfig } from "./KanbanColumn";
import LeadCard, { type LeadData } from "./LeadCard";
import toast from "react-hot-toast";

const COLUMNS: ColumnConfig[] = [
  {
    id: "NEW_LEAD",
    title: "New Lead",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "CONTACTED",
    title: "Contacted",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "INTERESTED",
    title: "Interested",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "CONSULTATION_BOOKED",
    title: "Consultation Booked",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  {
    id: "CONSULTATION_COMPLETED",
    title: "Consultation Completed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    id: "LOST_LEAD",
    title: "Lost Lead",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
];

interface KanbanBoardProps {
  initialLeads: LeadData[];
}

export default function KanbanBoard({ initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState<LeadData[]>(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const getColumnLeads = useCallback(
    (columnId: string) => leads.filter((l) => l.stage === columnId),
    [leads]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData) return;

    // Determine target column
    let targetColumn: string | null = null;
    if (overData?.type === "column") {
      targetColumn = overData.columnId;
    } else if (overData?.type === "lead") {
      targetColumn = overData.lead.stage;
    }

    if (!targetColumn) return;

    const activeLead = leads.find((l) => l.id === active.id);
    if (activeLead && activeLead.stage !== targetColumn) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === active.id ? { ...l, stage: targetColumn! } : l
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active } = event;
    setActiveId(null);

    const lead = leads.find((l) => l.id === active.id);
    if (!lead) return;

    // Find the original lead to check if stage changed
    const originalLead = initialLeads.find((l) => l.id === active.id);
    if (originalLead && originalLead.stage !== lead.stage) {
      try {
        const res = await fetch(`/api/leads/${lead.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: lead.stage }),
        });

        if (!res.ok) throw new Error("Failed to update lead stage");

        const columnTitle =
          COLUMNS.find((c) => c.id === lead.stage)?.title || lead.stage;
        toast.success(`Moved to "${columnTitle}"`);
      } catch {
        // Revert on error
        setLeads((prev) =>
          prev.map((l) =>
            l.id === active.id ? { ...l, stage: originalLead.stage } : l
          )
        );
        toast.error("Failed to update lead stage");
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            leads={getColumnLeads(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="rotate-2 scale-105">
            <LeadCard lead={activeLead} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
