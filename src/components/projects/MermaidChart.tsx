/**
 * Mermaid was removed as part of the mobile/JS-budget pass. We no longer
 * ship the ~600 KB mermaid runtime, so the markdown renderer falls back to
 * a preformatted block whenever a `mermaid` code fence is encountered.
 * This keeps the import in `ProjectMarkdownContent` working — the only
 * user-visible change is the diagram renders as text instead of SVG.
 */
export function MermaidChart({ chart }: { chart: string }) {
  return (
    <pre className="mb-3 overflow-x-auto rounded-md border border-border bg-accent/40 p-3 text-xs leading-relaxed last:mb-0">
      <code>{chart}</code>
    </pre>
  );
}
