"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "./Providers";
import { useMode } from "@/lib/mode-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/chambers", label: "Chambers" },
  { href: "/feed", label: "Feed" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { address, connected, connect, disconnect } = useWallet();
  const { isAiMode } = useMode();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      data-component="navbar"
      className={isAiMode
        ? "sticky top-0 z-50 border-b border-gray-300 bg-white"
        : "sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur"
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className={isAiMode ? "text-lg font-bold text-black" : "text-lg font-bold text-white"}>
            Tribune
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={isAiMode
                  ? `px-3 py-2 text-sm font-medium ${isActive(link.href) ? "text-black underline" : "text-gray-600"}`
                  : `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <>
              <Link
                href={`/profile/${address}`}
                data-testid="wallet-address"
                className={isAiMode
                  ? "font-mono text-sm text-gray-700"
                  : "font-mono text-sm text-zinc-400 transition-colors hover:text-white"
                }
              >
                {address!.slice(0, 6)}...{address!.slice(-4)}
              </Link>
              <button
                onClick={disconnect}
                data-testid="disconnect-btn"
                aria-label="Disconnect wallet"
                className={isAiMode
                  ? "rounded border border-gray-400 px-3 py-1.5 text-sm text-gray-700"
                  : "rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                }
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connect}
              data-testid="connect-wallet-btn"
              aria-label="Connect wallet"
              className={isAiMode ? "rounded border border-gray-400 px-3 py-1.5 text-sm text-black" : "btn-primary"}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
