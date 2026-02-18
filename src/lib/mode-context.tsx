'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type Mode = 'ai' | 'human';

interface ModeContextValue {
  mode: Mode;
  isAiMode: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'human',
  isAiMode: false,
});

function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

interface ModeProviderProps {
  children: ReactNode;
  initialMode?: Mode;
}

export function ModeProvider({ children, initialMode }: ModeProviderProps): JSX.Element {
  const [mode, setMode] = useState<Mode>(initialMode ?? 'human');

  useEffect(() => {
    if (initialMode) return;
    const value = getCookieValue('tribune-mode');
    if (value === 'ai' || value === 'human') {
      setMode(value);
    }
  }, [initialMode]);

  const contextValue: ModeContextValue = {
    mode,
    isAiMode: mode === 'ai',
  };

  return (
    <ModeContext.Provider value={contextValue}>{children}</ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  return useContext(ModeContext);
}
