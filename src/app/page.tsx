import Link from "next/link";
import { proposals, chambers, activities, timeAgo } from "@/lib/mock-data";
import { ProposalStatus } from "@/lib/types";
import ProposalCard from "@/components/ProposalCard";
import ActivityItem from "@/components/ActivityItem";

export default function Home() {
  const activeProposals = proposals.filter(
    (p) => p.status === ProposalStatus.Active
  );
  const topProposals = [...proposals]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 4);
  const recentlyResolved = proposals.filter(
    (p) =>
      p.status === ProposalStatus.Passed ||
      p.status === ProposalStatus.Rejected
  );
  const recentActivity = activities.slice(0, 5);

  const totalVotes = proposals.reduce((s, p) => s + p.totalVotes, 0);
  const totalMembers = chambers.reduce((s, c) => s + c.memberCount, 0);

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Active Proposals", value: activeProposals.length },
          { label: "Total Votes Cast", value: totalVotes },
          { label: "Chambers", value: chambers.length },
          { label: "Members", value: totalMembers },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-surface px-4 py-3"
          >
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active votes — the main event */}
      {activeProposals.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Active Votes
            </h2>
            <Link
              href="/chambers"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              All chambers
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeProposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Highest voted — left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-white">
              Highest Voted
            </h2>
            <div className="mt-3 space-y-3">
              {topProposals.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/proposals/${p.id}`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-surface px-4 py-3 transition-colors hover:border-zinc-700"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {p.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{p.chamberName}</span>
                      <span>{p.totalVotes} votes</span>
                      <span
                        className={
                          p.status === ProposalStatus.Active
                            ? "text-indigo-400"
                            : p.status === ProposalStatus.Passed
                            ? "text-emerald-400"
                            : p.status === ProposalStatus.Rejected
                            ? "text-red-400"
                            : "text-zinc-500"
                        }
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                  {p.totalVotes > 0 && (
                    <div className="flex w-24 flex-shrink-0 flex-col items-end gap-1">
                      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="bg-vote-yes"
                          style={{
                            width: `${(p.votesYes / p.totalVotes) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-vote-no"
                          style={{
                            width: `${(p.votesNo / p.totalVotes) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        {Math.round((p.votesYes / p.totalVotes) * 100)}% yes
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Recently resolved */}
          <section>
            <h2 className="text-lg font-semibold text-white">
              Recently Resolved
            </h2>
            <div className="mt-3 space-y-3">
              {recentlyResolved.map((p) => (
                <Link
                  key={p.id}
                  href={`/proposals/${p.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-surface px-4 py-3 transition-colors hover:border-zinc-700"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {p.chamberName} · {timeAgo(p.endsAt)}
                    </p>
                  </div>
                  <span
                    className={`ml-4 flex-shrink-0 text-xs font-medium ${
                      p.status === ProposalStatus.Passed
                        ? "badge-passed"
                        : "badge-rejected"
                    }`}
                  >
                    {p.status}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar — activity + chambers */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Recent Activity
              </h2>
              <Link
                href="/feed"
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="mt-3 rounded-xl border border-zinc-800 bg-surface divide-y divide-zinc-800">
              {recentActivity.map((a) => (
                <ActivityItem key={a.id} activity={a} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Chambers</h2>
              <Link
                href="/chambers"
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {chambers.map((c) => (
                <Link
                  key={c.id}
                  href={`/chambers/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-surface px-4 py-3 transition-colors hover:border-zinc-700"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-zinc-500">
                      {c.memberCount} members
                    </p>
                  </div>
                  {c.activeProposals > 0 && (
                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                      {c.activeProposals} active
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
