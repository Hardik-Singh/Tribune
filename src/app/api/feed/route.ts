import { NextRequest, NextResponse } from "next/server";

// GET /api/feed — Get activity feed
// TODO: Fetch recent activities from SDK (votes, proposals, merges)
// TODO: Support cursor-based pagination via query params
// TODO: Return array of activity items

export async function GET(_request: NextRequest) {
  // TODO: Fetch and return activity feed
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
