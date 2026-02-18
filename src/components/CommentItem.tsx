"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { timeAgo } from "@/lib/mock-data";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);

  return (
    <div className="border-b border-zinc-800 py-4 last:border-0">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="font-mono">
          {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
        </span>
        <span>·</span>
        <span>{timeAgo(comment.createdAt)}</span>
      </div>
      <p className="mt-1.5 text-sm text-zinc-300">{comment.body}</p>
      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
        <button
          onClick={() => setUpvotes((u) => u + 1)}
          className="transition-colors hover:text-vote-yes"
        >
          ▲ {upvotes}
        </button>
        <button
          onClick={() => setDownvotes((d) => d + 1)}
          className="transition-colors hover:text-vote-no"
        >
          ▼ {downvotes}
        </button>
      </div>
    </div>
  );
}
