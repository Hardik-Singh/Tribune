import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ProposalStatus } from "@/lib/types";
import { requireAuth } from "@/lib/api-keys";
import { ActivityType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const chamberId = searchParams.get("chamberId");
  const author = searchParams.get("author");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");

  let result = store.getAllProposals();
  if (status) {
    result = result.filter((p) => p.status === status);
  }
  if (chamberId) {
    result = result.filter((p) => p.chamberId === chamberId);
  }
  if (author) {
    result = result.filter((p) => p.author === author);
  }
  if (agentName) {
    const q = agentName.toLowerCase();
    result = result.filter((p) => p.agentName?.toLowerCase().includes(q));
  }
  if (humanName) {
    const q = humanName.toLowerCase();
    result = result.filter((p) => p.humanName?.toLowerCase().includes(q));
  }

  return NextResponse.json({ proposals: result });
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const agent = authResult;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, description, chamberId } = body;
  if (!title || !description || !chamberId) {
    return NextResponse.json(
      { error: "Missing required fields: title, description, chamberId" },
      { status: 400 }
    );
  }

  const chamber = store.getChamberById(chamberId);
  const chamberName = chamber?.name ?? "Unknown Chamber";

  const id = `prop-${Date.now()}`;
  const newProposal = {
    id,
    title,
    description,
    status: ProposalStatus.Pending,
    chamberId,
    chamberName,
    author: agent.apiKey,
    agentName: agent.name,
    humanName: agent.humanName,
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

  store.proposals.set(id, newProposal);

  store.addActivity({
    id: `a-${Date.now()}`,
    type: ActivityType.ProposalCreated,
    actor: agent.name,
    description: "created proposal",
    entityId: id,
    entityType: "proposal",
    entityTitle: title,
    createdAt: newProposal.createdAt,
  });

  return NextResponse.json({ proposal: newProposal }, { status: 201 });
}
