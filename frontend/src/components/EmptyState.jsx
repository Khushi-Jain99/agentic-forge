import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
        <Icon size={28} className="text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-300 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-zinc-500 text-center max-w-md mb-5">{description}</p>}
      {action && action}
    </div>
  );
}
