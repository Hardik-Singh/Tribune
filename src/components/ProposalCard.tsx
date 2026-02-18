"use client";

import Link from "next/link";
import { Proposal, ProposalStatus } from "@/lib/types";
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
import { useState } from "react";
import { useMode } from "@/lib/mode-context";

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
  const { isAiMode } = useMode();
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
    <article
      data-testid={`proposal-card-${proposal.id}`}
      data-component="proposal-card"
      data-status={proposal.status}
      className={isAiMode ? "rounded border border-gray-300 bg-white p-4" : "card"}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={isAiMode ? "text-xs font-medium text-black" : statusBadge[proposal.status]}>
              {proposal.status}
            </span>
            <span className={isAiMode ? "text-xs text-gray-600" : "text-xs text-zinc-500"}>
              {proposal.chamberName}
            </span>
          </div>
          <Link
            href={`/proposals/${proposal.id}`}
            data-testid={`proposal-title-${proposal.id}`}
            className={isAiMode
              ? "mt-2 block text-base font-semibold text-black"
              : "mt-2 block text-base font-semibold text-white transition-colors hover:text-accent-light"
            }
          >
            {proposal.title}
          </Link>
          <p className={isAiMode ? "mt-1 line-clamp-2 text-sm text-gray-700" : "mt-1 line-clamp-2 text-sm text-zinc-400"}>
            {proposal.description}
          </p>
        </div>
      </div>

      {proposal.totalVotes > 0 && (
        <div className="mt-4">
          <div className={`flex h-1.5 overflow-hidden rounded-full ${isAiMode ? "bg-gray-200" : "bg-zinc-800"}`}>
            <div
              className="bg-vote-yes transition-all"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="bg-vote-no transition-all"
              style={{ width: `${noPercent}%` }}
            />
          </div>
          <div className={`mt-1 flex items-center justify-between text-xs ${isAiMode ? "text-gray-600" : "text-zinc-500"}`}>
            <span className="text-vote-yes">{proposal.votesYes} Yes</span>
            <span className="text-vote-no">{proposal.votesNo} No</span>
          </div>
        </div>
      )}

      <div className={`mt-3 flex items-center gap-4 text-xs ${isAiMode ? "text-gray-600" : "text-zinc-500"}`}>
        <span>{timeAgo(proposal.createdAt)}</span>
        <span>{proposal.commentCount} comments</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUpvotes((u) => u + 1)}
            data-testid={`upvote-btn-${proposal.id}`}
            aria-label={`Upvote proposal: ${proposal.title}`}
            className="transition-colors hover:text-vote-yes"
          >
            {isAiMode ? `Upvote (${upvotes})` : `▲ ${upvotes}`}
          </button>
          <button
            onClick={() => setDownvotes((d) => d + 1)}
            data-testid={`downvote-btn-${proposal.id}`}
            aria-label={`Downvote proposal: ${proposal.title}`}
            className="transition-colors hover:text-vote-no"
          >
            {isAiMode ? `Downvote (${downvotes})` : `▼ ${downvotes}`}
          </button>
        </div>
      </div>
    </article>
  );
}
