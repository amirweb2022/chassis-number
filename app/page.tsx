"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import AddPartForm from "@/components/AddPartForm";
import { PartEntry } from "@/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PartEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      search(query);
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const handleAdd = (part: PartEntry) => {
    if (query.trim()) search(query);
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1">
            Parts Lookup
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Chassis Search
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Search by chassis number or part title to find matching records.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Add Form */}
        <AddPartForm onAdd={handleAdd} />

        {/* Search */}
        <SearchBar onSearch={setQuery} query={query} isLoading={isSearching} />

        {/* Status */}
        {query.trim() && !isSearching && (
          <p className="text-xs text-zinc-400 text-center -mt-2">
            {results.length === 0
              ? `No results for "${query.trim()}"`
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query.trim()}"`}
          </p>
        )}

        {/* Loading Skeletons */}
        {isSearching && (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-zinc-100 rounded-lg w-32" />
                  <div className="h-5 bg-zinc-100 rounded-lg w-20" />
                </div>
                <div className="h-3 bg-zinc-100 rounded w-24 mb-3" />
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-8 bg-zinc-100 rounded-lg w-20" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query.trim() && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-100 mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-700">Start searching</p>
            <p className="text-xs text-zinc-400 mt-1">
              Enter a chassis number like{" "}
              <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">435123</code>{" "}
              or a part name like{" "}
              <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">Part 3</code>
            </p>
          </div>
        )}

        {/* No Results */}
        {!isSearching && hasSearched && results.length === 0 && query.trim() && (
          <div className="text-center mt-4">
            <p className="text-sm text-zinc-500">No parts found. Try a different search term.</p>
          </div>
        )}

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div className="flex flex-col gap-4">
            {results.map((entry) => (
              <ResultCard key={entry.id} entry={entry} highlight={query.trim()} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}