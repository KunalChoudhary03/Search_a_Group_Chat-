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
          className="appearance-none bg-[#F0F2F5] hover:bg-[#E9EDEF] border border-[#D1D7DB] hover:border-[#00A884] text-[#111B21] text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-[#00A884] transition-colors cursor-pointer font-medium"
        >
          <option value="" className="bg-[#F0F2F5] text-[#111B21]">All Participants</option>
          {senders.map((s) => (
            <option key={s} value={s} className="bg-[#F0F2F5] text-[#111B21]">
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#54656F] absolute right-2 top-2 pointer-events-none" />
      </div>

      {/* Time Filter Dropdown */}
      <div className="relative">
        <select
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="appearance-none bg-[#F0F2F5] hover:bg-[#E9EDEF] border border-[#D1D7DB] hover:border-[#00A884] text-[#111B21] text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-[#00A884] transition-colors cursor-pointer font-medium"
        >
          {MONTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#F0F2F5] text-[#111B21]">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#54656F] absolute right-2 top-2 pointer-events-none" />
      </div>

      {/* Subtle Clear Filters Action */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            onSenderChange('');
            onDateChange('');
          }}
          className="text-xs text-[#008069] hover:text-[#005C4B] transition-colors underline underline-offset-2 ml-1 cursor-pointer font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default SearchFilters;

