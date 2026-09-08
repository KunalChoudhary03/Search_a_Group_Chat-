import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import ConversationHistory from '../components/ConversationHistory';
import SearchResult from '../components/SearchResult';
import { checkHealth, fetchStats, searchChat, fetchMessageContext } from '../services/api';
import { Loader2, AlertCircle, MessageSquare } from 'lucide-react';

export const Home = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'search'
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [results, setResults] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    try {
      const statsData = await fetchStats();
      if (statsData) setStats(statsData);
    } catch (e) {
      console.error('Could not fetch stats', e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSearch = async (targetQuery = query) => {
    const trimmed = targetQuery.trim();
    if (!trimmed) return;

    setActiveTab('search');
    setSearchedQuery(trimmed);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await searchChat(trimmed, {
        sender: senderFilter,
        date: dateFilter,
      });

      if (response && response.success) {
        setResults(response.results || []);
        setTotalCandidates(response.totalCandidates || 0);
        if ((response.results || []).length === 0) {
          setErrorMessage(
            `No matching messages found for "${trimmed}" in ${dateFilter || 'the dataset'}${
              senderFilter ? ' by ' + senderFilter : ''
            }.`
          );
        }
      } else {
        setErrorMessage(
          response?.error || 'Unable to complete search. Make sure local search engine is running.'
        );
        setResults([]);
        setTotalCandidates(0);
      }
    } catch (err) {
      setErrorMessage('Communication error with local search engine.');
      setResults([]);
      setTotalCandidates(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F7F2EB] text-[#252B20] flex overflow-hidden font-sans selection:bg-[#8B9A6E]/30 selection:text-[#3B462C]">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        senderFilter={senderFilter}
        onSenderFilterChange={setSenderFilter}
        totalMessages={stats?.totalMessages || 4600}
        participantCount={stats?.participantCount || 8}
        decisionCount={stats?.decisionThreads?.length || 3}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavbar
          query={query}
          onQueryChange={setQuery}
          onSearch={() => handleSearch()}
          isLoading={isLoading}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F2EB]">
          <div className="max-w-6xl mx-auto">
            {/* Notice / Error banner */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#FDF0EE] border border-[#F5C7C0] text-[#8F392B] text-xs flex items-center gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 text-[#D3523D] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {activeTab === 'chat' ? (
              /* Conversation History Hero (WhatsApp-Style with Kunal on Right, others on Left) */
              <ConversationHistory
                stats={stats}
                dateFilter={dateFilter}
                senderFilter={senderFilter}
                onDateChange={setDateFilter}
                onSenderChange={setSenderFilter}
                senders={
                  stats?.participants || [
                    'Kunal',
                    'Priya',
                    'Rahul',
                    'Aman',
                    'Neha',
                    'Arjun',
                    'Simran',
                    'Riya',
                  ]
                }
              />
            ) : (
              /* Search Results Panel */
              <div className="bg-white border border-[#E6E0D5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="pb-4 border-b border-[#EFE9DF] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#252B20] tracking-tight">
                      Search Results
                    </h2>
                    <p className="text-xs text-[#6C7562] mt-1">
                      Semantic results for <strong className="text-[#51633A] font-semibold">"{searchedQuery}"</strong>
                      {dateFilter && ` in ${dateFilter}`}
                      {senderFilter && ` by ${senderFilter}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {!isLoading && results.length > 0 && (
                      <span className="text-xs font-mono text-[#78826D]">
                        {results.length} matches · sorted by similarity ({totalCandidates} candidates evaluated)
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="text-xs text-[#8B9A6E] hover:text-[#5F6C47] transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Back to Chat</span>
                    </button>
                  </div>
                </div>

                {/* Search Body */}
                {isLoading ? (
                  <div className="py-20 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8B9A6E] mx-auto" />
                    <p className="text-xs text-[#6E7764] font-mono">
                      Generating query embedding & computing exact cosine similarities...
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y divide-[#EFE9DF]">
                    {results.map((item, index) => (
                      <SearchResult
                        key={item._id || item.id || index}
                        result={item}
                        activeDateFilter={dateFilter}
                        onFetchContext={fetchMessageContext}
                      />
                    ))}
                  </div>
                ) : !errorMessage ? (
                  <div className="py-16 text-center text-[#7E8873] text-xs">
                    Type a query in the top search bar to search across 4,500+ messages by meaning.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
