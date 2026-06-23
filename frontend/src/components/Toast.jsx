import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const typeConfig = {
  success: { icon: CheckCircle, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', iconColor: 'text-emerald-400' },
  error:   { icon: XCircle,    bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', iconColor: 'text-amber-400' },
  info:    { icon: Info,        bg: 'bg-brand-500/10',   border: 'border-brand-500/20',   text: 'text-brand-400',   iconColor: 'text-brand-400' },
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl animate-slide-up ${config.bg} ${config.border}`}
          >
            <Icon size={18} className={`mt-0.5 flex-shrink-0 ${config.iconColor}`} />
            <p className={`text-sm flex-1 ${config.text}`}>{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
