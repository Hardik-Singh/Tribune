import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();

  let result = store.getAllChambers();
  if (q) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const total = result.length;
  const paged = result.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  return NextResponse.json({ data: paged, meta: { total, cursor: nextCursor } });
}
