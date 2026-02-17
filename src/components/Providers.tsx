"use client";

import React from "react";

// TODO: Initialize @invariance/sdk provider with wallet connection
// TODO: Wrap children with SDK context provider and auth provider
// TODO: Handle wallet connect/disconnect state

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
