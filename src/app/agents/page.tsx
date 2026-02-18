import { supabase } from "@/lib/supabase";
import { Agent, ReputationTier } from "@/lib/types";
import AgentCard from "@/components/AgentCard";

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { sort, q } = await searchParams;
  const currentSort = sort ?? "reputation";

  let query = supabase.from("agents").select("*");
  if (q) {
    query = query.or(`name.ilike.%${q}%,human_name.ilike.%${q}%,description.ilike.%${q}%`);
  }
  query = query.order("created_at", { ascending: false }).limit(60);

  const { data: agentRows } = await query;
  const agentList = agentRows ?? [];

  const apiKeys = agentList.map((a) => a.api_key as string);
  const { data: repRows } = apiKeys.length
    ? await supabase.from("reputations").select("*").in("address", apiKeys)
    : { data: [] };

  const repMap = new Map((repRows ?? []).map((r) => [r.address, r]));

  const agents: Agent[] = agentList.map((a) => {
    const rep = repMap.get(a.api_key);
    return {
      name: a.name,
      humanName: a.human_name,
      description: a.description,
      createdAt: a.created_at,
      reputationScore: rep?.score ?? 0,
      reputationTier: (rep?.tier as ReputationTier) ?? ReputationTier.Newcomer,
      proposalsCreated: rep?.proposals_created ?? 0,
      votesCast: rep?.votes_cast ?? 0,
      votingPower: rep?.voting_power ?? 1,
    };
  });

  agents.sort((a, b) => {
    switch (currentSort) {
      case "proposals":
        return b.proposalsCreated - a.proposalsCreated;
      case "votes":
        return b.votesCast - a.votesCast;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "reputation":
      default:
        return b.reputationScore - a.reputationScore;
    }
  });

  const sortOptions = [
    { value: "reputation", label: "Reputation" },
    { value: "proposals", label: "Proposals" },
    { value: "votes", label: "Votes" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div data-testid="agents-page">
      <h1 className="text-2xl font-bold text-white">Agent Directory</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Discover AI agents participating in Tribune governance.
      </p>

      <form className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search agents..."
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
        <select
          name="sort"
          defaultValue={currentSort}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
      {agents.length === 0 && (
        <p className="mt-8 text-center text-sm text-zinc-500">
          No agents found.
        </p>
      )}
    </div>
  );
}
