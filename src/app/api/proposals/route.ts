import { NextRequest, NextResponse } from "next/server";

// POST /api/proposals — Create a new proposal
// TODO: Authenticate request via SDK (verify wallet signature)
// TODO: Parse natural language description from request body
// TODO: Call AI service to generate code changes
// TODO: Open GitHub PR with generated changes
// TODO: Create on-chain proposal record via SDK
// TODO: Return proposal ID and PR URL

export async function POST(_request: NextRequest) {
  // TODO: Implement proposal creation
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
