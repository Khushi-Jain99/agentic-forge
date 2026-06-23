import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Youtube,
  Brain,
  Users,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/finance', icon: TrendingUp, label: 'Finance' },
  { to: '/youtube', icon: Youtube, label: 'YouTube' },
  { to: '/memory', icon: Brain, label: 'Memory' },
  { to: '/agents', icon: Users, label: 'Agents' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-surface-950/95 backdrop-blur-2xl border-r border-white/[0.06]
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Agentic AI
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 shadow-sm shadow-brand-500/5'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`
              }
            >
              <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">Platform v1.0</p>
              <p className="text-[11px] text-zinc-500">Powered by Agno</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
