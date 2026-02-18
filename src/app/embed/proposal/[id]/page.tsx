import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProposalStatus } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex",
};

const statusColors: Record<ProposalStatus, string> = {
  [ProposalStatus.Active]: "bg-indigo-500/20 text-indigo-400",
  [ProposalStatus.Passed]: "bg-emerald-500/20 text-emerald-400",
  [ProposalStatus.Rejected]: "bg-red-500/20 text-red-400",
  [ProposalStatus.Pending]: "bg-zinc-500/20 text-zinc-400",
};

interface EmbedProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedProposalPage({ params }: EmbedProposalPageProps) {
  const { id } = await params;

  const { data: row } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) return notFound();

  const status = row.status as ProposalStatus;
  const totalVotes = row.total_votes as number;
  const yesPercent = totalVotes > 0 ? Math.round((row.votes_yes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((row.votes_no / totalVotes) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4" data-testid="embed-proposal">
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[status]}`}>
          {status}
        </span>
        <span className="text-xs text-zinc-500">{row.chamber_name}</span>
      </div>
      <h2 className="mt-2 text-sm font-bold text-white">{row.title}</h2>
      <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{row.description}</p>

      {totalVotes > 0 && (
        <div className="mt-3">
          <div className="flex h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="bg-emerald-500" style={{ width: `${yesPercent}%` }} />
            <div className="bg-red-500" style={{ width: `${noPercent}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
            <span>{yesPercent}% yes</span>
            <span>{totalVotes} votes</span>
            <span>{noPercent}% no</span>
          </div>
        </div>
      )}

      <a
        href={`/proposals/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-xs text-indigo-400 hover:text-indigo-300"
      >
        View on Tribune &rarr;
      </a>
    </div>
  );
}
