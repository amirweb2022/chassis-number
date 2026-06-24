"use client";

import { useState } from "react";
import { PartEntry } from "@/types";

interface ResultCardProps {
  entry: PartEntry;
  highlight?: string;
  onUpdate: (updated: PartEntry) => void;
}

export default function ResultCard({ entry, highlight, onUpdate }: ResultCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [chassisInput, setChassisInput] = useState(entry.chassisNumbers.join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const highlightText = (text: string) => {
    if (!highlight) return <>{text}</>;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-zinc-900 rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleEditClick = () => {
    setTitle(entry.title);
    setChassisInput(entry.chassisNumbers.join(", "));
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    const chassisNumbers = chassisInput
      .split(/[\n,،]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (chassisNumbers.length === 0) {
      setError("At least one chassis number is required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/parts/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), chassisNumbers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const updated = await res.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- EDIT MODE ----------
  if (isEditing) {
    return (
      <div className="bg-white border border-zinc-300 rounded-2xl p-6 shadow-md ring-2 ring-zinc-800/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            Editing
          </span>
          <button
            onClick={handleCancel}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label="Cancel editing"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5 block">
              Part Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5 block">
              Chassis Numbers
            </label>
            <textarea
              value={chassisInput}
              onChange={(e) => setChassisInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 text-sm font-mono text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-zinc-400 mt-1">
              Separate with comma (,) or new line
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- VIEW MODE ----------
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          {highlightText(entry.title)}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-zinc-100 text-zinc-500 px-2 py-1 rounded-lg border border-zinc-200">
            {entry.chassisNumbers.length} chassis
          </span>
          <button
            onClick={handleEditClick}
            aria-label="Edit part"
            className="text-zinc-400 hover:text-zinc-800 transition-colors p-1.5 rounded-lg hover:bg-zinc-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-2">
          Chassis Numbers
        </p>
        <div className="flex flex-wrap gap-2">
          {entry.chassisNumbers.map((num) => (
            <span
              key={num}
              className="font-mono text-sm bg-zinc-50 text-zinc-700 border border-zinc-200 px-3 py-1 rounded-lg"
            >
              {highlightText(num)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}