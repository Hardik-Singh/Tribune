import { NextRequest, NextResponse } from "next/server";

// GET /api/proposals/[id] — Get proposal details
// TODO: Fetch proposal from SDK by ID
// TODO: Include vote counts, status, PR URL, diff data
// TODO: Return full proposal object

export async function GET(
  _request: NextRequest,
  { params: _params }: { params: { id: string } }
) {
  // TODO: Fetch and return proposal details
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
