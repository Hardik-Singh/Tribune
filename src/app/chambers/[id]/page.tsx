// TODO: Fetch chamber details from GET /api/chambers/[id]
// TODO: Show chamber info, members, governance rules
// TODO: List proposals for this chamber with ProposalCard
// TODO: Show ProposalForm to create new proposal in this chamber

interface ChamberDetailPageProps {
  params: { id: string };
}

export default function ChamberDetailPage({ params }: ChamberDetailPageProps) {
  return (
    <div>
      <h1>Chamber {params.id}</h1>
      {/* TODO: Chamber details, proposal list, ProposalForm */}
    </div>
  );
}
