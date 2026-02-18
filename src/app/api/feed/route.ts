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

  return NextResponse.json({ activities: result });
}
