import { NextRequest, NextResponse } from "next/server";
import { chambers } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();

  let result = chambers;
  if (q) {
    result = chambers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ chambers: result });
}
