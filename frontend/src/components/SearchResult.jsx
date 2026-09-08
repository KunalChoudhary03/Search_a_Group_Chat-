import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import MessageContext from './MessageContext';

export const SearchResult = ({ result, onFetchContext, activeDateFilter = '' }) => {
  const [showContext, setShowContext] = useState(false);
  const [contextData, setContextData] = useState(result.context || null);
  const [loadingContext, setLoadingContext] = useState(false);

  const handleToggleContext = async () => {
    if (showContext) {
      setShowContext(false);
      return;
    }

    if (!contextData && onFetchContext) {
      setLoadingContext(true);
      try {
        const data = await onFetchContext(result._id || result.id, 2, activeDateFilter);
        setContextData(data);
      } finally {
        setLoadingContext(false);
      }
    } else if (!contextData && result.context) {
      setContextData(result.context);
    }

    setShowContext(true);
  };

  const formattedDate = result.timestamp
    ? new Date(result.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = result.timestamp
    ? new Date(result.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const scoreFormatted =
    result.similarity !== undefined ? Number(result.similarity).toFixed(2) : null;

  return (
    <div className="group border-b border-[#EFE9DF] last:border-b-0 py-4 px-3 sm:px-4 rounded-xl hover:bg-[#FAF6F0] transition-colors">
      <div className="space-y-2">
        {/* Header: Sender + Timestamp */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-semibold text-[#252B20] text-[14px] sm:text-[15px] tracking-tight">
              {result.sender === 'Kunal' ? 'Kunal (You)' : result.sender}
            </span>
            <span className="text-[12px] text-[#7A846E] font-mono">
              {formattedDate} · {formattedTime}
            </span>
            {result.messageType === 'decision' && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#526639] bg-[#EDF3E8] border border-[#C6D5BD] px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3" /> decision
              </span>
            )}
          </div>
        </div>

        {/* Message Text */}
        <p className="text-[#2C3325] text-[15px] sm:text-[16px] leading-relaxed font-normal select-text">
          "{result.message}"
        </p>

        {/* Metadata & Context Toggle */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="text-[#7A846E] font-mono text-[12px]">
            {scoreFormatted !== null && (
              <span>Semantic similarity: <strong className="text-[#3D4733] font-medium">{scoreFormatted}</strong></span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleContext}
            disabled={loadingContext}
            className="inline-flex items-center gap-1 text-xs text-[#8B9A6E] hover:text-[#5F6C47] font-semibold transition-colors cursor-pointer"
          >
            {loadingContext ? (
              <span className="text-[#7A846E]">Loading context...</span>
            ) : showContext ? (
              <>
                <span>Hide context</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show context</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Expandable Inline Context */}
        {showContext && (contextData || result.context) && (
          <div className="pt-2">
            <MessageContext context={contextData || result.context} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
