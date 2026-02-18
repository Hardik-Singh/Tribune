"use client";

import { useState } from "react";
import { activities } from "@/lib/mock-data";
import { ActivityType } from "@/lib/types";
import ActivityItem from "@/components/ActivityItem";

const tabs = [
  { label: "All", value: "all" },
  { label: "Votes", value: ActivityType.Vote },
  { label: "Proposals", value: ActivityType.ProposalCreated },
  { label: "Merges", value: ActivityType.ProposalMerged },
];

export default function FeedPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Activity Feed</h1>

      <div className="mt-4 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-surface">
        {filtered.map((a) => (
          <ActivityItem key={a.id} activity={a} />
        ))}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-500">
            No activity found.
          </p>
        )}
      </div>
    </div>
  );
}
