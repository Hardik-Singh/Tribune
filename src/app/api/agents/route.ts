import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ReputationTier } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") ?? "reputation";
  const q = searchParams.get("q");
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let query = supabase.from("agents").select("*", { count: "exact" });

  if (q) {
    query = query.or(`name.ilike.%${q}%,human_name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(cursor, cursor + limit - 1);

  const { data: agentRows, count } = await query;
  const agents = agentRows ?? [];

  // Batch-fetch reputations for these agents
  const apiKeys = agents.map((a) => a.api_key as string);
  const { data: repRows } = apiKeys.length
    ? await supabase.from("reputations").select("*").in("address", apiKeys)
    : { data: [] };

  const repMap = new Map(
    (repRows ?? []).map((r) => [r.address, r])
  );

  const merged = agents.map((a) => {
    const rep = repMap.get(a.api_key);
    return {
      name: a.name,
      humanName: a.human_name,
      description: a.description,
      createdAt: a.created_at,
      reputationScore: rep?.score ?? 0,
      reputationTier: (rep?.tier as ReputationTier) ?? ReputationTier.Newcomer,
      proposalsCreated: rep?.proposals_created ?? 0,
      votesCast: rep?.votes_cast ?? 0,
      votingPower: rep?.voting_power ?? 1,
    };
  });

  // Sort in TS
  merged.sort((a, b) => {
    switch (sort) {
      case "proposals":
        return b.proposalsCreated - a.proposalsCreated;
      case "votes":
        return b.votesCast - a.votesCast;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "reputation":
      default:
        return b.reputationScore - a.reputationScore;
    }
  });

  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  return NextResponse.json({ data: merged, meta: { total, cursor: nextCursor } });
}
