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
  Kunal: { name: 'text-[#008069]', avatar: 'bg-[#008069] text-white' },
  Priya: { name: 'text-[#D33E76]', avatar: 'bg-[#D33E76] text-white' },
  Rahul: { name: 'text-[#007BFC]', avatar: 'bg-[#007BFC] text-white' },
  Aman: { name: 'text-[#E36D00]', avatar: 'bg-[#E36D00] text-white' },
  Neha: { name: 'text-[#8A3FFC]', avatar: 'bg-[#8A3FFC] text-white' },
  Arjun: { name: 'text-[#009688]', avatar: 'bg-[#009688] text-white' },
  Simran: { name: 'text-[#C27803]', avatar: 'bg-[#C27803] text-white font-bold' },
  Riya: { name: 'text-[#1F883D]', avatar: 'bg-[#1F883D] text-white' },
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
    return { label: 'Trip Planning', pill: 'text-[#008069] bg-[#E8F7F3] border-[#B2E5D9]' };
  }
  if (msg.threadId === 'college_event') {
    return { label: 'HackCon', pill: 'text-[#8A3FFC] bg-[#F4EDFF] border-[#DEC9FB]' };
  }
  if (msg.threadId === 'project_stack') {
    return { label: 'Project Dev', pill: 'text-[#007BFC] bg-[#EBF4FF] border-[#C2DEFF]' };
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
    return { label: 'Exams', pill: 'text-[#8A3FFC] bg-[#F4EDFF] border-[#DEC9FB]' };
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
    return { label: 'Files', pill: 'text-[#007BFC] bg-[#EBF4FF] border-[#C2DEFF]' };
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
    return { label: 'Trip Planning', pill: 'text-[#008069] bg-[#E8F7F3] border-[#B2E5D9]' };
  }
  if (
    text.includes('canteen') ||
    text.includes('maggi') ||
    text.includes('roll') ||
    text.includes('dhaba') ||
    text.includes('dinner') ||
    text.includes('chai')
  ) {
    return { label: 'Hangout', pill: 'text-[#E36D00] bg-[#FFF3E8] border-[#FCD7B5]' };
  }
  return { label: 'General', pill: 'text-[#54656F] bg-[#F0F2F5] border-[#D1D7DB]' };
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
    <div className="bg-white border border-[#D1D7DB] rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header section with Title, Subtitle, and Top-Right Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E9EDEF]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111B21] tracking-tight">
            Conversation History
          </h2>
          <p className="text-xs sm:text-sm text-[#667781] mt-1">
            Browse your group chat conversations. Use filters to narrow down by participant or time.
          </p>
        </div>

        {/* Top-Right Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          {/* All Participants Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 pl-3 pr-8 py-1.5 rounded-xl bg-[#F0F2F5] border border-[#D1D7DB] text-xs text-[#111B21] cursor-pointer font-medium hover:border-[#00A884] transition-colors">
              <Users className="w-3.5 h-3.5 text-[#54656F]" />
              <select
                value={senderFilter}
                onChange={(e) => onSenderChange(e.target.value)}
                className="appearance-none bg-transparent text-[#111B21] text-xs outline-none cursor-pointer pr-1"
              >
                <option value="" className="bg-[#F0F2F5] text-[#111B21]">
                  All Participants
                </option>
                {senders.map((s) => (
                  <option key={s} value={s} className="bg-[#F0F2F5] text-[#111B21]">
                    {s} {s === 'Kunal' ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#54656F] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Any Time Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 pl-3 pr-8 py-1.5 rounded-xl bg-[#F0F2F5] border border-[#D1D7DB] text-xs text-[#111B21] cursor-pointer font-medium hover:border-[#00A884] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-[#54656F]" />
              <select
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="appearance-none bg-transparent text-[#111B21] text-xs outline-none cursor-pointer pr-1"
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#F0F2F5] text-[#111B21]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#54656F] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSenderChange('');
                onDateChange('');
              }}
              className="text-xs text-[#008069] hover:text-[#005C4B] transition-colors underline underline-offset-2 ml-1 cursor-pointer font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Dataset Summary Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-[#E8F7F3] border border-[#B2E5D9] flex items-center gap-2 text-xs text-[#008069] select-none font-medium">
        <MessageSquare className="w-3.5 h-3.5 text-[#008069] shrink-0" />
        <span>
          {totalMessages ? totalMessages.toLocaleString() : '4,500'}+ messages across 6 months • 8 participants • 3 decision threads
          {dateFilter && <strong className="text-[#111B21] ml-1">({dateFilter})</strong>}
          {senderFilter && <strong className="text-[#111B21] ml-1">({senderFilter})</strong>}
        </span>
      </div>

      {/* Message Stream */}
      <div className="space-y-3 pt-2" ref={scrollRef}>
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-16 text-[#667781] text-xs">
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
            name: 'text-[#111B21]',
            avatar: 'bg-[#008069] text-white',
          };
          const topic = getMessageTopic(msg);

          return (
            <React.Fragment key={msg._id || msg.id || index}>
              {/* Centered Date Separator */}
              {isNewDate && (
                <div className="flex items-center gap-3 my-5 select-none">
                  <div className="h-px bg-[#D1D7DB] flex-1" />
                  <span className="text-[11px] font-medium text-[#54656F] font-mono px-3 py-0.5 rounded-full bg-white border border-[#D1D7DB] shadow-xs">
                    {dateStr}
                  </span>
                  <div className="h-px bg-[#D1D7DB] flex-1" />
                </div>
              )}

              {/* Message Row */}
              {isMe ? (
                /* Kunal's messages on the RIGHT side - Outgoing Bubble */
                <div className="flex justify-end my-1 px-1 sm:px-2">
                  <div className="max-w-[85%] sm:max-w-[75%] flex items-start gap-3 justify-end group">
                    {/* Outgoing Message Card/Bubble in Light Green Tint */}
                    <div className="rounded-2xl rounded-tr-xs bg-[#D9FDD3] border border-[#C3E7B8] p-3.5 sm:p-4 text-[#111B21] shadow-xs">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <span className="font-semibold text-[#008069] text-sm tracking-tight">
                          Kunal (You)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#667781] font-mono">
                            {dateStr} • {formatTime(msg.timestamp)}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${topic.pill}`}
                          >
                            {topic.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#111B21] text-[14px] sm:text-[15px] leading-relaxed break-words font-normal select-text">
                        {msg.message}
                      </p>
                    </div>

                    {/* Avatar Circle on Right */}
                    <div
                      className="w-8 h-8 rounded-full bg-[#008069] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs mt-0.5"
                      title="Kunal (You)"
                    >
                      K
                    </div>
                  </div>
                </div>
              ) : (
                /* Other participants on the LEFT side - Incoming Bubble */
                <div className="flex items-start gap-3 my-1 px-1 sm:px-2 justify-start group">
                  {/* Avatar Circle on Left */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs mt-0.5 select-none ${senderStyle.avatar}`}
                    title={msg.sender}
                  >
                    {msg.sender ? msg.sender.charAt(0) : '?'}
                  </div>

                  {/* Left Message Bubble/Card */}
                  <div className="flex-1 max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-xs bg-white border border-[#E9EDEF] hover:border-[#D1D7DB] p-3.5 sm:p-4 text-[#111B21] shadow-xs transition-colors">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <span className={`font-semibold text-sm tracking-tight ${senderStyle.name}`}>
                        {msg.sender}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#667781] font-mono">
                          {dateStr} • {formatTime(msg.timestamp)}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${topic.pill}`}
                        >
                          {topic.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8696A0] group-hover:text-[#54656F] transition-colors" />
                      </div>
                    </div>

                    <p className="text-[#111B21] text-[14px] sm:text-[15px] leading-relaxed break-words font-normal select-text">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F0F2F5] hover:bg-[#E9EDEF] border border-[#D1D7DB] hover:border-[#008069] text-xs font-medium text-[#111B21] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#008069]" />
                <span>Loading messages...</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-[#54656F]" />
                <span>
                  Load more messages ({messages.length} of {totalMessages.toLocaleString()})
                </span>
              </>
            )}
          </button>
        ) : (
          totalMessages > 0 && (
            <div className="text-xs text-[#667781] font-mono">
              ✓ All {totalMessages.toLocaleString()} messages loaded
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;
