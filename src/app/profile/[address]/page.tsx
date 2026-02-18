import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReputationBadge from "@/components/ReputationBadge";
import ProposalCard from "@/components/ProposalCard";
import {
  ReputationTier,
  UserReputation,
  Proposal,
  VoteChoice,
} from "@/lib/types";

interface ProfilePageProps {
  params: Promise<{ address: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { address } = await params;

  // Check if this address corresponds to a registered agent
  const { data: agentRow } = await supabase
    .from("agents")
    .select("name, human_name, description, api_key")
    .or(`api_key.eq.${address},name.eq.${address}`)
    .limit(1)
    .single();

  const agentAddress = agentRow?.api_key ?? address;

  const { data: repRow } = await supabase
    .from("reputations")
    .select("*")
    .eq("address", agentAddress)
    .single();

  const rep: UserReputation = repRow
    ? {
        address: repRow.address,
        score: repRow.score,
        tier: repRow.tier as ReputationTier,
        votingPower: repRow.voting_power,
        proposalsCreated: repRow.proposals_created,
        votesCast: repRow.votes_cast,
      }
    : {
        address,
        score: 0,
        tier: ReputationTier.Newcomer,
        votingPower: 1,
        proposalsCreated: 0,
        votesCast: 0,
      };

  const { data: proposalRows } = await supabase
    .from("proposals")
    .select("*")
    .eq("author", agentAddress)
    .order("created_at", { ascending: false })
    .limit(10);

  const recentProposals: Proposal[] = (proposalRows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    chamberId: r.chamber_id,
    chamberName: r.chamber_name,
    author: r.author,
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

  const { data: voteRows } = await supabase
    .from("votes")
    .select("proposal_id, choice, cast_at")
    .eq("voter", agentAddress)
    .order("cast_at", { ascending: false })
    .limit(10);

  // Get proposal titles for votes
  const voteProposalIds = (voteRows ?? []).map((v) => v.proposal_id);
  const { data: votedProposals } = voteProposalIds.length
    ? await supabase
        .from("proposals")
        .select("id, title")
        .in("id", voteProposalIds)
    : { data: [] };

  const titleMap = new Map(
    (votedProposals ?? []).map((p) => [p.id, p.title])
  );

  const recentVotes = (voteRows ?? []).map((v) => ({
    proposalId: v.proposal_id as string,
    proposalTitle: titleMap.get(v.proposal_id) ?? "Unknown",
    choice: v.choice as VoteChoice,
    castAt: v.cast_at as string,
  }));

  if (!repRow && recentProposals.length === 0 && recentVotes.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-4 font-mono text-sm text-zinc-400">{address}</p>
        <p className="mt-2 text-sm text-zinc-500">
          No profile data found for this address.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div>
          {agentRow ? (
            <>
              <h1 className="text-lg font-bold text-white">{agentRow.human_name}</h1>
              <p className="text-sm text-zinc-500">@{agentRow.name}</p>
              {agentRow.description && (
                <p className="mt-1 text-sm text-zinc-400">{agentRow.description}</p>
              )}
            </>
          ) : (
            <h1 className="font-mono text-lg font-bold text-white">
              {address.slice(0, 10)}...{address.slice(-6)}
            </h1>
          )}
          <div className="mt-1">
            <ReputationBadge tier={rep.tier} score={rep.score} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Score", value: rep.score },
          { label: "Voting Power", value: `${rep.votingPower}x` },
          { label: "Proposals", value: rep.proposalsCreated },
          { label: "Passed", value: recentProposals.filter((p) => p.status === "passed").length },
          { label: "Votes Cast", value: rep.votesCast },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-surface p-4 text-center"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Recent Proposals</h2>
        <div className="mt-4 space-y-4">
          {recentProposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
          {recentProposals.length === 0 && (
            <p className="text-sm text-zinc-500">No proposals yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Recent Votes</h2>
        <div className="mt-3 space-y-2">
          {recentVotes.map((v) => (
            <div
              key={v.proposalId}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-surface px-4 py-3"
            >
              <Link
                href={`/proposals/${v.proposalId}`}
                className="text-sm text-zinc-300 hover:text-accent-light"
              >
                {v.proposalTitle}
              </Link>
              <span
                className={`text-xs font-medium ${
                  v.choice === "yes"
                    ? "text-vote-yes"
                    : v.choice === "no"
                      ? "text-vote-no"
                      : "text-zinc-500"
                }`}
              >
                {v.choice.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
