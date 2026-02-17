# CLAUDE.MD - Tribune

## What is Tribune?

**Tribune is a self-modifying governance app.** Users propose changes in natural language, AI writes code + opens a PR, the community votes on the PR, and if it passes it merges and auto-deploys. The app changes itself through governance.

- **Next.js 14 App Router** frontend
- **@invariance/sdk** for on-chain auth, reputation, and voting
- **GitHub integration** for PR creation and webhook-driven deployment
- **Natural language → code** pipeline for proposals

---

## Project Structure

```
tribune/
├── CLAUDE.md                    # Dev guidelines (this file)
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with Providers + Navbar
│   │   ├── page.tsx             # Landing page (/)
│   │   ├── chambers/
│   │   │   ├── page.tsx         # /chambers — list chambers
│   │   │   └── [id]/page.tsx    # /chambers/[id] — chamber detail
│   │   ├── proposals/
│   │   │   └── [id]/page.tsx    # /proposals/[id] — proposal detail
│   │   ├── profile/
│   │   │   └── [address]/page.tsx  # /profile/[address]
│   │   ├── feed/
│   │   │   └── page.tsx         # /feed — activity feed
│   │   └── api/
│   │       ├── proposals/       # POST create, GET detail
│   │       ├── chambers/        # GET list, GET detail
│   │       ├── vote/            # POST cast vote
│   │       ├── feed/            # GET activity feed
│   │       ├── reputation/      # GET user reputation
│   │       └── github/webhook/  # POST GitHub webhook handler
│   │
│   ├── components/
│   │   ├── Providers.tsx        # SDK + auth provider wrapper
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── ProposalCard.tsx     # Proposal summary card
│   │   ├── ChamberCard.tsx      # Chamber summary card
│   │   ├── VotePanel.tsx        # Yes/No vote UI
│   │   ├── DiffViewer.tsx       # PR diff display
│   │   ├── ReputationBadge.tsx  # User reputation display
│   │   ├── ActivityItem.tsx     # Single feed item
│   │   └── ProposalForm.tsx     # Natural language proposal input
│   │
│   └── lib/
│       └── sdk.ts               # SDK client singleton + helpers
```

---

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Prefer `interface` over `type` for extensibility
- All public APIs should have JSDoc comments

### Components
- Use Server Components by default, `"use client"` only when needed
- Props interfaces defined in the same file
- Skeleton files use `// TODO` comments for unimplemented logic

---

## Development Workflow

### Git Flow

**IMPORTANT**: Always work on a separate branch. Never commit directly to `main`.

```bash
# Branch naming
feature/description    # New features
fix/description        # Bug fixes
docs/description       # Documentation

# Commit format (Conventional Commits)
feat(components): add vote panel interaction
fix(api): resolve webhook signature validation
docs(readme): update setup instructions
```

### Quick Commands

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Before Pushing Code

1. `npm run build` must pass
2. `npm run lint` must pass
3. No TypeScript errors

### PR Requirements

- All PRs target `main`
- CI must pass (build + lint)
- Squash merge preferred

---

## Environment Variables

```bash
# .env.local
INVARIANCE_RPC_URL=           # Base RPC endpoint
INVARIANCE_CONTRACT_ADDRESS=  # Core contract address
GITHUB_WEBHOOK_SECRET=        # GitHub webhook signature secret
NEXT_PUBLIC_CHAIN_ID=8453     # Base mainnet
```

---

## Key Concepts

### Flow: Proposal → Merge

1. User writes natural language proposal in `ProposalForm`
2. `POST /api/proposals` sends to AI, which generates code + opens GitHub PR
3. Proposal appears on-chain via SDK, community votes in `VotePanel`
4. If vote passes, PR merges via GitHub API
5. `POST /api/github/webhook` receives merge event, updates on-chain state
6. App auto-deploys with the merged changes

### SDK Integration

All on-chain operations go through `src/lib/sdk.ts`:
- Authentication (wallet connect/disconnect)
- Chamber queries
- Proposal creation and voting
- Reputation lookups
