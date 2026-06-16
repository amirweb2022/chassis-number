"use client";

interface SearchBarProps {
  onSearch: (query: string) => void;
  query: string;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, query, isLoading }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
        {isLoading ? (
          <svg
            className="animate-spin"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search by chassis number or part title…"
        className="w-full pl-11 pr-10 py-3.5 text-sm text-zinc-800 bg-white border border-zinc-200 rounded-2xl shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-150"
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}