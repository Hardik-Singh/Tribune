// TODO: Display chamber name, description, member count, active proposals count
// TODO: Link to /chambers/[id]

interface ChamberCardProps {
  id: string;
  name: string;
  description: string;
  // TODO: Add full chamber type from SDK
}

export default function ChamberCard({ id: _id, name, description }: ChamberCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
      {/* TODO: Member count, proposal count, link */}
    </div>
  );
}
