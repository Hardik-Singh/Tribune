import { NextRequest, NextResponse } from "next/server";
import { getProposalById, getCommentsForProposal } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const proposal = getProposalById(params.id);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const comments = getCommentsForProposal(params.id);
  return NextResponse.json({ proposal, comments });
}
