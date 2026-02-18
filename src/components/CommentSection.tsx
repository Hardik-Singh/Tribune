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
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!connected || !body.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), author: address }),
      });

      if (res.ok) {
        const { comment } = await res.json();
        setComments((prev) => [...prev, comment]);
        setBody("");
      }
    } finally {
      setSubmitting(false);
    }
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
            disabled={!body.trim() || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? "..." : "Post"}
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
