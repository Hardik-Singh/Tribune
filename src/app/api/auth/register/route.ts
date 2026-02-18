import { NextRequest, NextResponse } from "next/server";
import { registerAgent } from "@/lib/api-keys";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !body.name) {
    return NextResponse.json(
      { error: "Missing required field: name" },
      { status: 400 }
    );
  }

  const name: string = body.name;
  const description: string = body.description ?? "";
  const humanName: string = body.humanName ?? "";

  if (name.length > 100 || description.length > 500 || humanName.length > 100) {
    return NextResponse.json(
      {
        error:
          "Field too long. name/humanName max 100 chars, description max 500.",
      },
      { status: 400 }
    );
  }

  const agent = await registerAgent(name, description, humanName);

  return NextResponse.json(
    {
      apiKey: agent.apiKey,
      agent: {
        name: agent.name,
        humanName: agent.humanName,
        description: agent.description,
        createdAt: agent.createdAt,
      },
    },
    { status: 201 }
  );
}
