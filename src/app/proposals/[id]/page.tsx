import { notFound } from "next/navigation";
import Link from "next/link";
import { getProposalById, getCommentsForProposal, timeAgo } from "@/lib/mock-data";
import { ProposalStatus } from "@/lib/types";
import DiffViewer from "@/components/DiffViewer";
import VotePanel from "@/components/VotePanel";
import CommentSection from "@/components/CommentSection";

const statusBadge: Record<ProposalStatus, string> = {
  [ProposalStatus.Active]: "badge-active",
  [ProposalStatus.Passed]: "badge-passed",
  [ProposalStatus.Rejected]: "badge-rejected",
  [ProposalStatus.Pending]: "badge-pending",
};

interface ProposalDetailPageProps {
  params: { id: string };
}

export default function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const proposal = getProposalById(params.id);
  if (!proposal) return notFound();

  const comments = getCommentsForProposal(params.id);

  return (
    <div>
      <Link
        href={`/chambers/${proposal.chamberId}`}
        className="text-sm text-zinc-500 transition-colors hover:text-white"
      >
        ← {proposal.chamberName}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className={statusBadge[proposal.status]}>
                {proposal.status}
              </span>
              <span className="text-xs text-zinc-500">
                {timeAgo(proposal.createdAt)}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white">
              {proposal.title}
            </h1>
            <p className="mt-2 text-zinc-400">{proposal.description}</p>
            <p className="mt-2 font-mono text-xs text-zinc-600">
              by {proposal.author.slice(0, 10)}...{proposal.author.slice(-6)}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-white">
              Code Changes
            </h2>
            <DiffViewer diff={proposal.diff} />
          </div>

          <CommentSection
            proposalId={proposal.id}
            initialComments={comments}
          />
        </div>

        <div className="space-y-6">
          <VotePanel proposal={proposal} />

          <div className="rounded-xl border border-zinc-800 bg-surface p-5">
            <h3 className="text-sm font-semibold text-white">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Chamber</dt>
                <dd>
                  <Link
                    href={`/chambers/${proposal.chamberId}`}
                    className="text-accent-light hover:underline"
                  >
                    {proposal.chamberName}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Ends</dt>
                <dd className="text-zinc-300">
                  {new Date(proposal.endsAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Quorum</dt>
                <dd className="text-zinc-300">{proposal.quorum} votes</dd>
              </div>
              {proposal.prUrl && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">PR</dt>
                  <dd>
                    <a
                      href={proposal.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-light hover:underline"
                    >
                      View on GitHub
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
