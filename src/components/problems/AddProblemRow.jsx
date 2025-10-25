"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProblemRow({ onSave, onCancel, nextIndex }) {
  const [formData, setFormData] = useState({
    problemName: "",
    leetcodeLink: "",
    youtubeLink: "",
    notes: "",
    lastSolvedDate: "",
    nextReviewDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.problemName.trim() || !formData.leetcodeLink.trim()) {
      toast.error("Problem Name and Link are required.");
      return;
    }
    setIsSubmitting(true);
   try {
      await onSave(formData, imageFile);
      // onSave will close the row, so we don't need to setIsSubmitting(false) on success
    } catch (error) {
      toast.error("Failed to save problem.");
      setIsSubmitting(false); 
    }
  };

  return (
    <tr className="border-b border-zinc-800 bg-blue-500/5">
      {isSubmitting && (
        <td colSpan="9" className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center rounded-lg">
           <div className="text-white flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
            Uploading...
           </div>
        </td>
      )}
      <td className="px-4 py-3 text-zinc-400">{nextIndex}</td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={formData.problemName}
          onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
          placeholder="Problem name"
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          required
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="url"
          value={formData.leetcodeLink}
          onChange={(e) => setFormData({ ...formData, leetcodeLink: e.target.value })}
          placeholder="https://leetcode.com/..."
          className="w-12 px-1 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="url"
          value={formData.youtubeLink}
          onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
          placeholder="https://youtube.com/..."
          className="w-12 px-1 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
        />
      </td>
      <td className=" py-3">
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Notes"
          className="w-28 px-1 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
        />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-28 mt-2 text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="date"
          value={formData.lastSolvedDate}
          onChange={(e) => setFormData({ ...formData, lastSolvedDate: e.target.value })}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="date"
          value={formData.nextReviewDate}
          onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 text-center text-zinc-400">0</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title="Save"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
            title="Cancel"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}