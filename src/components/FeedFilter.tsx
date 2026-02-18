"use client";

import { useRouter } from "next/navigation";
import { ActivityType } from "@/lib/types";

const tabs = [
  { label: "All", value: "all" },
  { label: "Votes", value: ActivityType.Vote },
  { label: "Proposals", value: ActivityType.ProposalCreated },
  { label: "Merges", value: ActivityType.ProposalMerged },
];

interface FeedFilterProps {
  current: string;
}

export default function FeedFilter({ current }: FeedFilterProps) {
  const router = useRouter();

  return (
    <div className="mt-4 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            router.replace(
              tab.value === "all" ? "/feed" : `/feed?type=${tab.value}`
            )
          }
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            current === tab.value
              ? "bg-zinc-800 text-white"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
