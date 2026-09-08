import React from 'react';
import { ChevronDown, X } from 'lucide-react';

export const MONTH_DATE_RANGES = {
  'January 2026': 'Jan 1 – Jan 31, 2026',
  'February 2026': 'Feb 1 – Feb 28, 2026',
  'March 2026': 'Mar 1 – Mar 31, 2026',
  'April 2026': 'Apr 1 – Apr 30, 2026',
  'May 2026': 'May 1 – May 31, 2026',
  'June 2026': 'Jun 1 – Jun 30, 2026',
};

export const getMonthRangeLabel = (dateStr) => {
  if (!dateStr) return '';
  const lower = dateStr.toLowerCase();
  for (const [m, range] of Object.entries(MONTH_DATE_RANGES)) {
    if (lower.includes(m.toLowerCase().split(' ')[0])) {
      return range;
    }
  }
  return '';
};

const MONTH_OPTIONS = [
  { label: 'Any Time', value: '' },
  { label: 'January 2026', value: 'January 2026' },
  { label: 'February 2026', value: 'February 2026' },
  { label: 'March 2026', value: 'March 2026' },
  { label: 'April 2026', value: 'April 2026' },
  { label: 'May 2026', value: 'May 2026' },
  { label: 'June 2026', value: 'June 2026' },
];

export const SearchFilters = ({
  sender,
  onSenderChange,
  date,
  onDateChange,
  senders = ['Kunal', 'Priya', 'Rahul', 'Aman', 'Neha', 'Arjun', 'Simran', 'Riya'],
}) => {
  const hasActiveFilters = Boolean(sender || date);

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      {/* Participant Filter Dropdown */}
      <div className="relative">
        <select
          value={sender}
          onChange={(e) => onSenderChange(e.target.value)}
          className="appearance-none bg-[#13161c] hover:bg-[#181c24] border border-[#232731] hover:border-[#2f3542] text-zinc-200 text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-indigo-500/70 transition-colors cursor-pointer font-medium"
        >
          <option value="">All Participants</option>
          {senders.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
      </div>

      {/* Time Filter Dropdown */}
      <div className="relative">
        <select
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="appearance-none bg-[#13161c] hover:bg-[#181c24] border border-[#232731] hover:border-[#2f3542] text-zinc-200 text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-indigo-500/70 transition-colors cursor-pointer font-medium"
        >
          {MONTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
      </div>

      {/* Subtle Clear Filters Action */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            onSenderChange('');
            onDateChange('');
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2 ml-1 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default SearchFilters;

