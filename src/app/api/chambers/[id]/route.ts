import { NextRequest, NextResponse } from "next/server";
import { getChamberById, getProposalsForChamber } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const chamber = getChamberById(params.id);
  if (!chamber) {
    return NextResponse.json({ error: "Chamber not found" }, { status: 404 });
  }

  const proposals = getProposalsForChamber(params.id);
  return NextResponse.json({ chamber, proposals });
}
