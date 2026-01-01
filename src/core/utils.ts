import type { CollectionEntry } from "astro:content";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for conditional class names.
 * - clsx: Handles conditional classes (e.g., { 'bg-red': isError })
 * - twMerge: Deduplicates and resolves Tailwind class conflicts (e.g., 'px-2 px-4' → 'px-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Estimates reading time from raw markdown content.
 * Note: Strips HTML tags but doesn't account for code blocks or images.
 * Uses 200 WPM which is conservative for technical content.
 */
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
