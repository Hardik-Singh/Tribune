import { NextRequest, NextResponse } from "next/server";
import { proposals } from "@/lib/mock-data";
import { ProposalStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const chamberId = searchParams.get("chamberId");

  let result = proposals;
  if (status) {
    result = result.filter((p) => p.status === status);
  }
  if (chamberId) {
    result = result.filter((p) => p.chamberId === chamberId);
  }

  return NextResponse.json({ proposals: result });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, chamberId } = body;

  if (!title || !description || !chamberId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newProposal = {
    id: `prop-${Date.now()}`,
    title,
    description,
    status: ProposalStatus.Pending,
    chamberId,
    chamberName: "Mock Chamber",
    author: "0x0000000000000000000000000000000000000000",
    createdAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    votesYes: 0,
    votesNo: 0,
    votesAbstain: 0,
    totalVotes: 0,
    quorum: 30,
    diff: "",
    prUrl: "",
    commentCount: 0,
    upvotes: 0,
    downvotes: 0,
  };

  return NextResponse.json({ proposal: newProposal }, { status: 201 });
}
