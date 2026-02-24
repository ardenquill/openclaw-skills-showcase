type Rating = 'clean' | 'warning' | 'flagged';

const config: Record<Rating, { label: string; bg: string; text: string; dot: string }> = {
  clean: { label: 'Clean', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  warning: { label: 'Warning', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  flagged: { label: 'Flagged', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

export default function SecurityBadge({ rating, size = 'sm' }: { rating: Rating; size?: 'sm' | 'lg' }) {
  const c = config[rating];
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
