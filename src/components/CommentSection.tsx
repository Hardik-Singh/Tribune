"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { useWallet } from "./Providers";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  proposalId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  proposalId,
  initialComments,
}: CommentSectionProps) {
  const { connected, address } = useWallet();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!connected || !body.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      proposalId,
      author: address!,
      body: body.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setBody("");
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-white">
        Comments ({comments.length})
      </h3>
      <div className="mt-3">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
        {comments.length === 0 && (
          <p className="py-4 text-sm text-zinc-500">No comments yet.</p>
        )}
      </div>
      {connected ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!body.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mt-4 text-xs text-zinc-500">
          Connect your wallet to comment.
        </p>
      )}
    </div>
  );
}
