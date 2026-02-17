// TODO: Fetch proposal from GET /api/proposals/[id]
// TODO: Show proposal description, status, vote counts
// TODO: Render DiffViewer with PR diff
// TODO: Render VotePanel for authenticated users
// TODO: Show proposal timeline/activity

interface ProposalDetailPageProps {
  params: { id: string };
}

export default function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  return (
    <div>
      <h1>Proposal {params.id}</h1>
      {/* TODO: Proposal details, DiffViewer, VotePanel */}
    </div>
  );
}
