import type { CollectionEntry } from "astro:content";

function calculateWordCountFromHtml(html: string | null | undefined): number {
  if (!html) {
    return 0;
  }
  const textOnly = html.replace(/<[^>]+>/g, "");
  return textOnly.split(/\s+/).filter(Boolean).length;
}

export function getPostReadingTime(post: CollectionEntry<"blog">): string {
  const wordCount = calculateWordCountFromHtml(post.body);
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
