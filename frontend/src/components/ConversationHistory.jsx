import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  ChevronRight,
  MessageSquare,
  Users,
  Calendar,
  RotateCw,
  ChevronDown,
} from 'lucide-react';
import { fetchMessages } from '../services/api';

const SENDER_STYLES = {
  Kunal: { name: 'text-[#586A41]', avatar: 'bg-[#8B9A6E] text-white' },
  Priya: { name: 'text-[#B86262]', avatar: 'bg-[#C27D7D] text-white' },
  Rahul: { name: 'text-[#448068]', avatar: 'bg-[#679B85] text-white' },
  Aman: { name: 'text-[#BC7831]', avatar: 'bg-[#D49B5B] text-white' },
  Neha: { name: 'text-[#815EA7]', avatar: 'bg-[#987BB8] text-white' },
  Arjun: { name: 'text-[#3E7C90]', avatar: 'bg-[#5B95A8] text-white' },
  Simran: { name: 'text-[#A3832B]', avatar: 'bg-[#C7A752] text-white font-bold' },
  Riya: { name: 'text-[#80588E]', avatar: 'bg-[#9C79A8] text-white' },
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

export const getMessageTopic = (msg) => {
  if (msg.threadId === 'winter_trip') {
    return { label: 'Trip Planning', pill: 'text-[#446638] bg-[#E5EFE0] border-[#C3D8BA]' };
  }
  if (msg.threadId === 'college_event') {
    return { label: 'HackCon', pill: 'text-[#6F4E8F] bg-[#F2E8FA] border-[#D9C4EC]' };
  }
  if (msg.threadId === 'project_stack') {
    return { label: 'Project Dev', pill: 'text-[#35678C] bg-[#E4F1F9] border-[#BFDCEF]' };
  }

  const text = (msg.message || '').toLowerCase();
  if (
    text.includes('exam') ||
    text.includes('dbms') ||
    text.includes('paper') ||
    text.includes('revise') ||
    text.includes('study') ||
    text.includes('practical') ||
    text.includes('viva') ||
    text.includes('normalization') ||
    text.includes('2nf') ||
    text.includes('3nf') ||
    text.includes('os') ||
    text.includes('deadlock')
  ) {
    return { label: 'Exams', pill: 'text-[#6F4E8F] bg-[#F2E8FA] border-[#D9C4EC]' };
  }
  if (
    text.includes('drive') ||
    text.includes('file') ||
    text.includes('notes') ||
    text.includes('link') ||
    text.includes('pdf') ||
    text.includes('doc') ||
    text.includes('sheet')
  ) {
    return { label: 'Files', pill: 'text-[#35678C] bg-[#E4F1F9] border-[#BFDCEF]' };
  }
  if (
    text.includes('trip') ||
    text.includes('manali') ||
    text.includes('shimla') ||
    text.includes('snow') ||
    text.includes('vacation') ||
    text.includes('budget') ||
    text.includes('hotel') ||
    text.includes('cottage') ||
    text.includes('traveller')
  ) {
    return { label: 'Trip Planning', pill: 'text-[#446638] bg-[#E5EFE0] border-[#C3D8BA]' };
  }
  if (
    text.includes('canteen') ||
    text.includes('maggi') ||
    text.includes('roll') ||
    text.includes('dhaba') ||
    text.includes('dinner') ||
    text.includes('chai')
  ) {
    return { label: 'Hangout', pill: 'text-[#9C6529] bg-[#FAEDE0] border-[#ECCDB1]' };
  }
  return { label: 'General', pill: 'text-[#656E5C] bg-[#EFEAE1] border-[#DDD5C7]' };
};

export const ConversationHistory = ({
  stats,
  dateFilter = '',
  senderFilter = '',
  onDateChange,
  onSenderChange,
  senders = ['Kunal', 'Priya', 'Rahul', 'Aman', 'Neha', 'Arjun', 'Simran', 'Riya'],
}) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const loadMessages = async (targetPage, isReset = false) => {
    if (isLoading && !isReset) return;
    setIsLoading(true);
    try {
      const response = await fetchMessages(targetPage, 40, {
        date: dateFilter,
        sender: senderFilter,
        sort: 'asc',
      });

      if (response && response.success) {
        setMessages((prev) => (targetPage === 1 ? response.data : [...prev, ...response.data]));
        setPage(response.page);
        setTotalPages(response.pages);
        setTotalMessages(response.total);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(1, true);
  }, [dateFilter, senderFilter]);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return '';
    }
  };

  let lastDate = null;
  const hasActiveFilters = Boolean(senderFilter || dateFilter);

  return (
    <div className="bg-white border border-[#E6E0D5] rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header section with Title, Subtitle, and Top-Right Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EFE9DF]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#252B20] tracking-tight">
            Conversation History
          </h2>
          <p className="text-xs sm:text-sm text-[#6C7562] mt-1">
            Browse your group chat conversations. Use filters to narrow down by participant or time.
          </p>
        </div>

        {/* Top-Right Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          {/* All Participants Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 pl-3 pr-8 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#DDD5C7] text-xs text-[#2A3124] cursor-pointer font-medium hover:border-[#8B9A6E] transition-colors">
              <Users className="w-3.5 h-3.5 text-[#7B8570]" />
              <select
                value={senderFilter}
                onChange={(e) => onSenderChange(e.target.value)}
                className="appearance-none bg-transparent text-[#2A3124] text-xs outline-none cursor-pointer pr-1"
              >
                <option value="" className="bg-[#FAF6F0] text-[#2A3124]">
                  All Participants
                </option>
                {senders.map((s) => (
                  <option key={s} value={s} className="bg-[#FAF6F0] text-[#2A3124]">
                    {s} {s === 'Kunal' ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7B8570] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Any Time Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 pl-3 pr-8 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#DDD5C7] text-xs text-[#2A3124] cursor-pointer font-medium hover:border-[#8B9A6E] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-[#7B8570]" />
              <select
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="appearance-none bg-transparent text-[#2A3124] text-xs outline-none cursor-pointer pr-1"
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#FAF6F0] text-[#2A3124]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7B8570] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSenderChange('');
                onDateChange('');
              }}
              className="text-xs text-[#8B9A6E] hover:text-[#65734A] transition-colors underline underline-offset-2 ml-1 cursor-pointer font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Dataset Summary Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-[#8B9A6E]/12 border border-[#8B9A6E]/25 flex items-center gap-2 text-xs text-[#485633] select-none font-medium">
        <MessageSquare className="w-3.5 h-3.5 text-[#8B9A6E] shrink-0" />
        <span>
          {totalMessages ? totalMessages.toLocaleString() : '4,500'}+ messages across 6 months • 8 participants • 3 decision threads
          {dateFilter && <strong className="text-[#252B20] ml-1">({dateFilter})</strong>}
          {senderFilter && <strong className="text-[#252B20] ml-1">({senderFilter})</strong>}
        </span>
      </div>

      {/* Message Stream */}
      <div className="space-y-3 pt-2" ref={scrollRef}>
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-16 text-[#7E8873] text-xs">
            No messages found for this filter combination.
          </div>
        )}

        {messages.map((msg, index) => {
          const dateStr = formatDate(msg.timestamp);
          const isNewDate = dateStr !== lastDate;
          if (isNewDate) {
            lastDate = dateStr;
          }

          const isMe = msg.sender?.toLowerCase() === 'kunal';
          const senderStyle = SENDER_STYLES[msg.sender] || {
            name: 'text-[#3B4333]',
            avatar: 'bg-[#8B9A6E] text-white',
          };
          const topic = getMessageTopic(msg);

          return (
            <React.Fragment key={msg._id || msg.id || index}>
              {/* Centered Date Separator */}
              {isNewDate && (
                <div className="flex items-center gap-3 my-5 select-none">
                  <div className="h-px bg-[#E5DFD4] flex-1" />
                  <span className="text-[11px] font-medium text-[#6B7460] font-mono px-3 py-0.5 rounded-full bg-[#F2ECE2] border border-[#DDD5C6]">
                    {dateStr}
                  </span>
                  <div className="h-px bg-[#E5DFD4] flex-1" />
                </div>
              )}

              {/* Message Row */}
              {isMe ? (
                /* Kunal's messages on the RIGHT side */
                <div className="flex justify-end my-1 px-1 sm:px-2">
                  <div className="max-w-[85%] sm:max-w-[75%] flex items-start gap-3 justify-end group">
                    {/* Message Card/Bubble in Sage Tint */}
                    <div className="rounded-2xl rounded-tr-sm bg-[#EDF3E8] border border-[#C6D5BD] p-3.5 sm:p-4 text-[#23291D] shadow-xs">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <span className="font-semibold text-[#506238] text-sm tracking-tight">
                          Kunal (You)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#76816B] font-mono">
                            {dateStr} • {formatTime(msg.timestamp)}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${topic.pill}`}
                          >
                            {topic.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#23291D] text-[14px] sm:text-[15px] leading-relaxed break-words font-normal select-text">
                        {msg.message}
                      </p>
                    </div>

                    {/* Avatar Circle on Right */}
                    <div
                      className="w-8 h-8 rounded-full bg-[#8B9A6E] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs mt-0.5"
                      title="Kunal (You)"
                    >
                      K
                    </div>
                  </div>
                </div>
              ) : (
                /* Other participants on the LEFT side */
                <div className="flex items-start gap-3 my-1 px-1 sm:px-2 justify-start group">
                  {/* Avatar Circle on Left */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs mt-0.5 select-none ${senderStyle.avatar}`}
                    title={msg.sender}
                  >
                    {msg.sender ? msg.sender.charAt(0) : '?'}
                  </div>

                  {/* Left Message Bubble/Card */}
                  <div className="flex-1 max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-sm bg-white border border-[#E6E0D5] hover:border-[#D4CBBF] p-3.5 sm:p-4 text-[#262D20] shadow-xs transition-colors">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <span className={`font-semibold text-sm tracking-tight ${senderStyle.name}`}>
                        {msg.sender}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#7A846E] font-mono">
                          {dateStr} • {formatTime(msg.timestamp)}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${topic.pill}`}
                        >
                          {topic.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#9DA793] group-hover:text-[#6E7764] transition-colors" />
                      </div>
                    </div>

                    <p className="text-[#282F22] text-[14px] sm:text-[15px] leading-relaxed break-words font-normal select-text">
                      {msg.message}
                    </p>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Load More Button */}
      <div className="pt-4 pb-2 flex justify-center">
        {page < totalPages ? (
          <button
            type="button"
            onClick={() => loadMessages(page + 1)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2ECE2] hover:bg-[#EAE3D6] border border-[#DDD5C6] hover:border-[#8B9A6E] text-xs font-medium text-[#445136] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#8B9A6E]" />
                <span>Loading messages...</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-[#737C68]" />
                <span>
                  Load more messages ({messages.length} of {totalMessages.toLocaleString()})
                </span>
              </>
            )}
          </button>
        ) : (
          totalMessages > 0 && (
            <div className="text-xs text-[#7B8570] font-mono">
              ✓ All {totalMessages.toLocaleString()} messages loaded
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;
