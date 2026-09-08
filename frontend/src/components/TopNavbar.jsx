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
    <header className="h-16 bg-[#FAF6F0] border-b border-[#E5DFD4] px-6 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Central Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#7B8570] absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
            placeholder={placeholder}
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-white hover:bg-[#FDFCF9] focus:bg-white border border-[#DFD8CC] focus:border-[#8B9A6E] text-[#252B20] text-xs sm:text-sm placeholder-[#949C8B] outline-none transition-all shadow-xs"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-[#626C56] bg-[#F2ECE2] border border-[#DDD5C6] rounded">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Online status & User Profile */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#46513A] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#8B9A6E] shadow-[0_0_6px_rgba(139,154,110,0.8)]" />
          <span>Online</span>
        </div>

        {/* Profile Chip: (K) Kunal */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5DFD4]">
          <div className="w-7 h-7 rounded-full bg-[#8B9A6E] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            K
          </div>
          <span className="font-semibold text-[#252B20] hidden sm:inline">Kunal</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737C68]" />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
