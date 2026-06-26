import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "strict",
  fontFamily: "inherit",
});

export function MermaidChart({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;

      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="mb-3 overflow-x-auto rounded-md border border-border bg-accent/40 p-3 text-xs leading-relaxed last:mb-0">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-3 overflow-x-auto rounded-md border border-border bg-background p-3 last:mb-0 [&_svg]:mx-auto [&_svg]:max-w-full"
      aria-label="Architecture diagram"
    />
  );
}
