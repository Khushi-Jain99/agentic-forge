import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bot, Layers, ShieldCheck } from 'lucide-react';
import { getAgents } from '../services/api';
import AgentCard from '../components/AgentCard';
import Loader from '../components/Loader';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getAgents();
        setAgents(res.data);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loader size="lg" text="Loading agents..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-brand-950/20 to-violet-950/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Users size={20} className="text-brand-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">AI Agents Fleet</h2>
            <p className="text-xs text-zinc-400">
              Overview of specialized agents running on the platform, their backend configurations, and tools.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/chat?agent=${agent.id}`)}
          >
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold">
            <Bot size={16} />
            <span>Autonomous Logic</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Each agent has custom prompts and specialized settings, running fully isolated or collaborating with teams.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold">
            <Layers size={16} />
            <span>Model Capabilities</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Powered by high-parameter open models (Qwen3-32B) for high-fidelity response generation and tool execution.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <ShieldCheck size={16} />
            <span>Secured Integrations</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Directly connected to tools like DuckDuckGo search, Yahoo Finance, SQLite databases, and YouTube scrapers.
          </p>
        </div>
      </div>
    </div>
  );
}
