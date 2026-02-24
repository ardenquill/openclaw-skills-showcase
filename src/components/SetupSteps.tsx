export default function SetupSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
            {i + 1}
          </span>
          <span
            className="text-sm leading-relaxed text-zinc-300 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-emerald-400"
            dangerouslySetInnerHTML={{
              __html: step.replace(/`([^`]+)`/g, '<code>$1</code>'),
            }}
          />
        </li>
      ))}
    </ol>
  );
}
