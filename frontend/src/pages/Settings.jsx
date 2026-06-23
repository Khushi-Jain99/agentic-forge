import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings as SettingsIcon, User, Database, Globe, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { healthCheck } from '../services/api';

export default function Settings() {
  const { addToast } = useOutletContext();
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id') || 'rahul@gmail.com');
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('api_url') || '/api');
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [loadingHealth, setLoadingHealth] = useState(false);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await healthCheck();
      if (res.data?.status === 'healthy') {
        setSystemStatus('Online');
        setDbStatus(res.data.database_connected ? 'Connected' : 'Disconnected');
      } else {
        setSystemStatus('Offline');
        setDbStatus('Offline');
      }
    } catch (err) {
      setSystemStatus('Offline');
      setDbStatus('Offline');
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('user_id', userId.trim());
    localStorage.setItem('api_url', apiUrl.trim());
    addToast('Settings saved successfully', 'success');
  };

  const handleReset = () => {
    setUserId('rahul@gmail.com');
    setApiUrl('/api');
    localStorage.setItem('user_id', 'rahul@gmail.com');
    localStorage.setItem('api_url', '/api');
    addToast('Settings reset to defaults', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Settings Form */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon size={20} className="text-brand-400" />
          <h2 className="text-base font-semibold text-white">General Settings</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-zinc-500" />
              Default User ID
            </label>
            <input
              type="email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user@example.com"
              className="input-field"
              required
            />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              This email is used to retrieve your cognitive profile and persistent user memories from backend database.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={13} className="text-zinc-500" />
              Backend API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="e.g. /api"
              className="input-field"
            />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Vite dev server proxies `/api` to the backend locally. Modify if running on a standalone address.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-xs px-5 py-2.5">
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary text-xs px-5 py-2.5"
            >
              Reset Defaults
            </button>
          </div>
        </form>
      </div>

      {/* Diagnostics / System Health */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-violet-400" />
            <h2 className="text-base font-semibold text-white">System Diagnostics</h2>
          </div>
          <button
            onClick={checkHealth}
            disabled={loadingHealth}
            className="btn-ghost text-xs p-1.5 hover:bg-white/[0.04] transition-colors"
          >
            <RefreshCw size={14} className={loadingHealth ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <span className="text-sm text-zinc-400">Server Health Status</span>
            <div className="flex items-center gap-2">
              {systemStatus === 'Online' ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">{systemStatus}</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-xs font-semibold text-red-400">{systemStatus}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <span className="text-sm text-zinc-400">SQLite SQLite Connection</span>
            <div className="flex items-center gap-2">
              {dbStatus === 'Connected' ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">{dbStatus}</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-xs font-semibold text-red-400">{dbStatus}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
