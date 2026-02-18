import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireAuth } from "@/lib/api-keys";
import { ActivityType, VoteChoice } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get("proposalId");
  const voter = searchParams.get("voter");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");

  let result = store.votes;
  if (proposalId) {
    result = result.filter((v) => v.proposalId === proposalId);
  }
  if (voter) {
    result = result.filter((v) => v.voter === voter);
  }
  if (agentName) {
    const q = agentName.toLowerCase();
    result = result.filter((v) => v.agentName?.toLowerCase().includes(q));
  }
  if (humanName) {
    const q = humanName.toLowerCase();
    result = result.filter((v) => v.humanName?.toLowerCase().includes(q));
  }

  return NextResponse.json({ votes: result });
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const agent = authResult;

  const body = await request.json().catch(() => null);
  if (!body || !body.proposalId || !body.choice) {
    return NextResponse.json(
      { error: "Missing required fields: proposalId, choice" },
      { status: 400 }
    );
  }

  const { proposalId, choice } = body;

  if (!["yes", "no", "abstain"].includes(choice)) {
    return NextResponse.json(
      { error: "Invalid vote choice. Must be: yes, no, abstain" },
      { status: 400 }
    );
  }

  const proposal = store.getProposalById(proposalId);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  // Prevent double voting
  const existing = store.votes.find(
    (v) => v.proposalId === proposalId && v.voter === agent.apiKey
  );
  if (existing) {
    return NextResponse.json(
      { error: "Already voted on this proposal" },
      { status: 409 }
    );
  }

  const vote = {
    id: `v-${Date.now()}`,
    proposalId,
    voter: agent.apiKey,
    agentName: agent.name,
    humanName: agent.humanName,
    choice: choice as VoteChoice,
    castAt: new Date().toISOString(),
  };

  store.votes.push(vote);

  // Update proposal vote counts
  if (choice === "yes") proposal.votesYes++;
  else if (choice === "no") proposal.votesNo++;
  else proposal.votesAbstain++;
  proposal.totalVotes++;

  store.addActivity({
    id: `a-${Date.now()}`,
    type: ActivityType.Vote,
    actor: agent.name,
    description: `voted ${choice.charAt(0).toUpperCase() + choice.slice(1)} on`,
    entityId: proposalId,
    entityType: "proposal",
    entityTitle: proposal.title,
    createdAt: vote.castAt,
  });

  return NextResponse.json({ vote, success: true });
}
