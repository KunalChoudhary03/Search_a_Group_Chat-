import React from 'react';

export const MessageContext = ({ context }) => {
  if (!context) return null;

  const { before = [], target, after = [], boundary } = context;

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#EFE9DF] text-xs space-y-2.5">
      <div className="text-[11px] font-mono uppercase tracking-wider text-[#79836E]">
        Conversation Context (Chronological)
      </div>

      <div className="space-y-1.5 border-l-2 border-[#D8D0C3] pl-3.5 my-2">
        {/* Month start boundary */}
        {boundary?.reachedMonthStart && (
          <div className="text-[11px] text-[#7A846E] font-mono py-0.5 italic">
            Beginning of month boundary reached
          </div>
        )}

        {/* Messages Before */}
        {before.length > 0 && (
          <div className="text-[11px] text-[#7A846E] font-mono pt-1">
            {before.length} message{before.length > 1 ? 's' : ''} before
          </div>
        )}

        {before.map((msg) => (
          <div key={msg._id || msg.id} className="py-1 text-[#2C3325]">
            <div className="flex items-baseline gap-2">
              <span className={`font-semibold text-xs ${msg.sender === 'Kunal' ? 'text-[#506238]' : 'text-[#252B20]'}`}>
                {msg.sender === 'Kunal' ? 'Kunal (You)' : msg.sender}:
              </span>
              <span className="text-[11px] text-[#7A846E] font-mono">
                {formatDate(msg.timestamp)} · {formatTime(msg.timestamp)}
              </span>
            </div>
            <p className="text-[13px] text-[#3A4333] leading-snug mt-0.5">{msg.message}</p>
          </div>
        ))}

        {/* Matched Message Highlight */}
        {target && (
          <div className="my-2 p-3 rounded-xl bg-[#EDF3E8] border border-[#8B9A6E]/60 text-[#252B20] shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-xs ${target.sender === 'Kunal' ? 'text-[#506238]' : 'text-[#252B20]'}`}>
                  {target.sender === 'Kunal' ? 'Kunal (You)' : target.sender}:
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#8B9A6E] text-white font-bold tracking-wider">
                  MATCH
                </span>
              </div>
              <span className="text-[11px] text-[#69745C] font-mono">
                {formatDate(target.timestamp)} · {formatTime(target.timestamp)}
              </span>
            </div>
            <p className="text-[14px] text-[#20271A] font-medium leading-snug">{target.message}</p>
          </div>
        )}

        {/* Messages After */}
        {after.length > 0 && (
          <div className="text-[11px] text-[#7A846E] font-mono pt-1">
            {after.length} message{after.length > 1 ? 's' : ''} after
          </div>
        )}

        {after.map((msg) => (
          <div key={msg._id || msg.id} className="py-1 text-[#2C3325]">
            <div className="flex items-baseline gap-2">
              <span className={`font-semibold text-xs ${msg.sender === 'Kunal' ? 'text-[#506238]' : 'text-[#252B20]'}`}>
                {msg.sender === 'Kunal' ? 'Kunal (You)' : msg.sender}:
              </span>
              <span className="text-[11px] text-[#7A846E] font-mono">
                {formatDate(msg.timestamp)} · {formatTime(msg.timestamp)}
              </span>
            </div>
            <p className="text-[13px] text-[#3A4333] leading-snug mt-0.5">{msg.message}</p>
          </div>
        ))}

        {/* Month end boundary */}
        {boundary?.reachedMonthEnd && (
          <div className="text-[11px] text-[#7A846E] font-mono py-0.5 italic">
            End of month boundary reached
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContext;
