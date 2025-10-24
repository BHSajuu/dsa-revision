"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import PlatformIcon, { getPlatform, getPlatformHoverColor } from "./PlatformIcon";

export default function ProblemRow({ problem, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    problemName: problem.problemName,
    leetcodeLink: problem.leetcodeLink,
    youtubeLink: problem.youtubeLink || "",
    notes: problem.notes || "",
    lastSolvedDate: problem.lastSolvedDate || "",
    nextReviewDate: problem.nextReviewDate || "",
    successfulReviews: problem.successfulReviews || 0,
  });

  const descRef = useRef(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

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
    const intervals = [3, 7, 14, 30, 60, 90];
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

  const handleDescriptionClick = (e) => {
    const rect = (e.target).getBoundingClientRect();
    setCoords({ x: rect.left, y: rect.top + window.scrollY });
    setShowFullDesc(true);
  };

  if (isEditing) {
    return (
      <tr className=" border-b border-zinc-800 bg-zinc-800/30">
        <td className="px-4 py-3 text-zinc-400">{index}</td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editData.problemName}
            onChange={(e) => setEditData({ ...editData, problemName: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-3 py-3">
          <input
            type="url"
            value={editData.leetcodeLink}
            onChange={(e) => setEditData({ ...editData, leetcodeLink: e.target.value })}
            className="w-12 px-1 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>

        <td className="px-3 py-3">
          <input
            type="url"
            value={editData.youtubeLink}
            onChange={(e) =>
              setEditData({ ...editData, youtubeLink: e.target.value })
            }
            className="w-12 px-1 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>

        <td className=" py-3">
          <input
            type="text"
            value={editData.notes}
            onChange={(e) =>
              setEditData({ ...editData, notes: e.target.value })
            }
            className="w-28 px-1 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <td className="px-4 py-3 text-center text-white">
          <input
            type="number"
            value={editData.successfulReviews}
            onChange={(e) =>
              setEditData({
                ...editData,
                successfulReviews: parseInt(e.target.value, 10), // Convert to number here
              })
            }
            className="w-16 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
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
    <>
      <tr className="hover:rounded-4xl border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
        <td className="px-4 py-4 text-zinc-400 font-medium">{index}</td>
        <td className="px-4 py-4 text-white font-medium">{problem.problemName}</td>
        <td className="px-4 py-4 text-center">
          <a
            href={problem.leetcodeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-10 h-10 bg-zinc-800 ${getPlatformHoverColor(getPlatform(problem.leetcodeLink))} rounded-lg transition-all transform hover:scale-110`}
            title={`Open in ${getPlatform(problem.leetcodeLink)}`}
          >
            <PlatformIcon url={problem.leetcodeLink} />
          </a>
        </td>
        <td className="px-4 py-4 text-center">
          <a
            href={problem.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all transform hover:scale-110 ${problem.youtubeLink
              ? "bg-zinc-800 hover:bg-red-600"
              : "bg-zinc-800 cursor-not-allowed opacity-50"
              }`}
            title="Open in YouTube"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a2.996 2.996 0 0 0-2.107-2.118C19.059 3.5 12 3.5 12 3.5s-7.06 0-9.391.568A2.996 2.996 0 0 0 .502 6.186 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .502 5.814 2.996 2.996 0 0 0 2.107 2.118C4.94 20.5 12 20.5 12 20.5s7.06 0 9.391-.568a2.996 2.996 0 0 0 2.107-2.118A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </td>
        <td
          className=" pt-6 text-zinc-300 text-sm line-clamp-1 cursor-pointer"
          onClick={handleDescriptionClick}
        >
          {problem.notes || <span className="text-zinc-600">No notes</span>}
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
          <div className="flex items-center justify-center gap-2  transition-opacity">
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

      {showFullDesc &&
        createPortal(
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFullDesc(false)}
            ref={descRef}
          >
            <motion.div
              
              className="absolute text-justify mx-3 hyphens-auto z-50 bg-zinc-900 text-white p-4 rounded-3xl border border-white/10 w-96 hover:cursor-pointer hover:shadow-xl hover:shadow-blue-300/30"
              style={{
                top: coords.y + 30,
                left: coords.x,
              }}
              initial={{ scale: 0.2, opacity: 0.5 }}
              animate={{ scale: 1.25, opacity: 1 }}
              transition={{ type: "spring", duration: 1.2, bounce: 0.3 }}
            >
              <p className="text-sm leading-relaxed">{problem.notes}</p>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}