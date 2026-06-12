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
  const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string; phone?: string; email?: string }[]>([]);
  const [newDoc, setNewDoc] = useState({
    clientId: "",
    fileName: "",
  });

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => { setDocs(data.documents || []); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/api/clients?limit=100")
      .then((r) => r.json())
      .then((data) => setClients(data.clients || []));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newDoc,
        fileName: newDoc.fileName || "Uploaded Document",
        fileType: "application/pdf",
        fileSize: Math.floor(Math.random() * 5000000) + 102400, // random size between 100KB and 5MB
      };

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <div 
        onClick={() => setShowAdd(true)}
        className="cursor-pointer border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors"
      >
        <Upload className="w-10 h-10 mx-auto text-[var(--muted-fg)] mb-3" />
        <p className="font-medium text-[var(--foreground)]">Drag and drop files here</p>
        <p className="text-sm text-[var(--muted-fg)] mt-1">PDF, JPG, PNG up to 10MB</p>
        <button 
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-all"
        >
          Browse Files
        </button>
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

      {/* Upload Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[var(--card-bg)] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">Select Client</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)]"
                  value={newDoc.clientId}
                  onChange={e => setNewDoc({...newDoc, clientId: e.target.value})}
                >
                  <option value="">-- Choose a Client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || c.email})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--muted-fg)] mb-1">File Name / Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Birth Chart PDF"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)]"
                  value={newDoc.fileName}
                  onChange={e => setNewDoc({...newDoc, fileName: e.target.value})}
                />
              </div>

              <div className="p-4 border-2 border-dashed border-[var(--border-color)] rounded-xl text-center bg-[var(--muted)]">
                <p className="text-sm text-[var(--foreground)] font-medium">For this demo: File upload is simulated.</p>
                <p className="text-xs text-[var(--muted-fg)] mt-1">A dummy file record will be created.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-all font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-medium"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
