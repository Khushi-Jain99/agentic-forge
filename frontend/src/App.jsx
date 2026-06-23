import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import FinanceAnalyzer from './pages/FinanceAnalyzer';
import YoutubeAnalyzer from './pages/YoutubeAnalyzer';
import Memory from './pages/Memory';
import Agents from './pages/Agents';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="finance" element={<FinanceAnalyzer />} />
          <Route path="youtube" element={<YoutubeAnalyzer />} />
          <Route path="memory" element={<Memory />} />
          <Route path="agents" element={<Agents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
