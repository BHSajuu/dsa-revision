"use client";

import { useState, useEffect } from "react";

export default function ReviewReminders({ problems }) {
  const [showReminder, setShowReminder] = useState(false);
  const [dueProblems, setDueProblems] = useState([]);

  useEffect(() => {
    if (!problems) return;

    const today = new Date().toISOString().split("T")[0];
    const due = problems.filter((p) => p.nextReviewDate && p.nextReviewDate <= today);

    setDueProblems(due);
    setShowReminder(due.length > 0);
  }, [problems]);

  if (!showReminder || dueProblems.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-2xl p-6 max-w-md border border-orange-400/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Review Time!</h3>
              <p className="text-orange-100 text-sm">
                {dueProblems.length} {dueProblems.length === 1 ? "problem needs" : "problems need"} review
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReminder(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {dueProblems.slice(0, 3).map((problem, index) => (
            <div key={problem._id} className="flex items-center gap-2 text-white/90 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span className="truncate">{problem.problemName}</span>
            </div>
          ))}
          {dueProblems.length > 3 && (
            <p className="text-white/70 text-sm pl-3.5">
              +{dueProblems.length - 3} more
            </p>
          )}
        </div>

        <button
          onClick={() => setShowReminder(false)}
          className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all backdrop-blur-sm"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}