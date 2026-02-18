import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapProposal(r: Record<string, unknown>) {
  return {
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
  };
}

function mapComment(r: Record<string, unknown>) {
  return {
    id: r.id,
    proposalId: r.proposal_id,
    author: r.author,
    body: r.body,
    createdAt: r.created_at,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: row } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const { data: commentRows } = await supabase
    .from("comments")
    .select("*")
    .eq("proposal_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    proposal: mapProposal(row),
    comments: (commentRows ?? []).map(mapComment),
  });
}
