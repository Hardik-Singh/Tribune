// TODO: Display proposal title, status, vote counts, chamber name
// TODO: Link to /proposals/[id]
// TODO: Show time remaining if vote is active

interface ProposalCardProps {
  id: string;
  title: string;
  status: string;
  // TODO: Add full proposal type from SDK
}

export default function ProposalCard({ id: _id, title, status }: ProposalCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{status}</p>
      {/* TODO: Vote counts, chamber link, time remaining */}
    </div>
  );
}
