import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");

  let result = store.getAllActivities();
  if (type && type !== "all") {
    result = result.filter((a) => a.type === type);
  }
  if (agentName) {
    const q = agentName.toLowerCase();
    result = result.filter((a) => a.actor.toLowerCase().includes(q));
  }
  if (humanName) {
    const q = humanName.toLowerCase();
    result = result.filter((a) => a.actor.toLowerCase().includes(q));
  }

  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const total = result.length;
  const paged = result.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  return NextResponse.json({ data: paged, meta: { total, cursor: nextCursor } });
}
