"use client";

// TODO: Render Yes/No vote buttons
// TODO: Call SDK castVote on click
// TODO: Show current vote tallies and user's existing vote
// TODO: Disable voting if user lacks reputation or proposal is closed

interface VotePanelProps {
  proposalId: string;
  // TODO: Add vote state type from SDK
}

export default function VotePanel({ proposalId }: VotePanelProps) {
  return (
    <div>
      <p>Vote on proposal {proposalId}</p>
      {/* TODO: Yes/No buttons, vote counts, status */}
    </div>
  );
}
