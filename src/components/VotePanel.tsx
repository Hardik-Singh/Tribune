"use client";

import { useState } from "react";
import { useWallet } from "./Providers";
import { Proposal, ProposalStatus, VoteChoice } from "@/lib/types";
import { useMode } from "@/lib/mode-context";

interface VotePanelProps {
  proposal: Proposal;
}

export default function VotePanel({ proposal }: VotePanelProps) {
  const { connected } = useWallet();
  const { isAiMode } = useMode();
  const [userVote, setUserVote] = useState<VoteChoice | null>(null);
  const [votes, setVotes] = useState({
    yes: proposal.votesYes,
    no: proposal.votesNo,
    abstain: proposal.votesAbstain,
  });

  const total = votes.yes + votes.no + votes.abstain;
  const isActive = proposal.status === ProposalStatus.Active;

  function castVote(choice: VoteChoice) {
    if (!connected || !isActive || userVote) return;
    setUserVote(choice);
    setVotes((v) => ({
      ...v,
      [choice]: v[choice] + 1,
    }));
  }

  const yesPercent = total > 0 ? (votes.yes / total) * 100 : 0;
  const noPercent = total > 0 ? (votes.no / total) * 100 : 0;
  const abstainPercent = total > 0 ? (votes.abstain / total) * 100 : 0;

  return (
    <div
      data-component="vote-panel"
      data-testid={`vote-panel-${proposal.id}`}
      {...(userVote ? { "data-value": userVote } : {})}
      className={isAiMode
        ? "rounded border border-gray-300 bg-white p-5"
        : "rounded-xl border border-zinc-800 bg-surface p-5"
      }
    >
      <h3 className={isAiMode ? "text-sm font-semibold text-black" : "text-sm font-semibold text-white"}>On-Chain Vote</h3>

      <div className={`mt-4 flex h-3 overflow-hidden rounded-full ${isAiMode ? "bg-gray-200" : "bg-zinc-800"}`}>
        <div
          className="bg-vote-yes transition-all"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="bg-vote-no transition-all"
          style={{ width: `${noPercent}%` }}
        />
        <div
          className={`${isAiMode ? "bg-gray-400" : "bg-zinc-500"} transition-all`}
          style={{ width: `${abstainPercent}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs" aria-busy={false} aria-live="polite">
        <span className="text-vote-yes">Yes {votes.yes}</span>
        <span className="text-vote-no">No {votes.no}</span>
        <span className={isAiMode ? "text-gray-600" : "text-zinc-500"}>Abstain {votes.abstain}</span>
      </div>

      <div className={`mt-1 text-xs ${isAiMode ? "text-gray-600" : "text-zinc-500"}`}>
        {total} / {proposal.quorum} quorum
      </div>

      {isActive && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => castVote(VoteChoice.Yes)}
            disabled={!connected || !!userVote}
            data-testid="vote-yes-btn"
            aria-label={`Vote yes on proposal: ${proposal.title}`}
            className={isAiMode
              ? "flex-1 rounded border border-green-600 px-4 py-2 text-sm font-medium text-green-700 disabled:opacity-50"
              : "btn-vote-yes flex-1"
            }
          >
            {userVote === VoteChoice.Yes ? "Voted Yes" : "Yes"}
          </button>
          <button
            onClick={() => castVote(VoteChoice.No)}
            disabled={!connected || !!userVote}
            data-testid="vote-no-btn"
            aria-label={`Vote no on proposal: ${proposal.title}`}
            className={isAiMode
              ? "flex-1 rounded border border-red-600 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
              : "btn-vote-no flex-1"
            }
          >
            {userVote === VoteChoice.No ? "Voted No" : "No"}
          </button>
          <button
            onClick={() => castVote(VoteChoice.Abstain)}
            disabled={!connected || !!userVote}
            data-testid="vote-abstain-btn"
            aria-label={`Abstain on proposal: ${proposal.title}`}
            className={isAiMode
              ? "flex-1 rounded border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
              : "flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white disabled:opacity-50"
            }
          >
            {userVote === VoteChoice.Abstain ? "Abstained" : "Abstain"}
          </button>
        </div>
      )}

      {!connected && isActive && (
        <p className={`mt-3 text-xs ${isAiMode ? "text-gray-600" : "text-zinc-500"}`}>
          Connect your wallet to vote.
        </p>
      )}

      {!isActive && (
        <p className={`mt-3 text-xs ${isAiMode ? "text-gray-600" : "text-zinc-500"}`}>
          Voting has ended. Result:{" "}
          <span className={`font-medium ${isAiMode ? "text-black" : "text-white"}`}>{proposal.status}</span>
        </p>
      )}
    </div>
  );
}
