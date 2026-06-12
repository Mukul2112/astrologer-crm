"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ActionModalProps {
  buttonText: React.ReactNode;
  buttonClass: string;
  title: string;
  children: React.ReactNode;
  action?: (formData: FormData) => Promise<void>;
}

export default function ActionModal({ buttonText, buttonClass, title, children, action }: ActionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClass}>
        {buttonText}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-slate-200 animate-in fade-in zoom-in-95 p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
            <form action={async (formData) => {
              if (action) {
                await action(formData);
              }
              setIsOpen(false);
            }}>
              <div className="space-y-4">
                {children}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
