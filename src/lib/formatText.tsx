import Link from "next/link";

export default function formatText(text: string) {
  return text
    .split(/(#\S+|https?:\/\/www\.youtube\.com\/watch\S+)/g)
    .map((part, index) =>
      part.startsWith("#") ? (
        <Link href={`explore/${part.slice(1)}`} key={index}>
          <span className="text-blue-500 font-bold">{part}</span>
        </Link>
      ) : part.startsWith("https://www.youtube.com/watch") ? (
        <Link href={part} target="_blank" key={index}>
          <span className="text-blue-500 font-bold">{part}</span>
        </Link>
      ) : (
        part
      )
    );
}
