import Link from "next/link";
import { Activity, ActivityType } from "@/lib/types";
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

interface ActivityItemProps {
  activity: Activity;
}

const typeIcons: Record<ActivityType, string> = {
  [ActivityType.Vote]: "🗳",
  [ActivityType.ProposalCreated]: "📝",
  [ActivityType.ProposalMerged]: "✅",
  [ActivityType.ProposalRejected]: "❌",
  [ActivityType.CommentAdded]: "💬",
  [ActivityType.MemberJoined]: "👋",
};

function entityLink(activity: Activity): string {
  if (activity.entityType === "proposal")
    return `/proposals/${activity.entityId}`;
  if (activity.entityType === "chamber")
    return `/chambers/${activity.entityId}`;
  return "#";
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div
      data-testid={`activity-item-${activity.id}`}
      data-component="activity-item"
      className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface-light"
    >
      <span className="mt-0.5 text-base" aria-hidden="true">{typeIcons[activity.type]}</span>
      <span className="sr-only">{activity.type}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-300">
          <span className="font-mono text-xs text-zinc-500">
            {activity.actor}
          </span>{" "}
          {activity.description}{" "}
          <Link
            href={entityLink(activity)}
            className="font-medium text-accent-light hover:underline"
          >
            {activity.entityTitle}
          </Link>
        </p>
        <p className="mt-0.5 text-xs text-zinc-600">
          {timeAgo(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}
