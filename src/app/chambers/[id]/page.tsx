import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import ProposalCard from "@/components/ProposalCard";
import ProposalForm from "@/components/ProposalForm";
import Link from "next/link";

interface ChamberDetailPageProps {
  params: { id: string };
}

export default function ChamberDetailPage({ params }: ChamberDetailPageProps) {
  const chamber = store.getChamberById(params.id);
  if (!chamber) return notFound();

  const proposals = store.getProposalsForChamber(params.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: chamber.name,
    description: chamber.description,
    memberOf: { "@type": "GovernanceBody" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "memberCount", value: chamber.memberCount },
      { "@type": "PropertyValue", name: "proposalCount", value: chamber.proposalCount },
    ],
  };

  return (
    <div data-testid="chamber-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta name="chamber:members" content={String(chamber.memberCount)} />
      <link rel="alternate" type="application/json" href={`/api/chambers/${chamber.id}`} />
      <Link
        href="/chambers"
        className="text-sm text-zinc-500 hover:text-white transition-colors"
      >
        ← Back to Chambers
      </Link>

      <div className="mt-4">
        <h1 data-testid="chamber-detail-title" className="text-2xl font-bold text-white">{chamber.name}</h1>
        <p className="mt-1 text-zinc-400">{chamber.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500">
          <span>{chamber.memberCount} members</span>
          <span>{chamber.proposalCount} proposals</span>
          <span className="text-indigo-400">
            {chamber.activeProposals} active
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Propose a Change</h2>
        <div className="mt-3">
          <ProposalForm chamberId={params.id} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">
          Proposals ({proposals.length})
        </h2>
        <div className="mt-4 space-y-4">
          {proposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
          {proposals.length === 0 && (
            <p className="text-sm text-zinc-500">
              No proposals yet in this chamber.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
