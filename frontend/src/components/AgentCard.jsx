import { Bot, Zap, ChevronRight } from 'lucide-react';

export default function AgentCard({ agent }) {
  const statusColors = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
    error: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  return (
    <div className="glass-panel-hover p-5 group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-brand-500/20 flex items-center justify-center">
          <Bot size={20} className="text-brand-400" />
        </div>
        <span className={`badge border ${statusColors[agent.status] || statusColors.active}`}>
          {agent.status}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">
        {agent.name}
      </h3>
      <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
        {agent.description}
      </p>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.capabilities?.slice(0, 3).map((cap, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-zinc-400 border border-white/[0.06]">
            <Zap size={9} className="text-amber-400" />
            {cap}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span className="text-[11px] text-zinc-500 font-mono">{agent.model}</span>
        <ChevronRight size={14} className="text-zinc-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
