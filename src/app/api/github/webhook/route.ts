import { NextRequest, NextResponse } from "next/server";

// POST /api/github/webhook — Handle GitHub webhook events
// TODO: Verify webhook signature from GitHub secret
// TODO: Handle PR merge events — trigger on-chain proposal resolution
// TODO: Handle PR close events — mark proposal as rejected
// TODO: Handle PR review events — update proposal metadata

export async function POST(_request: NextRequest) {
  // TODO: Verify signature and process webhook event
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
