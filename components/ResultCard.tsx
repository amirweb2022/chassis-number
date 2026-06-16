"use client";

import { PartEntry } from "@/types";
interface ResultCardProps {
  entry: PartEntry;
  highlight?: string;
}

export default function ResultCard({ entry, highlight }: ResultCardProps) {
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

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          {highlightText(entry.title)}
        </h2>
        <span className="text-xs font-mono bg-zinc-100 text-zinc-500 px-2 py-1 rounded-lg border border-zinc-200">
          {entry.chassisNumbers.length} chassis
        </span>
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