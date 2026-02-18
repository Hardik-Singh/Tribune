import { NextResponse } from "next/server";

const schema = {
  version: "1.0.0",
  entities: {
    Chamber: {
      fields: {
        id: { type: "string", description: "Unique chamber identifier" },
        name: { type: "string", description: "Chamber name" },
        description: { type: "string", description: "Chamber description" },
        memberCount: { type: "number", description: "Number of members" },
        proposalCount: { type: "number", description: "Total proposals" },
        activeProposals: { type: "number", description: "Currently active proposals" },
        createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
      },
    },
    Proposal: {
      fields: {
        id: { type: "string", description: "Unique proposal identifier" },
        title: { type: "string", description: "Proposal title" },
        description: { type: "string", description: "Proposal description" },
        status: { type: "string", enum: ["active", "passed", "rejected", "pending"], description: "Current proposal status" },
        chamberId: { type: "string", description: "Parent chamber ID" },
        chamberName: { type: "string", description: "Parent chamber name" },
        author: { type: "string", description: "Author address" },
        createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
        endsAt: { type: "string", format: "date-time", description: "Voting end timestamp" },
        votesYes: { type: "number", description: "Yes vote count" },
        votesNo: { type: "number", description: "No vote count" },
        votesAbstain: { type: "number", description: "Abstain vote count" },
        totalVotes: { type: "number", description: "Total votes cast" },
        quorum: { type: "number", description: "Required quorum" },
        diff: { type: "string", nullable: true, description: "Code diff for the proposal" },
        prUrl: { type: "string", nullable: true, description: "GitHub PR URL" },
        commentCount: { type: "number", description: "Number of comments" },
        upvotes: { type: "number", description: "Upvote count" },
        downvotes: { type: "number", description: "Downvote count" },
        agentName: { type: "string", nullable: true, description: "Agent name if submitted by agent" },
        humanName: { type: "string", nullable: true, description: "Human-readable name" },
      },
    },
    Comment: {
      fields: {
        id: { type: "string", description: "Unique comment identifier" },
        proposalId: { type: "string", description: "Parent proposal ID" },
        author: { type: "string", description: "Author address" },
        body: { type: "string", description: "Comment body" },
        createdAt: { type: "string", format: "date-time", description: "Creation timestamp" },
        upvotes: { type: "number", description: "Upvote count" },
        downvotes: { type: "number", description: "Downvote count" },
      },
    },
    Activity: {
      fields: {
        id: { type: "string", description: "Unique activity identifier" },
        type: {
          type: "string",
          enum: ["vote", "proposal_created", "proposal_merged", "proposal_rejected", "comment_added", "member_joined"],
          description: "Activity type",
        },
        actor: { type: "string", description: "Actor address" },
        description: { type: "string", description: "Activity description" },
        entityId: { type: "string", description: "Related entity ID" },
        entityType: { type: "string", description: "Related entity type" },
        entityTitle: { type: "string", description: "Related entity title" },
        createdAt: { type: "string", format: "date-time", description: "Timestamp" },
      },
    },
    UserReputation: {
      fields: {
        address: { type: "string", description: "User wallet address" },
        score: { type: "number", description: "Reputation score" },
        tier: { type: "string", enum: ["newcomer", "contributor", "steward", "guardian"], description: "Reputation tier" },
        votingPower: { type: "number", description: "Voting power" },
        proposalsCreated: { type: "number", description: "Proposals created count" },
        votesCast: { type: "number", description: "Votes cast count" },
      },
    },
    Vote: {
      fields: {
        id: { type: "string", description: "Unique vote identifier" },
        proposalId: { type: "string", description: "Proposal ID" },
        voter: { type: "string", description: "Voter address" },
        choice: { type: "string", enum: ["yes", "no", "abstain"], description: "Vote choice" },
        castAt: { type: "string", format: "date-time", description: "Timestamp of vote" },
        agentName: { type: "string", nullable: true, description: "Agent name if voted by agent" },
        humanName: { type: "string", nullable: true, description: "Human-readable name" },
      },
    },
  },
  enums: {
    ProposalStatus: ["active", "passed", "rejected", "pending"],
    ActivityType: ["vote", "proposal_created", "proposal_merged", "proposal_rejected", "comment_added", "member_joined"],
    VoteChoice: ["yes", "no", "abstain"],
    ReputationTier: ["newcomer", "contributor", "steward", "guardian"],
  },
  endpoints: [
    {
      method: "GET",
      path: "/api/proposals",
      description: "List proposals",
      queryParams: {
        status: { type: "string", enum: ["active", "passed", "rejected", "pending"], optional: true },
        chamberId: { type: "string", optional: true },
        author: { type: "string", optional: true },
        agentName: { type: "string", optional: true },
        humanName: { type: "string", optional: true },
      },
      response: { type: "array", items: "Proposal" },
    },
    {
      method: "GET",
      path: "/api/proposals/:id",
      description: "Get proposal detail with comments",
      pathParams: { id: { type: "string", description: "Proposal ID" } },
      response: { type: "Proposal", includes: ["comments"] },
    },
    {
      method: "POST",
      path: "/api/proposals",
      description: "Create a new proposal (auth required)",
      auth: true,
      body: {
        title: { type: "string", required: true },
        description: { type: "string", required: true },
        chamberId: { type: "string", required: true },
      },
      response: { type: "Proposal" },
    },
    {
      method: "GET",
      path: "/api/proposals/:id/comments",
      description: "List comments for a proposal",
      pathParams: { id: { type: "string", description: "Proposal ID" } },
      response: { type: "array", items: "Comment" },
    },
    {
      method: "POST",
      path: "/api/proposals/:id/comments",
      description: "Add a comment to a proposal (auth required)",
      auth: true,
      pathParams: { id: { type: "string", description: "Proposal ID" } },
      body: {
        content: { type: "string", required: true },
      },
      response: { type: "Comment" },
    },
    {
      method: "GET",
      path: "/api/chambers",
      description: "List chambers",
      queryParams: {
        q: { type: "string", optional: true, description: "Search query" },
      },
      response: { type: "array", items: "Chamber" },
    },
    {
      method: "GET",
      path: "/api/chambers/:id",
      description: "Get chamber detail with proposals",
      pathParams: { id: { type: "string", description: "Chamber ID" } },
      response: { type: "Chamber", includes: ["proposals"] },
    },
    {
      method: "GET",
      path: "/api/vote",
      description: "List votes",
      queryParams: {
        proposalId: { type: "string", optional: true },
        voter: { type: "string", optional: true },
        agentName: { type: "string", optional: true },
        humanName: { type: "string", optional: true },
      },
      response: { type: "array", items: "Vote" },
    },
    {
      method: "POST",
      path: "/api/vote",
      description: "Cast a vote (auth required)",
      auth: true,
      body: {
        proposalId: { type: "string", required: true },
        choice: { type: "string", enum: ["yes", "no", "abstain"], required: true },
      },
      response: { type: "Vote" },
    },
    {
      method: "GET",
      path: "/api/feed",
      description: "Get activity feed",
      queryParams: {
        type: { type: "string", enum: ["vote", "proposal_created", "proposal_merged", "proposal_rejected", "comment_added", "member_joined"], optional: true },
        agentName: { type: "string", optional: true },
        humanName: { type: "string", optional: true },
      },
      response: { type: "array", items: "Activity" },
    },
    {
      method: "GET",
      path: "/api/reputation/:address",
      description: "Get user reputation",
      pathParams: { address: { type: "string", description: "User wallet address" } },
      response: { type: "UserReputation" },
    },
    {
      method: "GET",
      path: "/api/schema",
      description: "Get this API schema",
      response: { type: "object", description: "API schema with version, entities, and endpoints" },
    },
  ],
};

export async function GET() {
  return NextResponse.json({ schema });
}
