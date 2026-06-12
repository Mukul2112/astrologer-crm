"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Download, Eye, Grid, List, Search } from "lucide-react";
import { format } from "date-fns";

interface Doc {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  client: { name: string };
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => { setDocs(data.documents || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Documents</h1>
          <p className="text-[var(--muted-fg)] mt-1 text-sm sm:text-base">Manage Kundli files and client documents.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => setViewMode("grid")} className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors flex justify-center ${viewMode === "grid" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode("list")} className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors flex justify-center ${viewMode === "list" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "text-[var(--muted-fg)] hover:bg-[var(--surface-hover)]"}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
        <Upload className="w-10 h-10 mx-auto text-[var(--muted-fg)] mb-3" />
        <p className="font-medium text-[var(--foreground)]">Drag and drop files here</p>
        <p className="text-sm text-[var(--muted-fg)] mt-1">PDF, JPG, PNG up to 10MB</p>
        <button className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-all">Browse Files</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-[var(--muted-fg)] mb-3 opacity-50" />
          <p className="font-medium text-[var(--foreground)]">No documents yet</p>
          <p className="text-sm text-[var(--muted-fg)] mt-1">Upload your first Kundli file to get started.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {docs.map((doc) => (
            <div key={doc.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-xl p-4 flex items-center gap-4 animate-slide-up">
              <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--foreground)] truncate">{doc.fileName}</p>
                <p className="text-xs text-[var(--muted-fg)]">{doc.client.name} · {formatSize(doc.fileSize)}</p>
                <p className="text-xs text-[var(--muted-fg)]">{format(new Date(doc.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted-fg)]"><Eye className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted-fg)]"><Download className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
