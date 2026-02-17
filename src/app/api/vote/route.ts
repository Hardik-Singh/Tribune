import { NextRequest, NextResponse } from "next/server";

// POST /api/vote — Cast a vote on a proposal
// TODO: Authenticate request via SDK (verify wallet signature)
// TODO: Parse proposalId and support (yes/no) from request body
// TODO: Validate user has sufficient reputation to vote
// TODO: Submit vote on-chain via SDK
// TODO: Return updated vote tallies

export async function POST(_request: NextRequest) {
  // TODO: Implement vote casting
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
