"use client";

import { useState } from "react";
import ProblemTable from "../problems/ProblemTable";

export default function PatternAccordion({ pattern, problems, onAddProblem, onUpdateProblem, onDeleteProblem }) {
  const [isOpen, setIsOpen] = useState(false);

  const totalProblems = problems.length;
  const problemsDueToday = problems.filter((p) => {
    if (!p.nextReviewDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return p.nextReviewDate <= today;
  }).length;

  return (
    <div className="border border-zinc-800  rounded-4xl overflow-hidden bg-zinc-900/50  backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-300/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-5 flex items-center justify-between text-left ${isOpen ? "bg-zinc-800/50": ""} hover:bg-zinc-800/50 transition-all group`}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-gray-700  to-slate-500 flex items-center justify-center transform transition-transform ${isOpen ? "rotate-90" : ""}`}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              {pattern.name}
            </h3>
            <div className="flex gap-4 mt-1">
              <span className="text-sm text-zinc-400">
                {totalProblems} {totalProblems === 1 ? "problem" : "problems"}
              </span>
              {problemsDueToday > 0 && (
                <span className="text-sm text-orange-400 font-medium animate-pulse">
                  {problemsDueToday} due today
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-6">
          <ProblemTable
            patternId={pattern._id}
            problems={problems}
            onAddProblem={onAddProblem}
            onUpdateProblem={onUpdateProblem}
            onDeleteProblem={onDeleteProblem}
          />
        </div>
      </div>
    </div>
  );
}