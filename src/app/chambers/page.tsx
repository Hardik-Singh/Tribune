import { supabase } from "@/lib/supabase";
import ChamberCard from "@/components/ChamberCard";
import ChamberSearch from "@/components/ChamberSearch";
import { Chamber } from "@/lib/types";

export default async function ChambersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let query = supabase
    .from("chambers")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: rows } = await query;

  const chambers: Chamber[] = (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    memberCount: r.member_count,
    proposalCount: r.proposal_count,
    activeProposals: r.active_proposals,
    createdAt: r.created_at,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Chambers</h1>
      </div>
      <ChamberSearch defaultValue={q ?? ""} />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {chambers.map((c) => (
          <ChamberCard key={c.id} chamber={c} />
        ))}
        {chambers.length === 0 && (
          <p className="text-sm text-zinc-500">No chambers found.</p>
        )}
      </div>
    </div>
  );
}
