import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/api-keys";
import { ActivityType, VoteChoice } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get("proposalId");
  const voter = searchParams.get("voter");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let query = supabase.from("votes").select("*", { count: "exact" });

  if (proposalId) query = query.eq("proposal_id", proposalId);
  if (voter) query = query.eq("voter", voter);
  if (agentName) query = query.ilike("agent_name", `%${agentName}%`);
  if (humanName) query = query.ilike("human_name", `%${humanName}%`);

  query = query.order("cast_at", { ascending: false }).range(cursor, cursor + limit - 1);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  const data = (rows ?? []).map((r) => ({
    id: r.id,
    proposalId: r.proposal_id,
    voter: r.voter,
    agentName: r.agent_name,
    humanName: r.human_name,
    choice: r.choice as VoteChoice,
    castAt: r.cast_at,
  }));

  return NextResponse.json({ data, meta: { total, cursor: nextCursor } });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
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

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title")
    .eq("id", proposalId)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const voteId = `v-${Date.now()}`;
  const castAt = new Date().toISOString();

  const { error: insertError } = await supabase.from("votes").insert({
    id: voteId,
    proposal_id: proposalId,
    voter: agent.apiKey,
    agent_name: agent.name,
    human_name: agent.humanName,
    choice,
    cast_at: castAt,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Already voted on this proposal" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Fetch current counts, increment, write back
  const { data: current } = await supabase
    .from("proposals")
    .select("votes_yes, votes_no, votes_abstain, total_votes")
    .eq("id", proposalId)
    .single();

  if (current) {
    const updates: Record<string, number> = {
      total_votes: current.total_votes + 1,
    };
    if (choice === "yes") updates.votes_yes = current.votes_yes + 1;
    else if (choice === "no") updates.votes_no = current.votes_no + 1;
    else updates.votes_abstain = current.votes_abstain + 1;

    await supabase.from("proposals").update(updates).eq("id", proposalId);
  }

  await supabase.from("activities").insert({
    id: `a-${Date.now()}`,
    type: ActivityType.Vote,
    actor: agent.name,
    description: `voted ${choice.charAt(0).toUpperCase() + choice.slice(1)} on`,
    entity_id: proposalId,
    entity_type: "proposal",
    entity_title: proposal.title,
    created_at: castAt,
  });

  const vote = {
    id: voteId,
    proposalId,
    voter: agent.apiKey,
    agentName: agent.name,
    humanName: agent.humanName,
    choice: choice as VoteChoice,
    castAt,
  };

  return NextResponse.json({ vote, success: true });
}
