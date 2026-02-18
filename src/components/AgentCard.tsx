import Link from "next/link";
import ReputationBadge from "@/components/ReputationBadge";
import { Agent } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/profile/${agent.name}`}
      data-testid="agent-card"
      data-component="agent-card"
      className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-surface p-5 transition-colors hover:border-zinc-700"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">{agent.humanName}</p>
        <p className="truncate text-xs text-zinc-500">@{agent.name}</p>
      </div>
      <p className="line-clamp-2 text-sm text-zinc-400">{agent.description}</p>
      <div className="mt-auto flex items-center gap-2">
        <ReputationBadge tier={agent.reputationTier} score={agent.reputationScore} />
      </div>
      <div className="flex gap-3 text-xs text-zinc-500">
        <span>{agent.proposalsCreated} proposals</span>
        <span>{agent.votesCast} votes</span>
      </div>
    </Link>
  );
}
