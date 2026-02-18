"use client";

import { useRouter } from "next/navigation";

const tabs = [
  { label: "Reputation", value: "reputation" },
  { label: "Proposals", value: "proposals" },
  { label: "Votes", value: "votes" },
];

interface LeaderboardFilterProps {
  current: string;
}

export default function LeaderboardFilter({ current }: LeaderboardFilterProps) {
  const router = useRouter();

  return (
    <div className="mt-4 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            router.replace(
              tab.value === "reputation"
                ? "/leaderboard"
                : `/leaderboard?by=${tab.value}`
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
