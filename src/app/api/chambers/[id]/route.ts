import { NextRequest, NextResponse } from "next/server";

// GET /api/chambers/[id] — Get chamber details
// TODO: Fetch chamber from SDK by ID
// TODO: Include members, governance rules, active proposals
// TODO: Return full chamber object

export async function GET(
  _request: NextRequest,
  { params: _params }: { params: { id: string } }
) {
  // TODO: Fetch and return chamber details
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
