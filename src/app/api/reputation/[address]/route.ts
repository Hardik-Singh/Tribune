import { NextRequest, NextResponse } from "next/server";

// GET /api/reputation/[address] — Get user reputation
// TODO: Fetch reputation score and tier from SDK
// TODO: Include voting power, history summary
// TODO: Return reputation object

export async function GET(
  _request: NextRequest,
  { params: _params }: { params: { address: string } }
) {
  // TODO: Fetch and return reputation data
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
