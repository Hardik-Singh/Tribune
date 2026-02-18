"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ModeProvider } from "@/lib/mode-context";

interface WalletState {
  address: string | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState>({
  address: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

const MOCK_ADDRESS = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";

interface ProvidersProps {
  children: React.ReactNode;
  initialMode?: "ai" | "human";
}

export default function Providers({ children, initialMode }: ProvidersProps) {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(() => {
    setAddress(MOCK_ADDRESS);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, connected: !!address, connect, disconnect }}
    >
      <ModeProvider initialMode={initialMode}>{children}</ModeProvider>
    </WalletContext.Provider>
  );
}
