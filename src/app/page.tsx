import { skills, getAllFindings, getSeverityCounts } from '@/data/skills';
import SkillCard from '@/components/SkillCard';

export default function Home() {
  const allFindings = getAllFindings();
  const counts = getSeverityCounts(allFindings);
  const ratingCounts = {
    clean: skills.filter((s) => s.overallRating === 'clean').length,
    warning: skills.filter((s) => s.overallRating === 'warning').length,
    flagged: skills.filter((s) => s.overallRating === 'flagged').length,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          OpenClaw Skills Showcase
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Security Audited
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-zinc-500">
          Browse {skills.length} OpenClaw skills with detailed security audit results.
          Each skill includes demo code, setup instructions, and findings covering
          prompt injection, key exposure, and input validation.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <StatCard label="Skills Audited" value={skills.length} />
        <StatCard label="Total Findings" value={allFindings.length} />
        <StatCard label="Critical / High" value={counts.critical + counts.high} color="text-red-400" />
        <StatCard label="Medium / Low" value={counts.medium + counts.low} color="text-amber-400" />
      </div>

      {/* Rating breakdown */}
      <div className="flex items-center justify-center gap-6 mb-12 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {ratingCounts.clean} Clean
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          {ratingCounts.warning} Warning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          {ratingCounts.flagged} Flagged
        </span>
      </div>

      {/* Skill Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <div className={`text-2xl font-bold ${color || 'text-white'}`}>{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{label}</div>
    </div>
  );
}
