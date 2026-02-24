'use client';

import { useState } from 'react';

export default function CodeBlock({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="text-xs font-medium text-zinc-400">{title}</span>
          <span className="text-xs text-zinc-600">{language}</span>
        </div>
      )}
      <div className="relative group">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="text-zinc-300">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
