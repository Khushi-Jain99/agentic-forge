import axios from 'axios';

const getApiBase = () => {
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
};

const api = axios.create({
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to set baseURL dynamically
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBase();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

export const healthCheck = () => api.get('/health');

export const getAgents = () => api.get('/agents');

export const sendChat = (message, agentId = 'travel', userId = null, stream = false) =>
  api.post('/chat', { message, agent_id: agentId, user_id: userId, stream });

export const streamChat = async (message, agentId = 'travel', userId = null, onChunk) => {
  const response = await fetch(`${getApiBase()}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agent_id: agentId, user_id: userId, stream: true }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) onChunk(parsed.content);
          if (parsed.error) throw new Error(parsed.error);
        } catch (e) {
          if (e.message !== 'Unexpected end of JSON input') {
            console.error('Stream parse error:', e);
          }
        }
      }
    }
  }
};

export const analyzeFinance = (symbol) =>
  api.post('/finance-analysis', { symbol });

export const analyzeYoutube = (url) =>
  api.post('/youtube-analysis', { url });

export const getMemories = (userId = null, q = null, limit = 50, offset = 0) =>
  api.get('/memory', { params: { user_id: userId, q, limit, offset } });

export const searchMemories = (query, userId = null) =>
  api.post('/memory/search', { query, user_id: userId });

export default api;
