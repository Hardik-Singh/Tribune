import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const proposal = store.getProposalById(params.id);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const comments = store.getCommentsForProposal(params.id);
  return NextResponse.json({ proposal, comments });
}
