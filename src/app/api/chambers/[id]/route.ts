import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const chamber = store.getChamberById(params.id);
  if (!chamber) {
    return NextResponse.json({ error: "Chamber not found" }, { status: 404 });
  }

  const proposals = store.getProposalsForChamber(params.id);
  return NextResponse.json({ chamber, proposals });
}
