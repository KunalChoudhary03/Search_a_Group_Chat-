import React, { useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const TopNavbar = ({
  query,
  onQueryChange,
  onSearch,
  isLoading = false,
  placeholder = 'Search your conversations by meaning...',
}) => {
  const inputRef = useRef(null);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 bg-[#F0F2F5] border-b border-[#D1D7DB] px-6 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Central Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#54656F] absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
            placeholder={placeholder}
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-white hover:bg-[#FDFDFD] focus:bg-white border border-[#D1D7DB] focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/30 text-[#111B21] text-xs sm:text-sm placeholder-[#8696A0] outline-none transition-all shadow-xs"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-[#54656F] bg-[#F0F2F5] border border-[#D1D7DB] rounded">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Online status & User Profile */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#008069] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_6px_rgba(37,211,102,0.8)]" />
          <span>Online</span>
        </div>

        {/* Profile Chip: (K) Kunal */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#D1D7DB]">
          <div className="w-7 h-7 rounded-full bg-[#008069] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            K
          </div>
          <span className="font-semibold text-[#111B21] hidden sm:inline">Kunal</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#54656F]" />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
