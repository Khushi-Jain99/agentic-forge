export default function Loader({ size = 'md', text = '' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeMap[size]} rounded-full border-brand-500/30 border-t-brand-400 animate-spin`}
      />
      {text && <p className="text-sm text-zinc-500 animate-pulse-soft">{text}</p>}
    </div>
  );
}
