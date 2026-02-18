"use client";

import Link from "next/link";
import { Proposal, ProposalStatus } from "@/lib/types";
import { timeAgo } from "@/lib/mock-data";
import { useState } from "react";

interface ProposalCardProps {
  proposal: Proposal;
}

const statusBadge: Record<ProposalStatus, string> = {
  [ProposalStatus.Active]: "badge-active",
  [ProposalStatus.Passed]: "badge-passed",
  [ProposalStatus.Rejected]: "badge-rejected",
  [ProposalStatus.Pending]: "badge-pending",
};

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const [upvotes, setUpvotes] = useState(proposal.upvotes);
  const [downvotes, setDownvotes] = useState(proposal.downvotes);
  const yesPercent =
    proposal.totalVotes > 0
      ? (proposal.votesYes / proposal.totalVotes) * 100
      : 0;
  const noPercent =
    proposal.totalVotes > 0
      ? (proposal.votesNo / proposal.totalVotes) * 100
      : 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={statusBadge[proposal.status]}>
              {proposal.status}
            </span>
            <span className="text-xs text-zinc-500">
              {proposal.chamberName}
            </span>
          </div>
          <Link
            href={`/proposals/${proposal.id}`}
            className="mt-2 block text-base font-semibold text-white transition-colors hover:text-accent-light"
          >
            {proposal.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
            {proposal.description}
          </p>
        </div>
      </div>

      {proposal.totalVotes > 0 && (
        <div className="mt-4">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="bg-vote-yes transition-all"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="bg-vote-no transition-all"
              style={{ width: `${noPercent}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
            <span className="text-vote-yes">{proposal.votesYes} Yes</span>
            <span className="text-vote-no">{proposal.votesNo} No</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
        <span>{timeAgo(proposal.createdAt)}</span>
        <span>{proposal.commentCount} comments</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUpvotes((u) => u + 1)}
            className="transition-colors hover:text-vote-yes"
          >
            ▲ {upvotes}
          </button>
          <button
            onClick={() => setDownvotes((d) => d + 1)}
            className="transition-colors hover:text-vote-no"
          >
            ▼ {downvotes}
          </button>
        </div>
      </div>
    </div>
  );
}
