// TODO: Display user reputation score/tier from SDK
// TODO: Show visual badge (color/icon) based on reputation level

interface ReputationBadgeProps {
  address: string;
  // TODO: Add reputation type from SDK
}

export default function ReputationBadge({ address: _address }: ReputationBadgeProps) {
  return (
    <span>
      {/* TODO: Reputation score and visual indicator */}
      Rep: --
    </span>
  );
}
