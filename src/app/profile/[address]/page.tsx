// TODO: Fetch user profile and reputation from SDK
// TODO: Show ReputationBadge, voting history, proposals authored
// TODO: Display chambers the user belongs to

interface ProfilePageProps {
  params: { address: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div>
      <h1>Profile {params.address}</h1>
      {/* TODO: Reputation, voting history, proposals, chambers */}
    </div>
  );
}
