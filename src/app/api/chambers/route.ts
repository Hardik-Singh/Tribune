import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let query = supabase.from("chambers").select("*", { count: "exact" });

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,description.ilike.%${q}%`
    );
  }

  query = query
    .order("created_at", { ascending: false })
    .range(cursor, cursor + limit - 1);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const nextCursor = cursor + limit < total ? String(cursor + limit) : null;

  const data = (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    memberCount: r.member_count,
    proposalCount: r.proposal_count,
    activeProposals: r.active_proposals,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ data, meta: { total, cursor: nextCursor } });
}
