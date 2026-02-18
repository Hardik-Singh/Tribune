import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !body.actor || ![-1, 1].includes(body.value)) {
    return NextResponse.json(
      { error: "Missing required fields: actor, value (1 or -1)" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("toggle_reaction", {
    p_entity_type: "proposal",
    p_entity_id: id,
    p_actor: body.actor,
    p_value: body.value,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
