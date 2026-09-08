import React, { useRef, useEffect } from 'react';
import { Search, CornerDownLeft, Loader2, X } from 'lucide-react';

export const SearchBar = ({
  query,
  onQueryChange,
  onSearch,
  isLoading = false,
  placeholder = 'Search your conversations by meaning...',
  suggestions = [],
  onSelectSuggestion,
}) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <div className="w-full space-y-2.5">
      {/* Sleek Search Input */}
      <div className="relative flex items-center bg-[#13161c] border border-[#232731] hover:border-[#2f3542] focus-within:border-indigo-500/70 focus-within:ring-1 focus-within:ring-indigo-500/30 rounded-xl transition-all shadow-sm">
        <div className="pl-4 pr-2 text-zinc-500 pointer-events-none">
          <Search className="w-5 h-5 text-zinc-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-[16px] sm:text-[17px] py-3.5 pr-28 outline-none font-normal"
        />

        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors mr-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="pr-3 flex items-center gap-1.5 shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono px-2 py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="hidden sm:inline">Searching...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSearch}
              disabled={!query.trim()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/60 disabled:opacity-40 disabled:hover:bg-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Search (Enter)"
            >
              <span className="hidden sm:inline">Search</span>
              <CornerDownLeft className="w-3 h-3 text-zinc-400" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Queries (Clean, quiet inline text) */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 px-0.5">
          <span className="text-[11px] text-zinc-500">Suggested:</span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion(sug)}
              className="text-zinc-400 hover:text-zinc-200 hover:underline underline-offset-4 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] mr-2"
            >
              "{sug}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

