import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Send, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { streamChat, sendChat } from '../services/api';
import MessageBubble from '../components/MessageBubble';
import EmptyState from '../components/EmptyState';
import { MessageSquare } from 'lucide-react';

const agentOptions = [
  { id: 'travel', label: 'Travel Agent', emoji: '✈️' },
  { id: 'team', label: 'Translation Team', emoji: '🌍' },
  { id: 'finance', label: 'Finance Analyst', emoji: '📊' },
  { id: 'youtube', label: 'YouTube Analyzer', emoji: '🎥' },
  { id: 'memory', label: 'Memory Agent', emoji: '🧠' },
];

export default function Chat() {
  const { addToast } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAgent = searchParams.get('agent') || 'travel';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(() => {
    return agentOptions.some((a) => a.id === initialAgent) ? initialAgent : 'travel';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isLoading) return;

    const userMessage = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add an empty assistant message for streaming
    const assistantIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

    try {
      const userId = localStorage.getItem('user_id') || 'rahul@gmail.com';
      let fullContent = '';
      await streamChat(msg, selectedAgent, userId, (chunk) => {
        fullContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = { role: 'assistant', content: fullContent, isStreaming: true };
          return updated;
        });
      });

      // Mark streaming complete
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = { role: 'assistant', content: fullContent, isStreaming: false };
        return updated;
      });
    } catch (error) {
      // Fallback to non-streaming
      try {
        const userId = localStorage.getItem('user_id') || 'rahul@gmail.com';
        const res = await sendChat(msg, selectedAgent, userId);
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = { role: 'assistant', content: res.data.response, isStreaming: false };
          return updated;
        });
      } catch (fallbackError) {
        addToast('Failed to get response from agent', 'error');
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = {
            role: 'assistant',
            content: '⚠️ Sorry, I encountered an error processing your request. Please try again.',
            isStreaming: false,
          };
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    addToast('Chat history cleared', 'info');
  };

  const currentAgent = agentOptions.find((a) => a.id === selectedAgent);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Agent Picker */}
        <div className="relative">
          <button
            onClick={() => setShowAgentPicker(!showAgentPicker)}
            className="btn-secondary text-xs gap-1.5"
          >
            <span>{currentAgent?.emoji}</span>
            <span>{currentAgent?.label}</span>
            <ChevronDown size={14} className={`transition-transform ${showAgentPicker ? 'rotate-180' : ''}`} />
          </button>

          {showAgentPicker && (
            <div className="absolute top-full left-0 mt-2 w-56 glass-panel p-1.5 z-50 animate-slide-up">
              {agentOptions.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setShowAgentPicker(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                    ${selectedAgent === agent.id
                      ? 'bg-brand-600/15 text-brand-400'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <span>{agent.emoji}</span>
                  <span>{agent.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-ghost text-xs text-zinc-500">
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Start a conversation"
              description={`Send a message to the ${currentAgent?.label} to get started. You can switch agents anytime.`}
            />
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel p-3 flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${currentAgent?.label}...`}
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none resize-none max-h-32 py-2"
          style={{ minHeight: '40px' }}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-white/[0.06] disabled:text-zinc-600 flex items-center justify-center text-white transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
