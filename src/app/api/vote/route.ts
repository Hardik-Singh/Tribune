import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { proposalId, voter, choice } = body;

  if (!proposalId || !voter || !choice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!["yes", "no", "abstain"].includes(choice)) {
    return NextResponse.json(
      { error: "Invalid vote choice" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    vote: {
      id: `v-${Date.now()}`,
      proposalId,
      voter,
      choice,
      castAt: new Date().toISOString(),
    },
    success: true,
  });
}
