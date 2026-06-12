"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  rowKey?: keyof T & string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  page = 1,
  pageSize = 10,
  totalCount,
  onPageChange,
  onSort,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display.",
  emptyAction,
  className,
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const total = totalCount ?? data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  const displayData = useMemo(() => {
    if (onSort || onPageChange) return data;

    let sorted = [...data];
    if (sortKey) {
      sorted.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    if (!onPageChange) {
      const start = (page - 1) * pageSize;
      sorted = sorted.slice(start, start + pageSize);
    }

    return sorted;
  }, [data, sortKey, sortDir, page, pageSize, onSort, onPageChange]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortKey !== column) {
      return <ArrowUpDown size={14} className="text-[var(--muted-fg)] opacity-40" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp size={14} className="text-indigo-500" />
    ) : (
      <ArrowDown size={14} className="text-indigo-500" />
    );
  };

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-6">
            <Skeleton variant="table" lines={pageSize > 5 ? 5 : pageSize} />
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-fg)]",
                      col.sortable && "cursor-pointer select-none hover:text-[var(--foreground)] transition-colors",
                      col.className
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && <SortIcon column={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {displayData.map((row, i) => {
                const key = rowKey ? String(row[rowKey]) : i;
                return (
                  <tr
                    key={key}
                    className={cn(
                      "transition-colors hover:bg-[var(--surface-hover)]",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-5 py-4 text-sm text-[var(--foreground)] whitespace-nowrap",
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : (String(row[col.key] ?? "—"))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--border-color)]">
            <p className="text-sm text-[var(--muted-fg)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {(page - 1) * pageSize + 1}
              </span>
              {" "}to{" "}
              <span className="font-medium text-[var(--foreground)]">
                {Math.min(page * pageSize, total)}
              </span>
              {" "}of{" "}
              <span className="font-medium text-[var(--foreground)]">
                {total}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange?.(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] ?? 0) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1 text-[var(--muted-fg)]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange?.(p as number)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                        p === page
                          ? "gradient-primary text-white"
                          : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
