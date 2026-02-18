import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ReputationTier } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  const { data: row } = await supabase
    .from("reputations")
    .select("*")
    .eq("address", address)
    .single();

  if (!row) {
    return NextResponse.json({
      reputation: {
        address,
        score: 0,
        tier: ReputationTier.Newcomer,
        votingPower: 1,
        proposalsCreated: 0,
        votesCast: 0,
      },
    });
  }

  return NextResponse.json({
    reputation: {
      address: row.address,
      score: row.score,
      tier: row.tier as ReputationTier,
      votingPower: row.voting_power,
      proposalsCreated: row.proposals_created,
      votesCast: row.votes_cast,
    },
  });
}
