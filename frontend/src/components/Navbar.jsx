import { Menu, Search, Bell } from 'lucide-react';

export default function Navbar({ onMenuClick, title }) {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-500 text-sm min-w-[200px] transition-colors hover:border-white/[0.12]">
          <Search size={14} />
          <span className="text-zinc-500">Search...</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-500 border border-white/[0.08]">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-brand-500/30 transition-all">
          U
        </div>
      </div>
    </header>
  );
}
