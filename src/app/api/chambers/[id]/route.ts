import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: row } = await supabase
    .from("chambers")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) {
    return NextResponse.json({ error: "Chamber not found" }, { status: 404 });
  }

  const chamber = {
    id: row.id,
    name: row.name,
    description: row.description,
    memberCount: row.member_count,
    proposalCount: row.proposal_count,
    activeProposals: row.active_proposals,
    createdAt: row.created_at,
  };

  const { data: proposalRows } = await supabase
    .from("proposals")
    .select("*")
    .eq("chamber_id", id)
    .order("created_at", { ascending: false });

  const proposals = (proposalRows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
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
  }));

  return NextResponse.json({ chamber, proposals });
}
