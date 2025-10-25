"use client";

import { useState } from "react";
import ProblemRow from "./ProblemRow";
import AddProblemRow from "./AddProblemRow";

export default function ProblemTable({ patternId, problems, onAddProblem, onUpdateProblem, onDeleteProblem, onShowNote }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (problemData, imageFile) => {
    await onAddProblem({ ...problemData, patternId }, imageFile);
    setIsAdding(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 ">
            <th className="px-4 py-3 text-left text-sm font-bold text-zinc-300 ">No.</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-zinc-300 w-2/7">Problem Name</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-zinc-300 ">Link</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-zinc-300 ">Video</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-zinc-300 ">Notes</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-zinc-300 ">Last Solved</th>
            <th className="px-4 py-3 text-left text-sm font-bold text-zinc-300 ">Next Review</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-zinc-300 ">Reviews</th>
            <th className="px-4 py-3 text-center text-sm font-bold text-zinc-300 ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <ProblemRow
              key={problem._id}
              problem={problem}
              index={index + 1}
              onUpdate={onUpdateProblem}
              onDelete={onDeleteProblem}
              onShowNote={onShowNote}
            />
          ))}
          {isAdding ? (
            <AddProblemRow
              onSave={handleAdd}
              onCancel={() => setIsAdding(false)}
              nextIndex={problems.length + 1}
            />
          ) : (
            <tr>
              <td colSpan="8" className="px-4 py-4">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-4xl text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Problem
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}