export enum ProposalStatus {
  Active = "active",
  Passed = "passed",
  Rejected = "rejected",
  Pending = "pending",
}

export enum ActivityType {
  Vote = "vote",
  ProposalCreated = "proposal_created",
  ProposalMerged = "proposal_merged",
  ProposalRejected = "proposal_rejected",
  CommentAdded = "comment_added",
  MemberJoined = "member_joined",
}

export enum VoteChoice {
  Yes = "yes",
  No = "no",
  Abstain = "abstain",
}

export enum ReputationTier {
  Newcomer = "newcomer",
  Contributor = "contributor",
  Steward = "steward",
  Guardian = "guardian",
}

export interface Chamber {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  proposalCount: number;
  activeProposals: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  chamberId: string;
  chamberName: string;
  author: string;
  createdAt: string;
  endsAt: string;
  votesYes: number;
  votesNo: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  diff: string;
  prUrl: string;
  commentCount: number;
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  id: string;
  proposalId: string;
  author: string;
  body: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  entityId: string;
  entityType: "proposal" | "chamber" | "vote";
  entityTitle: string;
  createdAt: string;
}

export interface UserReputation {
  address: string;
  score: number;
  tier: ReputationTier;
  votingPower: number;
  proposalsCreated: number;
  votesCast: number;
}

export interface UserProfile {
  address: string;
  reputation: UserReputation;
  recentProposals: Proposal[];
  recentVotes: { proposalId: string; proposalTitle: string; choice: VoteChoice; castAt: string }[];
  chambers: string[];
}

export interface Vote {
  id: string;
  proposalId: string;
  voter: string;
  choice: VoteChoice;
  castAt: string;
}
