"use client";

import { useState } from "react";

interface EmbedSnippetProps {
  proposalId: string;
}

export default function EmbedSnippet({ proposalId }: EmbedSnippetProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed/proposal/${proposalId}" width="400" height="200" frameborder="0" style="border-radius:12px;border:1px solid #27272a;"></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
      >
        Embed
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Embed this proposal</span>
        <button
          onClick={() => setShow(false)}
          className="text-xs text-zinc-500 hover:text-white"
        >
          Close
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-400">
        {snippet}
      </pre>
      <button
        onClick={handleCopy}
        className="mt-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
      >
        {copied ? "Copied!" : "Copy to clipboard"}
      </button>
    </div>
  );
}
