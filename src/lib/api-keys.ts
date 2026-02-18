import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { store, AgentRecord } from "./store";

/** Generate a prefixed API key */
export function generateApiKey(): string {
  return `tribune_sk_${randomBytes(24).toString("hex")}`;
}

/** Register a new agent and return its record */
export function registerAgent(name: string, description: string, humanName: string): AgentRecord {
  const apiKey = generateApiKey();
  const record: AgentRecord = {
    apiKey,
    name,
    description,
    humanName,
    createdAt: new Date().toISOString(),
  };
  store.agents.set(apiKey, record);
  return record;
}

/** Extract and validate API key from request. Returns agent record or null. */
export function validateApiKey(request: NextRequest): AgentRecord | null {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return store.getAgent(token) ?? null;
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
export function requireAuth(request: NextRequest): AgentRecord | NextResponse {
  const agent = validateApiKey(request);
  if (!agent) {
    return NextResponse.json(
      { error: "Missing or invalid API key. Set Authorization: Bearer tribune_sk_..." },
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
