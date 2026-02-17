// TODO: Render a single feed activity (vote cast, proposal created, PR merged, etc.)
// TODO: Show timestamp, actor address, action description, link to relevant entity

interface ActivityItemProps {
  type: string;
  actor: string;
  timestamp: string;
  // TODO: Add full activity type from SDK
}

export default function ActivityItem({ type, actor, timestamp }: ActivityItemProps) {
  return (
    <div>
      <p>{actor} — {type} — {timestamp}</p>
      {/* TODO: Formatted activity with links */}
    </div>
  );
}
