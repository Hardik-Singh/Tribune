import {
  Chamber,
  Proposal,
  ProposalStatus,
  Comment,
  Activity,
  ActivityType,
  UserProfile,
  UserReputation,
  ReputationTier,
  VoteChoice,
} from "./types";

// --- Chambers ---

export const chambers: Chamber[] = [
  {
    id: "chamber-1",
    name: "Protocol Core",
    description: "Governance over core protocol parameters, upgrades, and security policies.",
    memberCount: 142,
    proposalCount: 23,
    activeProposals: 2,
    createdAt: "2025-09-15T10:00:00Z",
  },
  {
    id: "chamber-2",
    name: "Treasury",
    description: "Manages protocol treasury allocations, grants, and funding proposals.",
    memberCount: 89,
    proposalCount: 15,
    activeProposals: 1,
    createdAt: "2025-10-01T14:00:00Z",
  },
  {
    id: "chamber-3",
    name: "UI/UX Council",
    description: "Frontend design decisions, component library changes, and user experience improvements.",
    memberCount: 67,
    proposalCount: 31,
    activeProposals: 3,
    createdAt: "2025-10-20T09:00:00Z",
  },
  {
    id: "chamber-4",
    name: "Community",
    description: "Community guidelines, moderation policies, and social governance rules.",
    memberCount: 213,
    proposalCount: 8,
    activeProposals: 0,
    createdAt: "2025-11-05T16:00:00Z",
  },
];

// --- Proposals ---

const sampleDiff = `--- a/src/lib/config.ts
+++ b/src/lib/config.ts
@@ -12,7 +12,7 @@ export const config = {
   quorum: {
-    default: 0.5,
+    default: 0.33,
     minimum: 0.1,
     maximum: 0.75,
   },
@@ -20,3 +20,6 @@ export const config = {
   votingPeriod: 7 * 24 * 60 * 60, // 7 days
+  gracePeriod: 2 * 24 * 60 * 60, // 2 days
+  minReputation: 10,
 };`;

const uiDiff = `--- a/src/components/Navbar.tsx
+++ b/src/components/Navbar.tsx
@@ -1,8 +1,15 @@
+import Link from "next/link";
+
 export default function Navbar() {
   return (
-    <nav>
-      <p>Tribune</p>
+    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
+      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
+        <Link href="/" className="text-lg font-bold text-white">Tribune</Link>
+        <div className="flex items-center gap-6">
+          <Link href="/chambers">Chambers</Link>
+          <Link href="/feed">Feed</Link>
+        </div>
+      </div>
     </nav>
   );
 }`;

const apiDiff = `--- a/src/app/api/feed/route.ts
+++ b/src/app/api/feed/route.ts
@@ -1,6 +1,18 @@
 import { NextRequest, NextResponse } from "next/server";
+import { activities } from "@/lib/mock-data";

-export async function GET(_request: NextRequest) {
-  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
+export async function GET(request: NextRequest) {
+  const { searchParams } = new URL(request.url);
+  const type = searchParams.get("type");
+
+  let filtered = activities;
+  if (type && type !== "all") {
+    filtered = activities.filter((a) => a.type === type);
+  }
+
+  return NextResponse.json({ activities: filtered });
 }`;

export const proposals: Proposal[] = [
  {
    id: "prop-1",
    title: "Lower default quorum to 33%",
    description:
      "The current 50% quorum requirement is too high for day-to-day governance. Many proposals fail to reach quorum despite clear community support. This change lowers the default to 33% while keeping the configurable range intact.",
    status: ProposalStatus.Active,
    chamberId: "chamber-1",
    chamberName: "Protocol Core",
    author: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    createdAt: "2026-02-10T12:00:00Z",
    endsAt: "2026-02-20T12:00:00Z",
    votesYes: 58,
    votesNo: 12,
    votesAbstain: 5,
    totalVotes: 75,
    quorum: 48,
    diff: sampleDiff,
    prUrl: "https://github.com/tribune/tribune/pull/42",
    commentCount: 4,
    upvotes: 23,
    downvotes: 3,
  },
  {
    id: "prop-2",
    title: "Redesign navigation with sticky header",
    description:
      "Replace the current minimal navbar with a sticky dark header that includes wallet status, active link highlighting, and responsive mobile menu.",
    status: ProposalStatus.Active,
    chamberId: "chamber-3",
    chamberName: "UI/UX Council",
    author: "0xaabbccdd11223344556677889900aabbccddeeff",
    createdAt: "2026-02-12T08:00:00Z",
    endsAt: "2026-02-22T08:00:00Z",
    votesYes: 34,
    votesNo: 8,
    votesAbstain: 2,
    totalVotes: 44,
    quorum: 22,
    diff: uiDiff,
    prUrl: "https://github.com/tribune/tribune/pull/45",
    commentCount: 6,
    upvotes: 15,
    downvotes: 1,
  },
  {
    id: "prop-3",
    title: "Allocate 50k USDC for developer grants",
    description:
      "Proposal to allocate 50,000 USDC from the treasury for a Q1 developer grants program. Grants range from $2k-$10k and focus on tooling, integrations, and documentation.",
    status: ProposalStatus.Passed,
    chamberId: "chamber-2",
    chamberName: "Treasury",
    author: "0x9988776655443322110099887766554433221100",
    createdAt: "2026-01-20T10:00:00Z",
    endsAt: "2026-01-27T10:00:00Z",
    votesYes: 72,
    votesNo: 5,
    votesAbstain: 3,
    totalVotes: 80,
    quorum: 30,
    diff: "",
    prUrl: "https://github.com/tribune/tribune/pull/38",
    commentCount: 12,
    upvotes: 45,
    downvotes: 2,
  },
  {
    id: "prop-4",
    title: "Add activity feed API endpoint",
    description:
      "Implement the GET /api/feed endpoint with type filtering and cursor-based pagination. Returns recent governance activities.",
    status: ProposalStatus.Passed,
    chamberId: "chamber-1",
    chamberName: "Protocol Core",
    author: "0xaabbccdd11223344556677889900aabbccddeeff",
    createdAt: "2026-01-15T14:00:00Z",
    endsAt: "2026-01-22T14:00:00Z",
    votesYes: 61,
    votesNo: 2,
    votesAbstain: 7,
    totalVotes: 70,
    quorum: 48,
    diff: apiDiff,
    prUrl: "https://github.com/tribune/tribune/pull/35",
    commentCount: 3,
    upvotes: 30,
    downvotes: 0,
  },
  {
    id: "prop-5",
    title: "Ban anonymous proposals",
    description:
      "Require all proposal authors to have a verified on-chain identity before submitting proposals. This aims to reduce spam but may limit participation.",
    status: ProposalStatus.Rejected,
    chamberId: "chamber-4",
    chamberName: "Community",
    author: "0x1111222233334444555566667777888899990000",
    createdAt: "2026-01-10T09:00:00Z",
    endsAt: "2026-01-17T09:00:00Z",
    votesYes: 15,
    votesNo: 48,
    votesAbstain: 10,
    totalVotes: 73,
    quorum: 71,
    diff: "",
    prUrl: "https://github.com/tribune/tribune/pull/30",
    commentCount: 22,
    upvotes: 8,
    downvotes: 35,
  },
  {
    id: "prop-6",
    title: "Add dark mode toggle to settings",
    description:
      "Allow users to switch between dark and light themes. Currently the app is dark-only. Adds a theme provider and persists preference in localStorage.",
    status: ProposalStatus.Pending,
    chamberId: "chamber-3",
    chamberName: "UI/UX Council",
    author: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    createdAt: "2026-02-16T18:00:00Z",
    endsAt: "2026-02-23T18:00:00Z",
    votesYes: 0,
    votesNo: 0,
    votesAbstain: 0,
    totalVotes: 0,
    quorum: 22,
    diff: "",
    prUrl: "",
    commentCount: 1,
    upvotes: 5,
    downvotes: 0,
  },
];

// --- Comments ---

export const comments: Comment[] = [
  { id: "c1", proposalId: "prop-1", author: "0xaabbccdd11223344556677889900aabbccddeeff", body: "33% feels right. We've been stuck at quorum failures for weeks.", createdAt: "2026-02-11T08:00:00Z", upvotes: 7, downvotes: 0 },
  { id: "c2", proposalId: "prop-1", author: "0x9988776655443322110099887766554433221100", body: "I'd prefer 40% as a compromise, but 33% is acceptable.", createdAt: "2026-02-11T12:30:00Z", upvotes: 3, downvotes: 1 },
  { id: "c3", proposalId: "prop-1", author: "0x1111222233334444555566667777888899990000", body: "This is a great step toward more agile governance.", createdAt: "2026-02-12T09:00:00Z", upvotes: 5, downvotes: 0 },
  { id: "c4", proposalId: "prop-1", author: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", body: "Thanks for the feedback everyone. The diff is minimal and safe.", createdAt: "2026-02-13T15:00:00Z", upvotes: 2, downvotes: 0 },
  { id: "c5", proposalId: "prop-2", author: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", body: "Love the sticky header approach. Much better UX.", createdAt: "2026-02-12T10:00:00Z", upvotes: 4, downvotes: 0 },
  { id: "c6", proposalId: "prop-2", author: "0x9988776655443322110099887766554433221100", body: "Will this work well on mobile?", createdAt: "2026-02-13T08:00:00Z", upvotes: 2, downvotes: 0 },
  { id: "c7", proposalId: "prop-5", author: "0xaabbccdd11223344556677889900aabbccddeeff", body: "This would significantly reduce participation. Strong no.", createdAt: "2026-01-11T14:00:00Z", upvotes: 20, downvotes: 3 },
  { id: "c8", proposalId: "prop-6", author: "0x9988776655443322110099887766554433221100", body: "Would be nice but low priority right now.", createdAt: "2026-02-16T20:00:00Z", upvotes: 1, downvotes: 0 },
];

// --- Activities ---

export const activities: Activity[] = [
  { id: "a1", type: ActivityType.ProposalCreated, actor: "0x1a2b…ef12", description: "created proposal", entityId: "prop-1", entityType: "proposal", entityTitle: "Lower default quorum to 33%", createdAt: "2026-02-10T12:00:00Z" },
  { id: "a2", type: ActivityType.Vote, actor: "0xaabb…eeff", description: "voted Yes on", entityId: "prop-1", entityType: "proposal", entityTitle: "Lower default quorum to 33%", createdAt: "2026-02-11T09:00:00Z" },
  { id: "a3", type: ActivityType.ProposalCreated, actor: "0xaabb…eeff", description: "created proposal", entityId: "prop-2", entityType: "proposal", entityTitle: "Redesign navigation with sticky header", createdAt: "2026-02-12T08:00:00Z" },
  { id: "a4", type: ActivityType.Vote, actor: "0x9988…1100", description: "voted Yes on", entityId: "prop-2", entityType: "proposal", entityTitle: "Redesign navigation with sticky header", createdAt: "2026-02-12T14:00:00Z" },
  { id: "a5", type: ActivityType.CommentAdded, actor: "0x1111…0000", description: "commented on", entityId: "prop-1", entityType: "proposal", entityTitle: "Lower default quorum to 33%", createdAt: "2026-02-12T09:00:00Z" },
  { id: "a6", type: ActivityType.ProposalMerged, actor: "0x9988…1100", description: "merged proposal", entityId: "prop-3", entityType: "proposal", entityTitle: "Allocate 50k USDC for developer grants", createdAt: "2026-01-28T10:00:00Z" },
  { id: "a7", type: ActivityType.ProposalMerged, actor: "0xaabb…eeff", description: "merged proposal", entityId: "prop-4", entityType: "proposal", entityTitle: "Add activity feed API endpoint", createdAt: "2026-01-23T14:00:00Z" },
  { id: "a8", type: ActivityType.ProposalRejected, actor: "0x1111…0000", description: "proposal rejected", entityId: "prop-5", entityType: "proposal", entityTitle: "Ban anonymous proposals", createdAt: "2026-01-17T09:00:00Z" },
  { id: "a9", type: ActivityType.MemberJoined, actor: "0x1a2b…ef12", description: "joined chamber", entityId: "chamber-3", entityType: "chamber", entityTitle: "UI/UX Council", createdAt: "2026-02-08T16:00:00Z" },
  { id: "a10", type: ActivityType.Vote, actor: "0x1a2b…ef12", description: "voted No on", entityId: "prop-5", entityType: "proposal", entityTitle: "Ban anonymous proposals", createdAt: "2026-01-12T11:00:00Z" },
];

// --- User Profiles ---

export const userReputations: UserReputation[] = [
  { address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", score: 850, tier: ReputationTier.Guardian, votingPower: 3, proposalsCreated: 12, votesCast: 67 },
  { address: "0xaabbccdd11223344556677889900aabbccddeeff", score: 420, tier: ReputationTier.Steward, votingPower: 2, proposalsCreated: 5, votesCast: 34 },
  { address: "0x9988776655443322110099887766554433221100", score: 180, tier: ReputationTier.Contributor, votingPower: 1, proposalsCreated: 2, votesCast: 18 },
];

export const userProfiles: UserProfile[] = [
  {
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    reputation: userReputations[0],
    recentProposals: [proposals[0], proposals[5]],
    recentVotes: [
      { proposalId: "prop-2", proposalTitle: "Redesign navigation with sticky header", choice: VoteChoice.Yes, castAt: "2026-02-12T15:00:00Z" },
      { proposalId: "prop-5", proposalTitle: "Ban anonymous proposals", choice: VoteChoice.No, castAt: "2026-01-12T11:00:00Z" },
    ],
    chambers: ["chamber-1", "chamber-3"],
  },
  {
    address: "0xaabbccdd11223344556677889900aabbccddeeff",
    reputation: userReputations[1],
    recentProposals: [proposals[1], proposals[3]],
    recentVotes: [
      { proposalId: "prop-1", proposalTitle: "Lower default quorum to 33%", choice: VoteChoice.Yes, castAt: "2026-02-11T09:00:00Z" },
    ],
    chambers: ["chamber-1", "chamber-2", "chamber-3"],
  },
  {
    address: "0x9988776655443322110099887766554433221100",
    reputation: userReputations[2],
    recentProposals: [proposals[2]],
    recentVotes: [
      { proposalId: "prop-2", proposalTitle: "Redesign navigation with sticky header", choice: VoteChoice.Yes, castAt: "2026-02-12T14:00:00Z" },
    ],
    chambers: ["chamber-2"],
  },
];

// --- Helper functions ---

export function getChamberById(id: string): Chamber | undefined {
  return chambers.find((c) => c.id === id);
}

export function getProposalById(id: string): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}

export function getProposalsForChamber(chamberId: string): Proposal[] {
  return proposals.filter((p) => p.chamberId === chamberId);
}

export function getCommentsForProposal(proposalId: string): Comment[] {
  return comments.filter((c) => c.proposalId === proposalId);
}

export function getUserProfile(address: string): UserProfile | undefined {
  return userProfiles.find((u) => u.address === address);
}

export function getUserReputation(address: string): UserReputation | undefined {
  return userReputations.find((u) => u.address === address);
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
