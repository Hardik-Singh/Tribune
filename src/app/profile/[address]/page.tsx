import Link from "next/link";
import { getUserProfile } from "@/lib/mock-data";
import { store } from "@/lib/store";
import ReputationBadge from "@/components/ReputationBadge";
import ProposalCard from "@/components/ProposalCard";

interface ProfilePageProps {
  params: { address: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = getUserProfile(params.address);
  if (!profile) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-4 font-mono text-sm text-zinc-400">
          {params.address}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          No profile data found for this address.
        </p>
      </div>
    );
  }

  const rep = profile.reputation;

  return (
    <div>
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-mono text-lg font-bold text-white">
            {params.address.slice(0, 10)}...{params.address.slice(-6)}
          </h1>
          <div className="mt-1">
            <ReputationBadge tier={rep.tier} score={rep.score} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Score", value: rep.score },
          { label: "Voting Power", value: `${rep.votingPower}x` },
          { label: "Proposals", value: rep.proposalsCreated },
          { label: "Votes Cast", value: rep.votesCast },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-surface p-4 text-center"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Chambers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.chambers.map((cId) => {
            const chamber = store.getChamberById(cId);
            return chamber ? (
              <Link
                key={cId}
                href={`/chambers/${cId}`}
                className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                {chamber.name}
              </Link>
            ) : null;
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Recent Proposals</h2>
        <div className="mt-4 space-y-4">
          {profile.recentProposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
          {profile.recentProposals.length === 0 && (
            <p className="text-sm text-zinc-500">No proposals yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Recent Votes</h2>
        <div className="mt-3 space-y-2">
          {profile.recentVotes.map((v) => (
            <div
              key={v.proposalId}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-surface px-4 py-3"
            >
              <Link
                href={`/proposals/${v.proposalId}`}
                className="text-sm text-zinc-300 hover:text-accent-light"
              >
                {v.proposalTitle}
              </Link>
              <span
                className={`text-xs font-medium ${
                  v.choice === "yes"
                    ? "text-vote-yes"
                    : v.choice === "no"
                    ? "text-vote-no"
                    : "text-zinc-500"
                }`}
              >
                {v.choice.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
