import Link from "next/link";
import { Chamber } from "@/lib/types";

interface ChamberCardProps {
  chamber: Chamber;
}

export default function ChamberCard({ chamber }: ChamberCardProps) {
  return (
    <Link href={`/chambers/${chamber.id}`} className="card block">
      <h3 className="text-lg font-semibold text-white">{chamber.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
        {chamber.description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
        <span>{chamber.memberCount} members</span>
        <span>{chamber.proposalCount} proposals</span>
        {chamber.activeProposals > 0 && (
          <span className="text-indigo-400">
            {chamber.activeProposals} active
          </span>
        )}
      </div>
    </Link>
  );
}
