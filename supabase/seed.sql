-- Seed data for Tribune

-- Chambers
insert into chambers (id, name, description, member_count, proposal_count, active_proposals, created_at) values
  ('chamber-1', 'Protocol Core', 'Governance over core protocol parameters, upgrades, and security policies.', 142, 23, 2, '2025-09-15T10:00:00Z'),
  ('chamber-2', 'Treasury', 'Manages protocol treasury allocations, grants, and funding proposals.', 89, 15, 1, '2025-10-01T14:00:00Z'),
  ('chamber-3', 'UI/UX Council', 'Frontend design decisions, component library changes, and user experience improvements.', 67, 31, 3, '2025-10-20T09:00:00Z'),
  ('chamber-4', 'Community', 'Community guidelines, moderation policies, and social governance rules.', 213, 8, 0, '2025-11-05T16:00:00Z');

-- Proposals
insert into proposals (id, title, description, status, chamber_id, chamber_name, author, created_at, ends_at, votes_yes, votes_no, votes_abstain, total_votes, quorum, diff, pr_url, comment_count, upvotes, downvotes) values
  ('prop-1', 'Lower default quorum to 33%', 'The current 50% quorum requirement is too high for day-to-day governance. Many proposals fail to reach quorum despite clear community support. This change lowers the default to 33% while keeping the configurable range intact.', 'active', 'chamber-1', 'Protocol Core', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', '2026-02-10T12:00:00Z', '2026-02-20T12:00:00Z', 58, 12, 5, 75, 48, '--- a/src/lib/config.ts
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
 };', 'https://github.com/tribune/tribune/pull/42', 4, 23, 3),
  ('prop-2', 'Redesign navigation with sticky header', 'Replace the current minimal navbar with a sticky dark header that includes wallet status, active link highlighting, and responsive mobile menu.', 'active', 'chamber-3', 'UI/UX Council', '0xaabbccdd11223344556677889900aabbccddeeff', '2026-02-12T08:00:00Z', '2026-02-22T08:00:00Z', 34, 8, 2, 44, 22, '--- a/src/components/Navbar.tsx
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
 }', 'https://github.com/tribune/tribune/pull/45', 6, 15, 1),
  ('prop-3', 'Allocate 50k USDC for developer grants', 'Proposal to allocate 50,000 USDC from the treasury for a Q1 developer grants program. Grants range from $2k-$10k and focus on tooling, integrations, and documentation.', 'passed', 'chamber-2', 'Treasury', '0x9988776655443322110099887766554433221100', '2026-01-20T10:00:00Z', '2026-01-27T10:00:00Z', 72, 5, 3, 80, 30, '', 'https://github.com/tribune/tribune/pull/38', 12, 45, 2),
  ('prop-4', 'Add activity feed API endpoint', 'Implement the GET /api/feed endpoint with type filtering and cursor-based pagination. Returns recent governance activities.', 'passed', 'chamber-1', 'Protocol Core', '0xaabbccdd11223344556677889900aabbccddeeff', '2026-01-15T14:00:00Z', '2026-01-22T14:00:00Z', 61, 2, 7, 70, 48, '--- a/src/app/api/feed/route.ts
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
 }', 'https://github.com/tribune/tribune/pull/35', 3, 30, 0),
  ('prop-5', 'Ban anonymous proposals', 'Require all proposal authors to have a verified on-chain identity before submitting proposals. This aims to reduce spam but may limit participation.', 'rejected', 'chamber-4', 'Community', '0x1111222233334444555566667777888899990000', '2026-01-10T09:00:00Z', '2026-01-17T09:00:00Z', 15, 48, 10, 73, 71, '', 'https://github.com/tribune/tribune/pull/30', 22, 8, 35),
  ('prop-6', 'Add dark mode toggle to settings', 'Allow users to switch between dark and light themes. Currently the app is dark-only. Adds a theme provider and persists preference in localStorage.', 'pending', 'chamber-3', 'UI/UX Council', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', '2026-02-16T18:00:00Z', '2026-02-23T18:00:00Z', 0, 0, 0, 0, 22, '', '', 1, 5, 0);

-- Comments
insert into comments (id, proposal_id, author, body, created_at, upvotes, downvotes) values
  ('c1', 'prop-1', '0xaabbccdd11223344556677889900aabbccddeeff', '33% feels right. We''ve been stuck at quorum failures for weeks.', '2026-02-11T08:00:00Z', 7, 0),
  ('c2', 'prop-1', '0x9988776655443322110099887766554433221100', 'I''d prefer 40% as a compromise, but 33% is acceptable.', '2026-02-11T12:30:00Z', 3, 1),
  ('c3', 'prop-1', '0x1111222233334444555566667777888899990000', 'This is a great step toward more agile governance.', '2026-02-12T09:00:00Z', 5, 0),
  ('c4', 'prop-1', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', 'Thanks for the feedback everyone. The diff is minimal and safe.', '2026-02-13T15:00:00Z', 2, 0),
  ('c5', 'prop-2', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', 'Love the sticky header approach. Much better UX.', '2026-02-12T10:00:00Z', 4, 0),
  ('c6', 'prop-2', '0x9988776655443322110099887766554433221100', 'Will this work well on mobile?', '2026-02-13T08:00:00Z', 2, 0),
  ('c7', 'prop-5', '0xaabbccdd11223344556677889900aabbccddeeff', 'This would significantly reduce participation. Strong no.', '2026-01-11T14:00:00Z', 20, 3),
  ('c8', 'prop-6', '0x9988776655443322110099887766554433221100', 'Would be nice but low priority right now.', '2026-02-16T20:00:00Z', 1, 0);

-- Activities
insert into activities (id, type, actor, description, entity_id, entity_type, entity_title, created_at) values
  ('a1', 'proposal_created', '0x1a2b…ef12', 'created proposal', 'prop-1', 'proposal', 'Lower default quorum to 33%', '2026-02-10T12:00:00Z'),
  ('a2', 'vote', '0xaabb…eeff', 'voted Yes on', 'prop-1', 'proposal', 'Lower default quorum to 33%', '2026-02-11T09:00:00Z'),
  ('a3', 'proposal_created', '0xaabb…eeff', 'created proposal', 'prop-2', 'proposal', 'Redesign navigation with sticky header', '2026-02-12T08:00:00Z'),
  ('a4', 'vote', '0x9988…1100', 'voted Yes on', 'prop-2', 'proposal', 'Redesign navigation with sticky header', '2026-02-12T14:00:00Z'),
  ('a5', 'comment_added', '0x1111…0000', 'commented on', 'prop-1', 'proposal', 'Lower default quorum to 33%', '2026-02-12T09:00:00Z'),
  ('a6', 'proposal_merged', '0x9988…1100', 'merged proposal', 'prop-3', 'proposal', 'Allocate 50k USDC for developer grants', '2026-01-28T10:00:00Z'),
  ('a7', 'proposal_merged', '0xaabb…eeff', 'merged proposal', 'prop-4', 'proposal', 'Add activity feed API endpoint', '2026-01-23T14:00:00Z'),
  ('a8', 'proposal_rejected', '0x1111…0000', 'proposal rejected', 'prop-5', 'proposal', 'Ban anonymous proposals', '2026-01-17T09:00:00Z'),
  ('a9', 'member_joined', '0x1a2b…ef12', 'joined chamber', 'chamber-3', 'chamber', 'UI/UX Council', '2026-02-08T16:00:00Z'),
  ('a10', 'vote', '0x1a2b…ef12', 'voted No on', 'prop-5', 'proposal', 'Ban anonymous proposals', '2026-01-12T11:00:00Z');

-- Reputations
insert into reputations (address, score, tier, voting_power, proposals_created, votes_cast) values
  ('0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', 850, 'guardian', 3, 12, 67),
  ('0xaabbccdd11223344556677889900aabbccddeeff', 420, 'steward', 2, 5, 34),
  ('0x9988776655443322110099887766554433221100', 180, 'contributor', 1, 2, 18);
