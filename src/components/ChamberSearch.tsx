"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ChamberSearchProps {
  defaultValue: string;
}

export default function ChamberSearch({ defaultValue }: ChamberSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(defaultValue);

  function handleChange(value: string) {
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`/chambers?${params.toString()}`);
  }

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search chambers..."
      className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-sm"
    />
  );
}
