"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../contexts/AuthContext";
import PatternAccordion from "../patterns/PatternAccordion";
import StatsOverview from "../stats/StatsOverview";
import ReviewReminders from "../notifications/ReviewReminders";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const [newPatternName, setNewPatternName] = useState("");

  const patterns = useQuery(
    api.patterns.getPatternsByUser,
    user?._id ? { userId: user._id } : "skip"
  );

  const allProblems = useQuery(
    api.problems.getProblemsByUser,
    user?._id ? { userId: user._id } : "skip"
  );

  const createPattern = useMutation(api.patterns.createPattern);
  const createProblem = useMutation(api.problems.createProblem);
  const updateProblem = useMutation(api.problems.updateProblem);
  const deleteProblem = useMutation(api.problems.deleteProblem);
  const deletePattern = useMutation(api.patterns.deletePattern);

  const handleAddPattern = async () => {
    if (!newPatternName.trim()) return;

    try {
      await createPattern({
      name: newPatternName.trim(),
      userId: user._id,
      order: patterns?.length || 0,
    });

    setNewPatternName("");
    setIsAddingPattern(false);
    toast.success("Pattern added successfully");
    } catch (error) {
      toast.error("Failed to add pattern");
    }
  };

  const handleAddProblem = async (problemData) => {
   try {
       await createProblem({
      ...problemData,
      userId: user._id,
      successfulReviews: 0,
    });
      toast.success("Problem added successfully");
   } catch (error) {
      toast.error("Failed to add problem");
   }
  };

  const handleUpdateProblem = async (problemId, updates) => {
    try {
      await updateProblem({
      problemId,
      ...updates,
    });
    toast.success("Problem updated successfully");
    } catch (error) {
      toast.error("Failed to update problem");
    }
  };

  const handleDeleteProblem = async (problemId) => {
   try {
    await deleteProblem({ problemId });
      toast.success("Problem deleted successfully");  
   } catch (error) {
      toast.error("Failed to delete problem");
   }
    
  };

  const handleDeletePattern = async (patternId) => {
    try {
       await deletePattern({ patternId });
       toast.success("Pattern and its problems deleted successfully");
    } catch (error) {
       toast.error("Failed to delete pattern");
    }
    
  };

  const getProblemsByPattern = (patternId) => {
    return allProblems?.filter((p) => p.patternId === patternId) || [];
  };

  if (!patterns || !allProblems) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <ReviewReminders problems={allProblems} />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DSA Tracker</h1>
                <p className="text-sm text-zinc-400">Pattern-based Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-medium text-white">{user?.name}</p>
                <p className="text-xs text-zinc-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5 text-zinc-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <StatsOverview problems={allProblems} patterns={patterns} />

        <div className="mt-8 space-y-4">
          {patterns.map((pattern) => (
            <div key={pattern._id} className="relative group">
              <PatternAccordion
                pattern={pattern}
                problems={getProblemsByPattern(pattern._id)}
                onAddProblem={handleAddProblem}
                onUpdateProblem={handleUpdateProblem}
                onDeleteProblem={handleDeleteProblem}
              />
              <button
                onClick={() => handleDeletePattern(pattern._id)}
                className="absolute top-7 right-16 p-2 bg-red-600/0 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Delete Pattern"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {isAddingPattern ? (
            <div className="border-2 border-dashed border-blue-500 rounded-xl p-6 bg-blue-500/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newPatternName}
                  onChange={(e) => setNewPatternName(e.target.value)}
                  placeholder="Enter pattern name (e.g., Sliding Window, Two Pointer)"
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddPattern()}
                />
                <button
                  onClick={handleAddPattern}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingPattern(false);
                    setNewPatternName("");
                  }}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingPattern(true)}
              className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-4xl text-zinc-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Pattern</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}