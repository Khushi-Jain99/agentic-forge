import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Search, Loader2 } from 'lucide-react';
import { analyzeFinance } from '../services/api';
import FinanceCard from '../components/FinanceCard';
import EmptyState from '../components/EmptyState';

const popularStocks = ['NVDA', 'AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'META'];

export default function FinanceAnalyzer() {
  const { addToast } = useOutletContext();
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (ticker = null) => {
    const sym = (ticker || symbol).trim().toUpperCase();
    if (!sym) return;

    setSymbol(sym);
    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeFinance(sym);
      setResult(res.data);
      addToast(`Analysis complete for ${sym}`, 'success');
    } catch (error) {
      addToast(`Failed to analyze ${sym}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Input Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-white">Stock Analysis</h2>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Enter stock symbol (e.g., NVDA, AAPL)"
              className="input-field pl-10"
              disabled={loading}
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={!symbol.trim() || loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {/* Popular Stocks */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500 py-1">Popular:</span>
          {popularStocks.map((stock) => (
            <button
              key={stock}
              onClick={() => handleAnalyze(stock)}
              disabled={loading}
              className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-50"
            >
              {stock}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-panel p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">Analyzing {symbol}...</p>
            <p className="text-xs text-zinc-500 mt-1">Fetching stock prices and analyst recommendations</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && result && <FinanceCard data={result} />}

      {/* Empty State */}
      {!loading && !result && (
        <EmptyState
          icon={TrendingUp}
          title="Enter a stock symbol"
          description="Type a ticker symbol like NVDA or AAPL above to get detailed stock analysis, pricing data, and analyst recommendations."
        />
      )}
    </div>
  );
}
