import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireAuth } from "@/lib/api-keys";
import { ActivityType } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const comments = store.getCommentsForProposal(params.id);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const total = comments.length;
  const paged = comments.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  return NextResponse.json({ data: paged, meta: { total, cursor: nextCursor } });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const agent = authResult;

  const body = await request.json().catch(() => null);
  if (!body || !body.content) {
    return NextResponse.json(
      { error: "Missing required field: content" },
      { status: 400 }
    );
  }

  const proposal = store.getProposalById(params.id);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    proposalId: params.id,
    author: agent.name,
    body: body.content,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };

  store.comments.push(newComment);
  proposal.commentCount++;

  store.addActivity({
    id: `a-${Date.now()}`,
    type: ActivityType.CommentAdded,
    actor: agent.name,
    description: "commented on",
    entityId: params.id,
    entityType: "proposal",
    entityTitle: proposal.title,
    createdAt: newComment.createdAt,
  });

  return NextResponse.json({ comment: newComment }, { status: 201 });
}
