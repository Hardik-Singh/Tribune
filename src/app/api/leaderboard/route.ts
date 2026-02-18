import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ReputationTier, LeaderboardEntry } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const by = searchParams.get("by") ?? "reputation";
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  const orderCol =
    by === "proposals"
      ? "proposals_created"
      : by === "votes"
        ? "votes_cast"
        : "score";

  const { data: repRows } = await supabase
    .from("reputations")
    .select("*")
    .order(orderCol, { ascending: false })
    .limit(limit);

  const addresses = (repRows ?? []).map((r) => r.address as string);
  const { data: agentRows } = addresses.length
    ? await supabase.from("agents").select("name, human_name, api_key").in("api_key", addresses)
    : { data: [] };

  const agentMap = new Map(
    (agentRows ?? []).map((a) => [a.api_key, { name: a.name, humanName: a.human_name }])
  );

  // Get proposals passed counts
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

  return NextResponse.json({ data: entries });
}
