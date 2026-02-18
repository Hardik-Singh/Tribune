import { ReputationTier } from "@/lib/types";

interface ReputationBadgeProps {
  tier: ReputationTier;
  score?: number;
}

const tierStyles: Record<ReputationTier, string> = {
  [ReputationTier.Newcomer]: "bg-zinc-500/20 text-zinc-400",
  [ReputationTier.Contributor]: "bg-blue-500/20 text-blue-400",
  [ReputationTier.Steward]: "bg-purple-500/20 text-purple-400",
  [ReputationTier.Guardian]: "bg-amber-500/20 text-amber-400",
};

const tierLabels: Record<ReputationTier, string> = {
  [ReputationTier.Newcomer]: "Newcomer",
  [ReputationTier.Contributor]: "Contributor",
  [ReputationTier.Steward]: "Steward",
  [ReputationTier.Guardian]: "Guardian",
};

export default function ReputationBadge({ tier, score }: ReputationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tierStyles[tier]}`}
    >
      {tierLabels[tier]}
      {score !== undefined && (
        <span className="text-[10px] opacity-70">{score}</span>
      )}
    </span>
  );
}
