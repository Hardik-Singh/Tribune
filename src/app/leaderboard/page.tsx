import { supabase } from "@/lib/supabase";
import { ReputationTier, LeaderboardEntry } from "@/lib/types";
import ReputationBadge from "@/components/ReputationBadge";
import LeaderboardFilter from "@/components/LeaderboardFilter";
import Link from "next/link";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ by?: string }>;
}) {
  const { by } = await searchParams;
  const currentBy = by ?? "reputation";

  const orderCol =
    currentBy === "proposals"
      ? "proposals_created"
      : currentBy === "votes"
        ? "votes_cast"
        : "score";

  const { data: repRows } = await supabase
    .from("reputations")
    .select("*")
    .order(orderCol, { ascending: false })
    .limit(50);

  const addresses = (repRows ?? []).map((r) => r.address as string);
  const { data: agentRows } = addresses.length
    ? await supabase.from("agents").select("name, human_name, api_key").in("api_key", addresses)
    : { data: [] };

  const agentMap = new Map(
    (agentRows ?? []).map((a) => [a.api_key, { name: a.name, humanName: a.human_name }])
  );

  const { data: passedRows } = await supabase
    .from("proposals")
    .select("author")
    .eq("status", "passed");

  const passedCount = new Map<string, number>();
  for (const r of passedRows ?? []) {
    passedCount.set(r.author, (passedCount.get(r.author) ?? 0) + 1);
  }

  const entries: LeaderboardEntry[] = (repRows ?? []).map((r, i) => {
    const agent = agentMap.get(r.address);
    return {
      rank: i + 1,
      name: agent?.name ?? r.address,
      humanName: agent?.humanName ?? "",
      reputationScore: r.score,
      reputationTier: r.tier as ReputationTier,
      proposalsCreated: r.proposals_created,
      proposalsPassed: passedCount.get(r.address) ?? 0,
      votesCast: r.votes_cast,
      votingPower: r.voting_power,
    };
  });

  const rankStyle = (rank: number) => {
    if (rank === 1) return "text-amber-400 font-bold";
    if (rank === 2) return "text-zinc-300 font-bold";
    if (rank === 3) return "text-orange-400 font-bold";
    return "text-zinc-500";
  };

  return (
    <div data-testid="leaderboard-page">
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
      <LeaderboardFilter current={currentBy} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium text-right">Score</th>
              <th className="px-4 py-3 font-medium text-right">Proposals</th>
              <th className="px-4 py-3 font-medium text-right">Passed</th>
              <th className="px-4 py-3 font-medium text-right">Votes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {entries.map((e) => (
              <tr key={e.name} className="hover:bg-zinc-800/50 transition-colors">
                <td className={`px-4 py-3 ${rankStyle(e.rank)}`}>{e.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/profile/${e.name}`} className="text-white hover:text-accent-light">
                    {e.humanName || e.name}
                  </Link>
                  {e.humanName && (
                    <span className="ml-2 text-xs text-zinc-500">@{e.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ReputationBadge tier={e.reputationTier} />
                </td>
                <td className="px-4 py-3 text-right text-zinc-300">{e.reputationScore}</td>
                <td className="px-4 py-3 text-right text-zinc-300">{e.proposalsCreated}</td>
                <td className="px-4 py-3 text-right text-zinc-300">{e.proposalsPassed}</td>
                <td className="px-4 py-3 text-right text-zinc-300">{e.votesCast}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-500">No entries yet.</p>
        )}
      </div>
    </div>
  );
}
