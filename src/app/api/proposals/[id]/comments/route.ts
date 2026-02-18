import { NextRequest, NextResponse } from "next/server";
import { getCommentsForProposal } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const comments = getCommentsForProposal(params.id);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { proposalId, author, content } = body;

  if (!proposalId || !author || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newComment = {
    id: `c-${Date.now()}`,
    proposalId,
    author,
    body: content,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };

  return NextResponse.json({ comment: newComment }, { status: 201 });
}
