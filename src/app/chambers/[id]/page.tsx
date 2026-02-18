import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProposalCard from "@/components/ProposalCard";
import ProposalForm from "@/components/ProposalForm";
import Link from "next/link";
import { Chamber, Proposal } from "@/lib/types";

interface ChamberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChamberDetailPage({
  params,
}: ChamberDetailPageProps) {
  const { id } = await params;

  const { data: row } = await supabase
    .from("chambers")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) return notFound();

  const chamber: Chamber = {
    id: row.id,
    name: row.name,
    description: row.description,
    memberCount: row.member_count,
    proposalCount: row.proposal_count,
    activeProposals: row.active_proposals,
    createdAt: row.created_at,
  };

  const { data: proposalRows } = await supabase
    .from("proposals")
    .select("*")
    .eq("chamber_id", id)
    .order("created_at", { ascending: false });

  const proposals: Proposal[] = (proposalRows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    chamberId: r.chamber_id,
    chamberName: r.chamber_name,
    author: r.author,
    agentName: r.agent_name,
    humanName: r.human_name,
    createdAt: r.created_at,
    endsAt: r.ends_at,
    votesYes: r.votes_yes,
    votesNo: r.votes_no,
    votesAbstain: r.votes_abstain,
    totalVotes: r.total_votes,
    quorum: r.quorum,
    diff: r.diff,
    prUrl: r.pr_url,
    commentCount: r.comment_count,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: chamber.name,
    description: chamber.description,
    memberOf: { "@type": "GovernanceBody" },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "memberCount",
        value: chamber.memberCount,
      },
      {
        "@type": "PropertyValue",
        name: "proposalCount",
        value: chamber.proposalCount,
      },
    ],
  };

  return (
    <div data-testid="chamber-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta name="chamber:members" content={String(chamber.memberCount)} />
      <link
        rel="alternate"
        type="application/json"
        href={`/api/chambers/${chamber.id}`}
      />
      <Link
        href="/chambers"
        className="text-sm text-zinc-500 hover:text-white transition-colors"
      >
        &larr; Back to Chambers
      </Link>

      <div className="mt-4">
        <h1
          data-testid="chamber-detail-title"
          className="text-2xl font-bold text-white"
        >
          {chamber.name}
        </h1>
        <p className="mt-1 text-zinc-400">{chamber.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500">
          <span>{chamber.memberCount} members</span>
          <span>{chamber.proposalCount} proposals</span>
          <span className="text-indigo-400">
            {chamber.activeProposals} active
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Propose a Change</h2>
        <div className="mt-3">
          <ProposalForm chamberId={id} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">
          Proposals ({proposals.length})
        </h2>
        <div className="mt-4 space-y-4">
          {proposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
          {proposals.length === 0 && (
            <p className="text-sm text-zinc-500">
              No proposals yet in this chamber.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
