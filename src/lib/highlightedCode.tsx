import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/common";

export function HighlightedCode({ part }: { part: string }) {
  const code = part.slice(3, -3);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, []);

  return (
    <pre className="p-2 bg-gray-900 rounded-md overflow-auto">
      <code ref={codeRef} className="hljs">
        {code}
      </code>
    </pre>
  );
}
