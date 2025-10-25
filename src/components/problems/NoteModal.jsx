
"use client";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";


const Spinner = () => (
  <div className="flex justify-center items-center h-48 bg-zinc-800/50 rounded-lg">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
  </div>
);

export default function NoteModal({ note, onClose }) {
  if(!note) return null;
  
  const [isImageLoading, setIsImageLoading] = useState(true);
   
  const { text, imageUrl } = note;
  
  // Reset loading state when the image URL changes
  useEffect(() => {
    if (imageUrl) {
      setIsImageLoading(true);
    }
  }, [imageUrl]);

  if (!text && !imageUrl) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  "
      onClick={onClose}
    >
      <motion.div
        className="relative text-justify mx-4 hyphens-auto z-50 bg-zinc-900 text-white p-6 rounded-4xl border border-white/10 w-full max-w-xl shadow-xl shadow-blue-500/20"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.2, opacity: 0.5 }}
        animate={{ scale: 1.25, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 1.2, bounce: 0.3 }}
      >
        <h3 className="text-lg font-bold text-blue-400 mb-3">Notes</h3>
        {imageUrl && (
          <div className="mb-4">
            {isImageLoading && <Spinner />}
            <img 
              src={imageUrl} 
              alt="Note illustration" 
              className={`rounded-lg max-w-full h-auto ${isImageLoading ? 'hidden' : 'block'}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)} // Hide spinner even if image fails to load
            />
          </div>
        )}
        {text && (
          <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{text}</p>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </motion.div>
    </div>,
    document.body
  );
}