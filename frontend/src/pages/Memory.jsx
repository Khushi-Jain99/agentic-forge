import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Brain, Search, User, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMemories } from '../services/api';
import MemoryTable from '../components/MemoryTable';
import Loader from '../components/Loader';

export default function Memory() {
  const { addToast } = useOutletContext();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [limit] = useState(15);
  const [offset, setOffset] = useState(0);
  const [totalCountEstimate, setTotalCountEstimate] = useState(0);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      // Use getMemories with user_id, search term, limit, and offset
      const res = await getMemories(
        userIdFilter.trim() || null,
        searchQuery.trim() || null,
        limit,
        offset
      );
      setMemories(res.data);
      // If we got exactly 'limit' number of items, there might be more on next pages
      setTotalCountEstimate(res.data.length);
    } catch (error) {
      addToast('Failed to load memories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [offset, userIdFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setOffset(0); // reset page
    fetchMemories();
  };

  const handleRefresh = () => {
    fetchMemories();
    addToast('Memories refreshed', 'success');
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const handleNextPage = () => {
    if (memories.length === limit) {
      setOffset(offset + limit);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={20} className="text-brand-400" />
            <h2 className="text-base font-semibold text-white font-sans">Cognitive Memory Store</h2>
          </div>
          <p className="text-xs text-zinc-400">
            View facts, preferences, and details learned by AI agents over time.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-secondary self-start md:self-auto text-xs py-2 px-3 gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Form */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory text..."
            className="input-field pl-10"
          />
        </div>

        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            placeholder="Filter by User ID (e.g. rahul@gmail.com)"
            className="input-field pl-10"
          />
        </div>

        <button type="submit" className="btn-primary text-sm py-3">
          Apply Filters
        </button>
      </form>

      {/* Main Table Content */}
      {loading ? (
        <Loader size="lg" text="Loading memories..." />
      ) : (
        <>
          <MemoryTable memories={memories} searchQuery={searchQuery} />

          {/* Pagination Controls */}
          {memories.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500 font-mono">
                Showing entries {offset + 1} - {offset + memories.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className="btn-secondary text-xs px-3 py-1.5 gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={memories.length < limit}
                  className="btn-secondary text-xs px-3 py-1.5 gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
