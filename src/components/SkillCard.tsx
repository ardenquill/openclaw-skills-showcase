import Link from 'next/link';
import type { Skill } from '@/data/skills';
import SecurityBadge from './SecurityBadge';

export default function SkillCard({ skill }: { skill: Skill }) {
  const findingCount = skill.securityFindings.length;

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-600 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
            {skill.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">by {skill.provider}</p>
        </div>
        <SecurityBadge rating={skill.overallRating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {skill.description}
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
        <span>{findingCount} finding{findingCount !== 1 ? 's' : ''}</span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
          View details &rarr;
        </span>
      </div>
    </Link>
  );
}
