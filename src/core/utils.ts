import type { CollectionEntry } from "astro:content";

export function getPostReadingTime(post: CollectionEntry<"blog">): string {
  const html = post.body;
  const wordCount = html
    ? html
        .replace(/<[^>]+>/g, "")
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));
  return `${readingTimeMinutes} min read`;
}

export function formatDate(date: Date): string {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
