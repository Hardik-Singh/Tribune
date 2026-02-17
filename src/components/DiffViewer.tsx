// TODO: Render GitHub PR diff in a code viewer
// TODO: Syntax highlight additions (green) and deletions (red)
// TODO: Fetch diff from GitHub API or proposal metadata

interface DiffViewerProps {
  prUrl: string;
  // TODO: Add diff data type
}

export default function DiffViewer({ prUrl }: DiffViewerProps) {
  return (
    <div>
      <p>Diff for {prUrl}</p>
      {/* TODO: Render formatted diff */}
    </div>
  );
}
