"use client";

import { useState } from "react";
import { chambers } from "@/lib/mock-data";
import ChamberCard from "@/components/ChamberCard";

export default function ChambersPage() {
  const [search, setSearch] = useState("");

  const filtered = chambers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Chambers</h1>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search chambers..."
        className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-sm"
      />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <ChamberCard key={c.id} chamber={c} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500">No chambers found.</p>
        )}
      </div>
    </div>
  );
}
