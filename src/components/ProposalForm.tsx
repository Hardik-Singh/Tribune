"use client";

import { useState } from "react";
import { useWallet } from "./Providers";
import { chambers } from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";

interface ProposalFormProps {
  chamberId?: string;
}

export default function ProposalForm({ chamberId }: ProposalFormProps) {
  const { connected } = useWallet();
  const { isAiMode } = useMode();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedChamber, setSelectedChamber] = useState(chamberId || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!connected || !title || !description || !selectedChamber) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setTitle("");
    setDescription("");
  }

  if (!connected) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-center">
        <p className="text-sm text-zinc-500">
          Connect your wallet to propose a change.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-800 bg-emerald-500/10 p-6 text-center">
        <p className="text-sm text-emerald-400">
          Proposal submitted! AI is generating code changes...
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-xs text-zinc-400 hover:text-white"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-component="proposal-form"
      data-testid="proposal-form"
      data-loading={submitting}
      className="space-y-4"
    >
      <div>
        <label className={`block text-sm font-medium ${isAiMode ? "text-gray-700" : "text-zinc-300"}`}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to change?"
          data-testid="proposal-title-input"
          aria-label="Proposal title"
          className={isAiMode
            ? "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
            : "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          }
        />
      </div>
      {!chamberId && (
        <div>
          <label className={`block text-sm font-medium ${isAiMode ? "text-gray-700" : "text-zinc-300"}`}>
            Chamber
          </label>
          <select
            value={selectedChamber}
            onChange={(e) => setSelectedChamber(e.target.value)}
            data-testid="proposal-chamber-select"
            aria-label="Select chamber"
            className={isAiMode
              ? "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
              : "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            }
          >
            <option value="">Select a chamber</option>
            {chambers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className={`block text-sm font-medium ${isAiMode ? "text-gray-700" : "text-zinc-300"}`}>
          Describe the change in natural language
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe what you want to change and why..."
          data-testid="proposal-description-input"
          aria-label="Proposal description"
          className={isAiMode
            ? "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
            : "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          }
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !title || !description || !selectedChamber}
        data-testid="proposal-submit-btn"
        className={isAiMode
          ? "rounded border border-gray-400 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          : "btn-primary disabled:opacity-50"
        }
      >
        {submitting ? "Submitting..." : "Submit Proposal"}
      </button>
    </form>
  );
}
