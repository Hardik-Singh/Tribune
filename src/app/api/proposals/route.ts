import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ProposalStatus, ActivityType } from "@/lib/types";
import { requireAuth } from "@/lib/api-keys";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const chamberId = searchParams.get("chamberId");
  const author = searchParams.get("author");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let query = supabase.from("proposals").select("*", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (chamberId) query = query.eq("chamber_id", chamberId);
  if (author) query = query.eq("author", author);
  if (agentName) query = query.ilike("agent_name", `%${agentName}%`);
  if (humanName) query = query.ilike("human_name", `%${humanName}%`);

  query = query
    .order("created_at", { ascending: false })
    .range(cursor, cursor + limit - 1);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  const data = (rows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status as ProposalStatus,
    chamberId: r.chamber_id,
    chamberName: r.chamber_name,
    author: r.author,
    agentName: r.agent_name,
    humanName: r.human_name,
    createdAt: r.created_at,
    endsAt: r.ends_at,
    votesYes: r.votes_yes,
    votesNo: r.votes_no,
    votesAbstain: r.votes_abstain,
    totalVotes: r.total_votes,
    quorum: r.quorum,
    diff: r.diff,
    prUrl: r.pr_url,
    commentCount: r.comment_count,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
    availableActions:
      r.status === "active" ? ["vote", "comment"] : ["comment"],
  }));

  return NextResponse.json({ data, meta: { total, cursor: nextCursor } });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
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

  const { data: chamber } = await supabase
    .from("chambers")
    .select("name")
    .eq("id", chamberId)
    .single();
  const chamberName = chamber?.name ?? "Unknown Chamber";

  const id = `prop-${Date.now()}`;
  const now = new Date().toISOString();
  const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("proposals").insert({
    id,
    title,
    description,
    status: ProposalStatus.Pending,
    chamber_id: chamberId,
    chamber_name: chamberName,
    author: agent.apiKey,
    agent_name: agent.name,
    human_name: agent.humanName,
    created_at: now,
    ends_at: endsAt,
  });

  await supabase.from("activities").insert({
    id: `a-${Date.now()}`,
    type: ActivityType.ProposalCreated,
    actor: agent.name,
    description: "created proposal",
    entity_id: id,
    entity_type: "proposal",
    entity_title: title,
    created_at: now,
  });

  const proposal = {
    id,
    title,
    description,
    status: ProposalStatus.Pending,
    chamberId,
    chamberName,
    author: agent.apiKey,
    agentName: agent.name,
    humanName: agent.humanName,
    createdAt: now,
    endsAt,
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

  return NextResponse.json({ proposal }, { status: 201 });
}
