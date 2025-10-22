"use client";

import { useState } from "react";

export default function ProblemRow({ problem, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    problemName: problem.problemName,
    leetcodeLink: problem.leetcodeLink,
    lastSolvedDate: problem.lastSolvedDate || "",
    nextReviewDate: problem.nextReviewDate || "",
  });

  const handleSave = async () => {
    await onUpdate(problem._id, editData);
    setIsEditing(false);
  };

  const handleMarkSolved = async () => {
    const today = new Date();
    const lastSolved = today.toISOString().split("T")[0];

    const currentReviews = problem.successfulReviews;
    const daysToAdd = calculateNextReview(currentReviews);

    today.setDate(today.getDate() + daysToAdd);
    const nextReview = today.toISOString().split("T")[0];

    await onUpdate(problem._id, {
      lastSolvedDate: lastSolved,
      nextReviewDate: nextReview,
      successfulReviews: currentReviews + 1,
    });
  };

  const calculateNextReview = (reviews) => {
    const intervals = [1, 3, 7, 14, 30, 60, 90];
    return intervals[Math.min(reviews, intervals.length - 1)];
  };

  const isOverdue = () => {
    if (!problem.nextReviewDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return problem.nextReviewDate < today;
  };

  const isDueToday = () => {
    if (!problem.nextReviewDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return problem.nextReviewDate === today;
  };

  if (isEditing) {
    return (
      <tr className="border-b border-zinc-800 bg-zinc-800/30">
        <td className="px-4 py-3 text-zinc-400">{index}</td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editData.problemName}
            onChange={(e) => setEditData({ ...editData, problemName: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="url"
            value={editData.leetcodeLink}
            onChange={(e) => setEditData({ ...editData, leetcodeLink: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="date"
            value={editData.lastSolvedDate}
            onChange={(e) => setEditData({ ...editData, lastSolvedDate: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="date"
            value={editData.nextReviewDate}
            onChange={(e) => setEditData({ ...editData, nextReviewDate: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3 text-center text-white">{problem.successfulReviews}</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              title="Save"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={() => setIsEditing(false)}
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

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
      <td className="px-4 py-4 text-zinc-400 font-medium">{index}</td>
      <td className="px-4 py-4 text-white font-medium">{problem.problemName}</td>
      <td className="px-4 py-4 text-center">
        <a
          href={problem.leetcodeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 bg-zinc-800 hover:bg-orange-500 rounded-lg transition-all transform hover:scale-110"
          title="Open in LeetCode"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
          </svg>
        </a>
      </td>
      <td className="px-4 py-4 text-zinc-300 text-sm">
        {problem.lastSolvedDate || <span className="text-zinc-600">Not solved yet</span>}
      </td>
      <td className={`px-4 py-4 text-sm font-medium ${isOverdue() ? "text-red-400" : isDueToday() ? "text-orange-400" : "text-zinc-300"}`}>
        {problem.nextReviewDate || <span className="text-zinc-600">Not scheduled</span>}
      </td>
      <td className="px-4 py-4 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full font-semibold text-sm">
          {problem.successfulReviews}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleMarkSolved}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all transform hover:scale-110"
            title="Mark as Solved"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-110"
            title="Edit"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(problem._id)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all transform hover:scale-110"
            title="Delete"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}