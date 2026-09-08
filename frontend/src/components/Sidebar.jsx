import React from 'react';
import {
  MessageSquare,
  Search,
  Layers,
  Users,
  Calendar,
  Compass,
} from 'lucide-react';

export const PARTICIPANT_AVATARS = [
  { name: 'Kunal', initial: 'K', color: 'bg-[#008069] text-white' },
  { name: 'Priya', initial: 'P', color: 'bg-[#D33E76] text-white' },
  { name: 'Rahul', initial: 'R', color: 'bg-[#007BFC] text-white' },
  { name: 'Aman', initial: 'A', color: 'bg-[#E36D00] text-white' },
  { name: 'Neha', initial: 'N', color: 'bg-[#8A3FFC] text-white' },
  { name: 'Arjun', initial: 'A', color: 'bg-[#009688] text-white' },
  { name: 'Simran', initial: 'S', color: 'bg-[#C27803] text-white font-bold' },
  { name: 'Riya', initial: 'R', color: 'bg-[#1F883D] text-white' },
];

export const Sidebar = ({
  activeTab = 'chat',
  onTabChange,
  senderFilter = '',
  onSenderFilterChange,
  totalMessages = 4600,
  participantCount = 8,
  decisionCount = 3,
}) => {
  return (
    <aside className="w-64 bg-[#F0F2F5] border-r border-[#D1D7DB] flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-2xl bg-[#008069] flex items-center justify-center text-white shadow-md shadow-[#008069]/25">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="font-bold text-[#111B21] text-[16px] tracking-tight leading-none">
              ChatSense
            </h1>
            <p className="text-[11px] text-[#667781] mt-1 font-normal">
              Semantic Group Chat Search
            </p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => onTabChange('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#008069] text-white shadow-sm shadow-[#008069]/25'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#E9EDEF]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('search')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#008069] text-white shadow-sm shadow-[#008069]/25'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#E9EDEF]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </nav>

        {/* Dataset Overview Section */}
        <div className="space-y-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#54656F] px-1">
            Dataset Overview
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3B4A54]">
              <Layers className="w-4 h-4 text-[#008069] shrink-0" />
              <div>
                <span className="font-bold text-[#111B21] font-mono">
                  {totalMessages ? totalMessages.toLocaleString() : '4,600'}+
                </span>{' '}
                <span className="text-[#667781] text-[11px]">Messages</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3B4A54]">
              <Users className="w-4 h-4 text-[#008069] shrink-0" />
              <div>
                <span className="font-bold text-[#111B21] font-mono">{participantCount}</span>{' '}
                <span className="text-[#667781] text-[11px]">Participants</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3B4A54]">
              <Calendar className="w-4 h-4 text-[#008069] shrink-0" />
              <div>
                <span className="font-bold text-[#111B21]">6 months</span>
                <p className="text-[10px] text-[#667781]">Jan – Jun 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3B4A54]">
              <Compass className="w-4 h-4 text-[#008069] shrink-0" />
              <div>
                <span className="font-bold text-[#111B21] font-mono">{decisionCount}</span>{' '}
                <span className="text-[#667781] text-[11px]">Decision Threads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#54656F]">
              Participants
            </h2>
            {senderFilter && (
              <button
                type="button"
                onClick={() => onSenderFilterChange('')}
                className="text-[10px] text-[#008069] hover:text-[#005C4B] cursor-pointer underline underline-offset-2 font-medium"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-1">
            {PARTICIPANT_AVATARS.map((p) => {
              const isSelected = senderFilter.toLowerCase() === p.name.toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onSenderFilterChange(isSelected ? '' : p.name)}
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#008069]/15 text-[#008069] font-bold border border-[#008069]/30'
                      : 'text-[#3B4A54] hover:bg-[#E9EDEF] hover:text-[#111B21]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 shadow-xs ${p.color}`}
                  >
                    {p.initial}
                  </div>
                  <span className="font-medium">{p.name}</span>
                  {p.name === 'Kunal' && (
                    <span className="text-[10px] text-[#008069] font-mono ml-auto">(You)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
