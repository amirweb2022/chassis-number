"use client";

import { useState } from "react";
import { PartEntry } from "@/types";

interface AddPartFormProps {
  onAdd: (part: PartEntry) => void;
}

export default function AddPartForm({ onAdd }: AddPartFormProps) {
  const [title, setTitle] = useState("");
  const [chassisInput, setChassisInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
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

    setIsLoading(true);
    try {
      const res = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), chassisNumbers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const newPart = await res.json();
      onAdd(newPart);
      setTitle("");
      setChassisInput("");
      setIsOpen(false);
      alert("Part added successfully!");
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors duration-150 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add New Part
      </button>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-zinc-900">Add New Part</h2>
        <button
          onClick={() => { setIsOpen(false); setError(""); }}
          className="text-zinc-400 hover:text-zinc-700 transition-colors"
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
            placeholder="e.g. Part 3"
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
            placeholder={"Enter chassis numbers separated by comma or new line:\n435123, ABC456\n700001"}
            rows={5}
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

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Saving…
            </>
          ) : (
            "Save Part"
          )}
        </button>
      </div>
    </div>
  );
}