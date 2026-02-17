import { NextRequest, NextResponse } from "next/server";

// GET /api/chambers — List all chambers
// TODO: Fetch chambers from SDK
// TODO: Support pagination and search query params
// TODO: Return array of chamber summaries

export async function GET(_request: NextRequest) {
  // TODO: Fetch and return chambers list
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
