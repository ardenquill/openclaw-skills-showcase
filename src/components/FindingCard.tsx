import type { Finding } from '@/data/skills';

const severityConfig: Record<Finding['severity'], { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

export default function FindingCard({ finding }: { finding: Finding }) {
  const s = severityConfig[finding.severity];
  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-zinc-100">{finding.title}</h4>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${s.text} ${s.bg}`}>
          {finding.severity}
        </span>
      </div>
      <p className="mt-1 text-xs font-mono text-zinc-500">{finding.file}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{finding.description}</p>
      <div className="mt-4 rounded-md bg-zinc-950/50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Recommendation</p>
        <p className="text-sm text-zinc-300">{finding.recommendation}</p>
      </div>
    </div>
  );
}
