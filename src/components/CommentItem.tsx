"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";

function timeAgo(dateString: string): string {
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

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);

  async function handleReaction(value: 1 | -1) {
    const res = await fetch(`/api/comments/${comment.id}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, actor: comment.author }),
    });

    if (res.ok) {
      const data = await res.json();
      setUpvotes((u) => u + (data.delta_up ?? 0));
      setDownvotes((d) => d + (data.delta_down ?? 0));
    }
  }

  return (
    <div className="border-b border-zinc-800 py-4 last:border-0">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="font-mono">
          {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
        </span>
        <span>&middot;</span>
        <span>{timeAgo(comment.createdAt)}</span>
      </div>
      <p className="mt-1.5 text-sm text-zinc-300">{comment.body}</p>
      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
        <button
          onClick={() => handleReaction(1)}
          className="transition-colors hover:text-vote-yes"
        >
          &#9650; {upvotes}
        </button>
        <button
          onClick={() => handleReaction(-1)}
          className="transition-colors hover:text-vote-no"
        >
          &#9660; {downvotes}
        </button>
      </div>
    </div>
  );
}
