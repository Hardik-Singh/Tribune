interface DiffViewerProps {
  diff: string;
}

export default function DiffViewer({ diff }: DiffViewerProps) {
  if (!diff) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-500">
        No diff available for this proposal.
      </div>
    );
  }

  const lines = diff.split("\n");

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 font-mono text-sm">
      {lines.map((line, i) => {
        let lineClass = "text-zinc-400";
        let bgClass = "";
        if (line.startsWith("+") && !line.startsWith("+++")) {
          lineClass = "text-emerald-400";
          bgClass = "bg-emerald-500/10";
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          lineClass = "text-red-400";
          bgClass = "bg-red-500/10";
        } else if (line.startsWith("@@")) {
          lineClass = "text-indigo-400";
          bgClass = "bg-indigo-500/5";
        } else if (line.startsWith("---") || line.startsWith("+++")) {
          lineClass = "text-zinc-500 font-bold";
        }

        return (
          <div key={i} className={`flex ${bgClass}`}>
            <span className="w-10 flex-shrink-0 select-none px-2 py-0.5 text-right text-zinc-600">
              {i + 1}
            </span>
            <pre className={`flex-1 px-2 py-0.5 ${lineClass}`}>{line}</pre>
          </div>
        );
      })}
    </div>
  );
}
