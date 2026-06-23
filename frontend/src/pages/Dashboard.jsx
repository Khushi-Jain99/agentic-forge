import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  TrendingUp,
  Youtube,
  Brain,
  Users,
  ArrowRight,
  Activity,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getAgents, getMemories, healthCheck } from '../services/api';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [memories, setMemories] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [agentsRes, memoriesRes, healthRes] = await Promise.allSettled([
          getAgents(),
          getMemories(null, null, 5),
          healthCheck(),
        ]);
        if (agentsRes.status === 'fulfilled') setAgents(agentsRes.value.data);
        if (memoriesRes.status === 'fulfilled') setMemories(memoriesRes.value.data);
        if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader size="lg" text="Loading dashboard..." />;

  const stats = [
    {
      label: 'Active Agents',
      value: agents.length,
      icon: Users,
      color: 'from-brand-500 to-violet-600',
      iconBg: 'bg-brand-500/15',
      iconColor: 'text-brand-400',
    },
    {
      label: 'Stored Memories',
      value: memories.length,
      icon: Brain,
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'System Status',
      value: health?.status === 'healthy' ? 'Online' : 'Offline',
      icon: Activity,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
    },
    {
      label: 'AI Model',
      value: 'Qwen3-32B',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-500/15',
      iconColor: 'text-pink-400',
    },
  ];

  const quickActions = [
    { label: 'Start Chat', icon: MessageSquare, to: '/chat', desc: 'Talk with AI agents', gradient: 'from-brand-600/20 to-violet-600/20' },
    { label: 'Analyze Stock', icon: TrendingUp, to: '/finance', desc: 'Financial analysis', gradient: 'from-emerald-600/20 to-teal-600/20' },
    { label: 'Analyze Video', icon: Youtube, to: '/youtube', desc: 'YouTube insights', gradient: 'from-red-600/20 to-rose-600/20' },
    { label: 'View Memory', icon: Brain, to: '/memory', desc: 'Stored memories', gradient: 'from-amber-600/20 to-orange-600/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-brand-950/40 to-violet-950/40 border-brand-500/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Welcome to Agentic AI</h2>
            <p className="text-sm text-zinc-400">Your AI-powered multi-agent command center</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.iconColor} />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="section-title mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`glass-panel-hover p-4 group bg-gradient-to-br ${action.gradient}`}
            >
              <action.icon size={20} className="text-white mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold text-white mb-0.5">{action.label}</h4>
              <p className="text-xs text-zinc-400">{action.desc}</p>
              <ArrowRight size={14} className="text-zinc-600 mt-2 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      {memories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Recent Memories</h3>
            <Link to="/memory" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {memories.map((mem) => (
              <div key={mem.memory_id} className="glass-panel px-4 py-3 flex items-center gap-3">
                <Brain size={14} className="text-brand-400 flex-shrink-0" />
                <span className="text-sm text-zinc-300 flex-1 truncate">{mem.memory}</span>
                <span className="text-[11px] text-zinc-600 font-mono flex-shrink-0">{mem.user_id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
