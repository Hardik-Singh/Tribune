-- Tribune initial schema

-- Chambers
create table chambers (
  id text primary key,
  name text not null,
  description text not null default '',
  member_count int not null default 0,
  proposal_count int not null default 0,
  active_proposals int not null default 0,
  created_at timestamptz not null default now()
);

-- Proposals
create table proposals (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'pending',
  chamber_id text not null references chambers(id),
  chamber_name text not null default '',
  author text not null,
  agent_name text,
  human_name text,
  created_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '7 days'),
  votes_yes int not null default 0,
  votes_no int not null default 0,
  votes_abstain int not null default 0,
  total_votes int not null default 0,
  quorum int not null default 30,
  diff text not null default '',
  pr_url text not null default '',
  comment_count int not null default 0,
  upvotes int not null default 0,
  downvotes int not null default 0
);

-- Comments
create table comments (
  id text primary key,
  proposal_id text not null references proposals(id),
  author text not null,
  body text not null,
  created_at timestamptz not null default now(),
  upvotes int not null default 0,
  downvotes int not null default 0
);

-- Reactions (upvote/downvote tracking)
create table reactions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'proposal' or 'comment'
  entity_id text not null,
  actor text not null,
  value int not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, actor)
);

-- Votes (on-chain mirror)
create table votes (
  id text primary key,
  proposal_id text not null references proposals(id),
  voter text not null,
  agent_name text,
  human_name text,
  choice text not null check (choice in ('yes', 'no', 'abstain')),
  cast_at timestamptz not null default now(),
  unique (proposal_id, voter)
);

-- Activities
create table activities (
  id text primary key,
  type text not null,
  actor text not null,
  description text not null default '',
  entity_id text not null,
  entity_type text not null,
  entity_title text not null default '',
  created_at timestamptz not null default now()
);

-- Reputations
create table reputations (
  address text primary key,
  score int not null default 0,
  tier text not null default 'newcomer',
  voting_power int not null default 1,
  proposals_created int not null default 0,
  votes_cast int not null default 0
);

-- Agents
create table agents (
  api_key text primary key,
  name text not null,
  description text not null default '',
  human_name text not null default '',
  created_at timestamptz not null default now()
);

-- Toggle reaction function: insert, remove (same value), or switch (different value)
create or replace function toggle_reaction(
  p_entity_type text,
  p_entity_id text,
  p_actor text,
  p_value int
) returns json as $$
declare
  existing record;
  delta_up int := 0;
  delta_down int := 0;
  result_action text;
begin
  select * into existing from reactions
    where entity_type = p_entity_type
      and entity_id = p_entity_id
      and actor = p_actor;

  if found then
    if existing.value = p_value then
      -- Remove reaction
      delete from reactions where id = existing.id;
      if p_value = 1 then delta_up := -1; else delta_down := -1; end if;
      result_action := 'removed';
    else
      -- Switch reaction
      update reactions set value = p_value where id = existing.id;
      if p_value = 1 then delta_up := 1; delta_down := -1;
      else delta_up := -1; delta_down := 1; end if;
      result_action := 'switched';
    end if;
  else
    -- Insert new reaction
    insert into reactions (entity_type, entity_id, actor, value)
      values (p_entity_type, p_entity_id, p_actor, p_value);
    if p_value = 1 then delta_up := 1; else delta_down := 1; end if;
    result_action := 'added';
  end if;

  -- Update counts on the entity
  if p_entity_type = 'comment' then
    update comments
      set upvotes = upvotes + delta_up,
          downvotes = downvotes + delta_down
      where id = p_entity_id;
  elsif p_entity_type = 'proposal' then
    update proposals
      set upvotes = upvotes + delta_up,
          downvotes = downvotes + delta_down
      where id = p_entity_id;
  end if;

  return json_build_object('action', result_action, 'delta_up', delta_up, 'delta_down', delta_down);
end;
$$ language plpgsql;

-- Enable RLS (service_role bypasses)
alter table chambers enable row level security;
alter table proposals enable row level security;
alter table comments enable row level security;
alter table reactions enable row level security;
alter table votes enable row level security;
alter table activities enable row level security;
alter table reputations enable row level security;
alter table agents enable row level security;

-- Indexes
create index idx_proposals_chamber on proposals(chamber_id);
create index idx_proposals_status on proposals(status);
create index idx_comments_proposal on comments(proposal_id);
create index idx_votes_proposal on votes(proposal_id);
create index idx_activities_type on activities(type);
create index idx_activities_created on activities(created_at desc);
create index idx_reactions_entity on reactions(entity_type, entity_id);
