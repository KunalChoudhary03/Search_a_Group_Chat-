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
  { name: 'Kunal', initial: 'K', color: 'bg-[#8B9A6E] text-white' },
  { name: 'Priya', initial: 'P', color: 'bg-[#C27D7D] text-white' },
  { name: 'Rahul', initial: 'R', color: 'bg-[#679B85] text-white' },
  { name: 'Aman', initial: 'A', color: 'bg-[#D49B5B] text-white' },
  { name: 'Neha', initial: 'N', color: 'bg-[#987BB8] text-white' },
  { name: 'Arjun', initial: 'A', color: 'bg-[#5B95A8] text-white' },
  { name: 'Simran', initial: 'S', color: 'bg-[#C7A752] text-white font-bold' },
  { name: 'Riya', initial: 'R', color: 'bg-[#9C79A8] text-white' },
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
    <aside className="w-64 bg-[#F2ECE2] border-r border-[#E4DDD1] flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-2xl bg-[#8B9A6E] flex items-center justify-center text-white shadow-md shadow-[#8B9A6E]/30">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="font-bold text-[#252B20] text-[16px] tracking-tight leading-none">
              ChatSense
            </h1>
            <p className="text-[11px] text-[#737C68] mt-1 font-normal">
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
                ? 'bg-[#8B9A6E] text-white shadow-sm shadow-[#8B9A6E]/30'
                : 'text-[#636C58] hover:text-[#252B20] hover:bg-[#EAE3D6]'
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
                ? 'bg-[#8B9A6E] text-white shadow-sm shadow-[#8B9A6E]/30'
                : 'text-[#636C58] hover:text-[#252B20] hover:bg-[#EAE3D6]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </nav>

        {/* Dataset Overview Section */}
        <div className="space-y-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#828C76] px-1">
            Dataset Overview
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3C4433]">
              <Layers className="w-4 h-4 text-[#8B9A6E] shrink-0" />
              <div>
                <span className="font-bold text-[#252B20] font-mono">
                  {totalMessages ? totalMessages.toLocaleString() : '4,600'}+
                </span>{' '}
                <span className="text-[#6B7460] text-[11px]">Messages</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3C4433]">
              <Users className="w-4 h-4 text-[#8B9A6E] shrink-0" />
              <div>
                <span className="font-bold text-[#252B20] font-mono">{participantCount}</span>{' '}
                <span className="text-[#6B7460] text-[11px]">Participants</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3C4433]">
              <Calendar className="w-4 h-4 text-[#8B9A6E] shrink-0" />
              <div>
                <span className="font-bold text-[#252B20]">6 months</span>
                <p className="text-[10px] text-[#737C68]">Jan – Jun 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 text-[#3C4433]">
              <Compass className="w-4 h-4 text-[#8B9A6E] shrink-0" />
              <div>
                <span className="font-bold text-[#252B20] font-mono">{decisionCount}</span>{' '}
                <span className="text-[#6B7460] text-[11px]">Decision Threads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#828C76]">
              Participants
            </h2>
            {senderFilter && (
              <button
                type="button"
                onClick={() => onSenderFilterChange('')}
                className="text-[10px] text-[#8B9A6E] hover:text-[#67754E] cursor-pointer underline underline-offset-2 font-medium"
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
                      ? 'bg-[#8B9A6E]/20 text-[#404D2F] font-bold border border-[#8B9A6E]/40'
                      : 'text-[#444D39] hover:bg-[#EAE3D6] hover:text-[#1E2319]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 shadow-xs ${p.color}`}
                  >
                    {p.initial}
                  </div>
                  <span className="font-medium">{p.name}</span>
                  {p.name === 'Kunal' && (
                    <span className="text-[10px] text-[#78826C] font-mono ml-auto">(You)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Local Search Engine Status Card */}
      <div className="p-4 border-t border-[#E4DDD1]">
        <div className="p-3 rounded-xl bg-[#EAE3D6] border border-[#DDD5C6] space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#54683E]">
            <span className="w-2 h-2 rounded-full bg-[#8B9A6E] shadow-[0_0_6px_rgba(139,154,110,0.8)]" />
            <span>Local Search Engine</span>
          </div>
          <p className="text-[11px] text-[#737C68]">
            No external API • 100% Local
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
