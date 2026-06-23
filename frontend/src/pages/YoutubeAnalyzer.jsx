import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Youtube, Link2, Loader2 } from 'lucide-react';
import { analyzeYoutube } from '../services/api';
import YoutubeCard from '../components/YoutubeCard';
import EmptyState from '../components/EmptyState';

export default function YoutubeAnalyzer() {
  const { addToast } = useOutletContext();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const videoUrl = url.trim();
    if (!videoUrl) return;

    // Basic URL validation
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      addToast('Please enter a valid YouTube URL', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeYoutube(videoUrl);
      setResult(res.data);
      addToast('Video analysis complete!', 'success');
    } catch (error) {
      addToast('Failed to analyze video', 'error');
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
          <Youtube size={20} className="text-red-400" />
          <h2 className="text-base font-semibold text-white">YouTube Video Analyzer</h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste YouTube video URL here..."
              className="input-field pl-10"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Video'
            )}
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-3">
          Paste any YouTube video link to get a detailed analysis, timestamps, and content summary.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-panel p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-red-500/30 border-t-red-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">Analyzing video...</p>
            <p className="text-xs text-zinc-500 mt-1">Extracting transcript, timestamps, and key insights</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && result && <YoutubeCard data={result} />}

      {/* Empty State */}
      {!loading && !result && (
        <EmptyState
          icon={Youtube}
          title="Paste a YouTube link"
          description="Enter a YouTube video URL above to get comprehensive analysis including timestamps, content structure, summaries, and key takeaways."
        />
      )}
    </div>
  );
}
