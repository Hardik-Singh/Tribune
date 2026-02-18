import { supabase } from "@/lib/supabase";
import { Activity, ActivityType } from "@/lib/types";
import ActivityItem from "@/components/ActivityItem";
import FeedFilter from "@/components/FeedFilter";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = type ?? "all";

  let query = supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (filter !== "all") {
    query = query.eq("type", filter);
  }

  const { data: rows } = await query;

  const activities: Activity[] = (rows ?? []).map((r) => ({
    id: r.id,
    type: r.type as ActivityType,
    actor: r.actor,
    description: r.description,
    entityId: r.entity_id,
    entityType: r.entity_type as Activity["entityType"],
    entityTitle: r.entity_title,
    createdAt: r.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
      <FeedFilter current={filter} />
      <div className="mt-6 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-surface">
        {activities.map((a) => (
          <ActivityItem key={a.id} activity={a} />
        ))}
        {activities.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-500">
            No activity found.
          </p>
        )}
      </div>
    </div>
  );
}
