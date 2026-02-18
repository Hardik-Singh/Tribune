import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabase } from "./supabase";

/** Agent metadata stored alongside API keys */
export interface AgentRecord {
  apiKey: string;
  name: string;
  description: string;
  humanName: string;
  createdAt: string;
}

/** Generate a prefixed API key */
export function generateApiKey(): string {
  return `tribune_sk_${randomBytes(24).toString("hex")}`;
}

/** Register a new agent and return its record */
export async function registerAgent(
  name: string,
  description: string,
  humanName: string
): Promise<AgentRecord> {
  const apiKey = generateApiKey();
  const createdAt = new Date().toISOString();

  await supabase.from("agents").insert({
    api_key: apiKey,
    name,
    description,
    human_name: humanName,
    created_at: createdAt,
  });

  return { apiKey, name, description, humanName, createdAt };
}

/** Extract and validate API key from request. Returns agent record or null. */
export async function validateApiKey(
  request: NextRequest
): Promise<AgentRecord | null> {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("api_key", token)
    .single();

  if (!data) return null;
  return {
    apiKey: data.api_key,
    name: data.name,
    description: data.description,
    humanName: data.human_name,
    createdAt: data.created_at,
  };
}

/** Simple per-key rate limiter: 60 requests/minute */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  let bucket = buckets.get(apiKey);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + 60_000 };
    buckets.set(apiKey, bucket);
  }
  bucket.count++;
  return bucket.count <= 60;
}

/**
 * Middleware helper: validates API key + rate limit.
 * Returns the agent record on success, or a NextResponse error to return early.
 */
export async function requireAuth(
  request: NextRequest
): Promise<AgentRecord | NextResponse> {
  const agent = await validateApiKey(request);
  if (!agent) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid API key. Set Authorization: Bearer tribune_sk_...",
      },
      { status: 401 }
    );
  }
  if (!checkRateLimit(agent.apiKey)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 60 requests/minute." },
      { status: 429 }
    );
  }
  return agent;
}
