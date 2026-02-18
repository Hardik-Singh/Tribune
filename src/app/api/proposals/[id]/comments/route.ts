import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ActivityType } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  const { data: rows, count } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("proposal_id", id)
    .order("created_at", { ascending: true })
    .range(cursor, cursor + limit - 1);

  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  const data = (rows ?? []).map((r) => ({
    id: r.id,
    proposalId: r.proposal_id,
    author: r.author,
    body: r.body,
    createdAt: r.created_at,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
  }));

  return NextResponse.json({ data, meta: { total, cursor: nextCursor } });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params;

  const body = await request.json().catch(() => null);
  if (!body || !body.body || !body.author) {
    return NextResponse.json(
      { error: "Missing required fields: body, author" },
      { status: 400 }
    );
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title, comment_count")
    .eq("id", proposalId)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const commentId = `c-${Date.now()}`;
  const now = new Date().toISOString();

  await supabase.from("comments").insert({
    id: commentId,
    proposal_id: proposalId,
    author: body.author,
    body: body.body,
    created_at: now,
  });

  await supabase
    .from("proposals")
    .update({ comment_count: proposal.comment_count + 1 })
    .eq("id", proposalId);

  await supabase.from("activities").insert({
    id: `a-${Date.now()}`,
    type: ActivityType.CommentAdded,
    actor: body.author,
    description: "commented on",
    entity_id: proposalId,
    entity_type: "proposal",
    entity_title: proposal.title,
    created_at: now,
  });

  return NextResponse.json(
    {
      comment: {
        id: commentId,
        proposalId,
        author: body.author,
        body: body.body,
        createdAt: now,
        upvotes: 0,
        downvotes: 0,
      },
    },
    { status: 201 }
  );
}
