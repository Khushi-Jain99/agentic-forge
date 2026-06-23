import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

const pageTitles = {
  '/': 'Dashboard',
  '/chat': 'AI Chat',
  '/finance': 'Finance Analyzer',
  '/youtube': 'YouTube Analyzer',
  '/memory': 'Memory Viewer',
  '/agents': 'Agents Overview',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();

  const title = pageTitles[location.pathname] || 'Agentic AI';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet context={{ addToast }} />
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
