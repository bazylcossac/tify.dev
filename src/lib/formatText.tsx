import Link from "next/link";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export default function formatText(text: string) {
  return text
    ?.split(
      /(```[\s\S]*?```|#\S+|https?:\/\/(?:www\.youtube\.com\/watch\S+|youtu\.be\/\S+))/g
    )
    ?.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <Link href={`explore/${part.slice(1)}`} key={index}>
            <span className="text-blue-500 font-bold">{part}</span>
          </Link>
        );
      }
      if (
        part.startsWith("https://www.youtube.com/watch") ||
        part.startsWith("https://youtu.be/")
      ) {
        return (
          <div key={index} className="my-4">
            <Link href={part} target="_blank">
              <span className="text-blue-500 font-bold block mt-2">{part}</span>
            </Link>
          </div>
        );
      }
      if (part.startsWith("```") && part.endsWith("```")) {
        const languageWithDrops = part.split("\n");
        const language = languageWithDrops[0].slice(3);

        const code = part.slice(3 + language.length, -3);
        return (
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            key={index}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        );
      } else {
        return part;
      }
    });
}
