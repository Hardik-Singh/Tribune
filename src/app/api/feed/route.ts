import { NextRequest, NextResponse } from "next/server";
import { activities } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let result = activities;
  if (type && type !== "all") {
    result = activities.filter((a) => a.type === type);
  }

  return NextResponse.json({ activities: result });
}
