import { NextRequest, NextResponse } from "next/server";
import { getUserReputation } from "@/lib/mock-data";
import { ReputationTier } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { address: string } }
) {
  const reputation = getUserReputation(params.address);
  if (!reputation) {
    return NextResponse.json({
      reputation: {
        address: params.address,
        score: 0,
        tier: ReputationTier.Newcomer,
        votingPower: 1,
        proposalsCreated: 0,
        votesCast: 0,
      },
    });
  }

  return NextResponse.json({ reputation });
}
