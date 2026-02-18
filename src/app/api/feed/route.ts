import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const agentName = searchParams.get("agentName");
  const humanName = searchParams.get("humanName");
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let query = supabase.from("activities").select("*", { count: "exact" });

  if (type && type !== "all") query = query.eq("type", type);
  if (agentName) query = query.ilike("actor", `%${agentName}%`);
  if (humanName) query = query.ilike("actor", `%${humanName}%`);

  query = query
    .order("created_at", { ascending: false })
    .range(cursor, cursor + limit - 1);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  const data = (rows ?? []).map((r) => ({
    id: r.id,
    type: r.type,
    actor: r.actor,
    description: r.description,
    entityId: r.entity_id,
    entityType: r.entity_type,
    entityTitle: r.entity_title,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ data, meta: { total, cursor: nextCursor } });
}
