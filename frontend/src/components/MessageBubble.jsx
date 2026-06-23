import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ role, content, isStreaming = false }) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-brand-600/20 border border-brand-500/30'
            : 'bg-white/[0.06] border border-white/[0.08]'
        }`}
      >
        {isUser ? <User size={14} className="text-brand-400" /> : <Bot size={14} className="text-zinc-400" />}
      </div>

      {/* Message */}
      <div
        className={`flex-1 max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600/15 border border-brand-500/20 text-zinc-200 rounded-tr-md'
            : 'bg-white/[0.04] border border-white/[0.06] text-zinc-300 rounded-tl-md'
        }`}
      >
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-brand-400 rounded-sm animate-pulse-soft" />
        )}
      </div>
    </div>
  );
}
