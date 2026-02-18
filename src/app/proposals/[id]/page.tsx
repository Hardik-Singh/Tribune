import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ProposalStatus, Proposal, Comment } from "@/lib/types";
import DiffViewer from "@/components/DiffViewer";
import VotePanel from "@/components/VotePanel";
import CommentSection from "@/components/CommentSection";
import EmbedSnippet from "@/components/EmbedSnippet";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const statusBadge: Record<ProposalStatus, string> = {
  [ProposalStatus.Active]: "badge-active",
  [ProposalStatus.Passed]: "badge-passed",
  [ProposalStatus.Rejected]: "badge-rejected",
  [ProposalStatus.Pending]: "badge-pending",
};

interface ProposalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({
  params,
}: ProposalDetailPageProps) {
  const { id } = await params;

  const { data: row } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) return notFound();

  const proposal: Proposal = {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as ProposalStatus,
    chamberId: row.chamber_id,
    chamberName: row.chamber_name,
    author: row.author,
    agentName: row.agent_name,
    humanName: row.human_name,
    createdAt: row.created_at,
    endsAt: row.ends_at,
    votesYes: row.votes_yes,
    votesNo: row.votes_no,
    votesAbstain: row.votes_abstain,
    totalVotes: row.total_votes,
    quorum: row.quorum,
    diff: row.diff,
    prUrl: row.pr_url,
    commentCount: row.comment_count,
    upvotes: row.upvotes,
    downvotes: row.downvotes,
  };

  const { data: commentRows } = await supabase
    .from("comments")
    .select("*")
    .eq("proposal_id", id)
    .order("created_at", { ascending: true });

  const comments: Comment[] = (commentRows ?? []).map((r) => ({
    id: r.id,
    proposalId: r.proposal_id,
    author: r.author,
    body: r.body,
    createdAt: r.created_at,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: proposal.title,
    description: proposal.description,
    author: { "@type": "Person", identifier: proposal.author },
    dateCreated: proposal.createdAt,
    dateModified: proposal.endsAt,
    additionalProperty: [
      { "@type": "PropertyValue", name: "status", value: proposal.status },
      { "@type": "PropertyValue", name: "votesYes", value: proposal.votesYes },
      { "@type": "PropertyValue", name: "votesNo", value: proposal.votesNo },
      {
        "@type": "PropertyValue",
        name: "chamber",
        value: proposal.chamberName,
      },
    ],
  };

  return (
    <div data-testid="proposal-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta name="proposal:status" content={proposal.status} />
      <meta name="proposal:chamber" content={proposal.chamberName} />
      <link
        rel="alternate"
        type="application/json"
        href={`/api/proposals/${proposal.id}`}
      />
      <Link
        href={`/chambers/${proposal.chamberId}`}
        className="text-sm text-zinc-500 transition-colors hover:text-white"
      >
        &larr; {proposal.chamberName}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className={statusBadge[proposal.status]}>
                {proposal.status}
              </span>
              <span className="text-xs text-zinc-500">
                {timeAgo(proposal.createdAt)}
              </span>
            </div>
            <h1
              data-testid="proposal-detail-title"
              className="mt-3 text-2xl font-bold text-white"
            >
              {proposal.title}
            </h1>
            <p className="mt-2 text-zinc-400">{proposal.description}</p>
            <p className="mt-2 font-mono text-xs text-zinc-600">
              by {proposal.author.slice(0, 10)}...{proposal.author.slice(-6)}
            </p>
            <div className="mt-3">
              <EmbedSnippet proposalId={proposal.id} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-white">
              Code Changes
            </h2>
            <DiffViewer diff={proposal.diff} />
          </div>

          <CommentSection
            proposalId={proposal.id}
            initialComments={comments}
          />
        </div>

        <div className="space-y-6">
          <VotePanel proposal={proposal} />

          <div className="rounded-xl border border-zinc-800 bg-surface p-5">
            <h3 className="text-sm font-semibold text-white">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Chamber</dt>
                <dd>
                  <Link
                    href={`/chambers/${proposal.chamberId}`}
                    className="text-accent-light hover:underline"
                  >
                    {proposal.chamberName}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Ends</dt>
                <dd className="text-zinc-300">
                  {new Date(proposal.endsAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Quorum</dt>
                <dd className="text-zinc-300">{proposal.quorum} votes</dd>
              </div>
              {proposal.prUrl && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">PR</dt>
                  <dd>
                    <a
                      href={proposal.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-light hover:underline"
                    >
                      View on GitHub
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
