import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  // Stub: webhook signature verification and event handling
  // will be implemented when GitHub integration is connected
  return NextResponse.json({ received: true });
}
