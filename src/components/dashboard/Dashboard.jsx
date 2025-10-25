"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../contexts/AuthContext";
import PatternAccordion from "../patterns/PatternAccordion";
import StatsOverview from "../stats/StatsOverview";
import ReviewReminders from "../notifications/ReviewReminders";
import { EditIcon, LogOutIcon, NotebookIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import NoteModal from "../problems/NoteModal";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const [newPatternName, setNewPatternName] = useState("");
  const [patternNotes, setPatternNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingPattern, setIsEditingPattern] = useState(false);
  const [editedPatternName, setEditedPatternName] = useState("");
  const [editedPatternNotes, setEditedPatternNotes] = useState("");
  const [editingPatternId, setEditingPatternId] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  
  const patterns = useQuery(
    api.patterns.getPatternsByUser,
    user?._id ? { userId: user._id } : "skip"
  );

  const allProblems = useQuery(
    api.problems.getProblemsByUser,
    user?._id ? { userId: user._id } : "skip"
  );

  const createPattern = useMutation(api.patterns.createPattern);
  const updatePattern = useMutation(api.patterns.updatePattern);
  const createProblem = useMutation(api.problems.createProblem);
  const updateProblem = useMutation(api.problems.updateProblem);
  const deleteProblem = useMutation(api.problems.deleteProblem);
  const deletePattern = useMutation(api.patterns.deletePattern);
  const generateUploadUrl = useAction(api.problems.generateUploadUrl);

  const handleAddPattern = async () => {
    if (!newPatternName.trim()) return;

    try {
      await createPattern({
        name: newPatternName.trim(),
        userId: user._id,
        order: patterns?.length || 0,
        patternNotes: patternNotes.trim() || "",
      });

      setNewPatternName("");
      setIsAddingPattern(false);
      setPatternNotes("");
      toast.success("Pattern added successfully");
    } catch (error) {
      toast.error("Failed to add pattern");
    }
  };
 
const handleAddProblem = async (problemData, imageFile) => {
    try {
      let imageStorageId;
      if (imageFile) {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      // Step 3: Save the problem with the new storage ID
      await createProblem({
        ...problemData,
        userId: user._id,
        successfulReviews: 0,
        imageStorageId: imageStorageId, 
      });
      toast.success("Problem added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add problem");
    }
  };

 const handleUpdateProblem = async (problemId, updates, imageFile) => {
    try {
      let imageStorageId = updates.imageStorageId; // Keep existing image unless new one is uploaded
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }
      
      await updateProblem({
        problemId,
        ...updates,
        imageStorageId: imageStorageId,
      });
      toast.success("Problem updated successfully");
    } catch (error) {
      console.error(error);
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
    const pattern = patterns.find((p) => p._id === patternId);
    if (!pattern) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the pattern "${pattern.name}" and all its associated problems? This action cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await deletePattern({ patternId });
      toast.success("Pattern and its problems deleted successfully");
    } catch (error) {
      toast.error("Failed to delete pattern");
    }

  };

  const handleOpenNotes = (patternId) => {
    const pattern = patterns.find((p) => p._id === patternId);
    if (pattern && pattern.patternNotes) {
      window.open(pattern.patternNotes, '_blank');
    } else {
      toast('No notes available for this pattern', {
        icon: '🙅‍♂️',
      });
    }
  }

  const handleEditPattern = async (patternId) => {
    setIsEditingPattern(true);
    const pattern = patterns.find((p) => p._id === patternId);
    if (pattern) {
      setEditedPatternName(pattern.name);
      setEditedPatternNotes(pattern.patternNotes);
      setEditingPatternId(pattern._id);
    }
  }

  const handleUpdatePattern = async () => {
    if (!editedPatternName.trim()) return;

    try {
      await updatePattern({
        patternId: editingPatternId,
        name: editedPatternName.trim(),
        patternNotes: editedPatternNotes.trim() || "",
      });

      setEditedPatternName("");
      setEditedPatternNotes("");
      setEditingPatternId(null);
      setIsEditingPattern(false);
      toast.success("Pattern updated successfully");
    } catch (error) {
      toast.error("Failed to update pattern");
    }
  };
 
  const handleShowNote = (noteText) => {
    setActiveNote(noteText);
  };

  const handleCloseNote = () => {
    setActiveNote(null);
  };

  // Memoize the filtered problems and patterns
  const filteredProblems = useMemo(() => {
    if (!allProblems) return [];
    if (!searchQuery) return allProblems;
    return allProblems.filter((p) =>
      p.problemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProblems, searchQuery]);

  const filteredPatterns = useMemo(() => {
    if (!patterns) return [];
    if (!searchQuery) return patterns;
    const problemPatternIds = new Set(filteredProblems.map((p) => p.patternId));
    return patterns.filter((p) => problemPatternIds.has(p._id));
  }, [patterns, filteredProblems, searchQuery]);

  const getProblemsByPattern = (patternId) => {
    return filteredProblems?.filter((p) => p.patternId === patternId) || [];
  };


  if (!patterns || !allProblems) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative isolate" >
      <ReviewReminders problems={allProblems} />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      <NoteModal note={activeNote} onClose={handleCloseNote} />

      <header className="w-[85%] ml-28 shadow-xl shadow-blue-200/20 hover:shadow-3xl hover:shadow-blue-300/30 rounded-4xl border border-zinc-800  sticky top-5 z-40 backdrop-blur-xl bg-linear-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={58} height={50} />
              <div>
                <h1 className="text-xl font-bold text-white">DSA Tracker</h1>
                <p className="text-sm text-zinc-400">Pattern-based Learning</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a problem..."
                className="w-2/3 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <LogOutIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <StatsOverview problems={allProblems} patterns={patterns} />

        <div className="mt-8 space-y-4">
          {filteredPatterns.length == 0 &&
            <>
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-white mb-2">No Patterns Found</h2>
                <p className="text-zinc-400">
                  It looks like you haven't added any patterns yet. Start by adding a new pattern or a problem to organize your problems effectively.
                </p>
              </div>
            </>}

          {filteredPatterns.length > 0 ? (
            filteredPatterns.map((pattern) => (
              <div key={pattern._id} className="relative group">
                <PatternAccordion
                  pattern={pattern}
                  problems={getProblemsByPattern(pattern._id)}
                  onAddProblem={handleAddProblem}
                  onUpdateProblem={handleUpdateProblem}
                  onDeleteProblem={handleDeleteProblem}
                  onShowNote={handleShowNote}
                />
                <button
                  onClick={() => handleOpenNotes(pattern._id)}
                  className="absolute top-7 right-52 p-2 bg-blue-600/0 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Notes"
                >
                  <NotebookIcon className="w-5 h-5 " />
                </button>
                <button
                  onClick={() => handleEditPattern(pattern._id)}
                  className="absolute top-7 right-36 p-2 bg-yellow-600/0 hover:bg-yellow-600 text-yellow-300 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Edit"
                >
                  <EditIcon className="w-5 h-5 " />
                </button>
                <button
                  onClick={() => handleDeletePattern(pattern._id)}
                  className="absolute top-7 right-20 p-2 bg-red-600/0 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Pattern"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {isEditingPattern && pattern._id === editingPatternId &&
                  <div  className="relative z-50 border-2 border-dashed border-blue-500 rounded-3xl p-6 bg-blue-500/5">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editedPatternName}
                        onChange={(e) => setEditedPatternName(e.target.value)}
                        placeholder="Enter pattern name (e.g., Sliding Window, Two Pointer)"
                        className="flex-1  px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-4xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleUpdatePattern()}
                      />
                      <input
                        type="url"
                        value={editedPatternNotes}
                        onChange={(e) => setEditedPatternNotes(e.target.value)}
                        placeholder="Enter pattern notes (e.g., https://example.com/notes)"
                        className="flex-1  px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-4xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleUpdatePattern()}
                      />
                      <button
                        onClick={handleUpdatePattern}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPattern(false);
                          setEditedPatternName("");
                          setEditedPatternNotes("");
                          setEditingPatternId(null);
                        }}
                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-full transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                }
              </div>

            ))
          ) : (filteredPatterns.length != 0 &&
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white">No Problems Found</h3>
              <p className="text-zinc-400 mt-2">
                No problems matched your search for "{searchQuery}".
              </p>
            </div>
          )}

          {isAddingPattern ? (
            <div className="border-2 border-dashed border-blue-500 rounded-3xl p-6 bg-blue-500/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newPatternName}
                  onChange={(e) => setNewPatternName(e.target.value)}
                  placeholder="Enter pattern name (e.g., Sliding Window, Two Pointer)"
                  className="flex-1  px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-4xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddPattern()}
                />
                <input
                  type="url"
                  value={patternNotes}
                  onChange={(e) => setPatternNotes(e.target.value)}
                  placeholder="Enter pattern notes (e.g., https://example.com/notes)"
                  className="flex-1  px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-4xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddPattern()}
                />
                <button
                  onClick={handleAddPattern}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingPattern(false);
                    setNewPatternName("");
                  }}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-full transition-all"
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