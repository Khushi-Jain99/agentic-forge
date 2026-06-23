import ReactMarkdown from 'react-markdown';
import { Youtube, FileText, Lightbulb } from 'lucide-react';

export default function YoutubeCard({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Analysis */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <Youtube size={18} className="text-red-400" />
          <h3 className="text-sm font-semibold text-white">Video Analysis</h3>
        </div>
        <div className="markdown-content text-sm">
          <ReactMarkdown>{data.analysis}</ReactMarkdown>
        </div>
      </div>

      {/* Summary & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-brand-400" />
            <h4 className="text-sm font-semibold text-zinc-300">Summary</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">{data.summary}</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-amber-400" />
            <h4 className="text-sm font-semibold text-zinc-300">Insights</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">{data.insights}</p>
        </div>
      </div>
    </div>
  );
}
