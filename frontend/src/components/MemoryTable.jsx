import { Brain, User, Clock, Search } from 'lucide-react';
import EmptyState from './EmptyState';

function formatTimestamp(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function MemoryTable({ memories = [], searchQuery = '' }) {
  if (memories.length === 0) {
    return (
      <EmptyState
        icon={Brain}
        title="No memories found"
        description={
          searchQuery
            ? `No memories matching "${searchQuery}"`
            : 'Memory records will appear here once the AI agents store them.'
        }
      />
    );
  }

  return (
    <div className="glass-panel overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Memory</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Input</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {memories.map((mem) => (
              <tr
                key={mem.memory_id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-2.5">
                    <Brain size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300 leading-relaxed">{mem.memory}</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm text-zinc-500 line-clamp-2">{mem.input || '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-zinc-500" />
                    <span className="text-xs font-mono text-zinc-400">{mem.user_id || '—'}</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-zinc-600" />
                    <span className="text-xs text-zinc-500">{formatTimestamp(mem.created_at)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
