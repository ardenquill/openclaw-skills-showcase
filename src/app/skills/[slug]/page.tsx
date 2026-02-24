import { notFound } from 'next/navigation';
import { skills, getSkillBySlug, getSeverityCounts } from '@/data/skills';
import type { Metadata } from 'next';
import SecurityBadge from '@/components/SecurityBadge';
import CodeBlock from '@/components/CodeBlock';
import FindingCard from '@/components/FindingCard';
import SetupSteps from '@/components/SetupSteps';
import Link from 'next/link';

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  return {
    title: `${skill.name} — OpenClaw Skills Showcase`,
    description: skill.description,
  };
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const counts = getSeverityCounts(skill.securityFindings);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
        &larr; All Skills
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">{skill.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            by{' '}
            <a
              href={skill.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
            >
              {skill.provider}
            </a>
          </p>
          <p className="mt-3 text-zinc-400 leading-relaxed">{skill.description}</p>
        </div>
        <SecurityBadge rating={skill.overallRating} size="lg" />
      </div>

      {/* Section: What It Does */}
      <section className="mb-12">
        <SectionHeading>What It Does</SectionHeading>
        <CodeBlock code={skill.demo.code} language={skill.demo.language} title={skill.demo.title} />
      </section>

      {/* Section: Quick Setup */}
      <section className="mb-12">
        <SectionHeading>Quick Setup</SectionHeading>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <SetupSteps steps={skill.setup} />
        </div>
      </section>

      {/* Section: Security Audit */}
      <section>
        <SectionHeading>Security Audit</SectionHeading>

        {/* Finding summary */}
        <div className="flex items-center gap-4 mb-6 text-xs">
          {counts.critical > 0 && (
            <span className="text-red-400">{counts.critical} Critical</span>
          )}
          {counts.high > 0 && (
            <span className="text-orange-400">{counts.high} High</span>
          )}
          {counts.medium > 0 && (
            <span className="text-amber-400">{counts.medium} Medium</span>
          )}
          {counts.low > 0 && (
            <span className="text-blue-400">{counts.low} Low</span>
          )}
          {skill.securityFindings.length === 0 && (
            <span className="text-emerald-400">No findings</span>
          )}
        </div>

        <div className="space-y-4">
          {skill.securityFindings.map((finding, i) => (
            <FindingCard key={i} finding={finding} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}
