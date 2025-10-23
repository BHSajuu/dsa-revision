"use client";

import { useState } from "react";

export default function NotesDialog({ isOpen, onClose, initialNotes, onSave }) {
  const [notes, setNotes] = useState(initialNotes || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[80%] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 animate-slideUp">
        <h2 className="text-2xl font-bold text-white mb-4">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={10}
          className="w-full max-w-2xl h-[60%] resize-y overflow-auto px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your notes here..."
        />
        <div className="flex justify-end gap-4 mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}