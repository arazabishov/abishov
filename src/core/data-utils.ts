import { getCollection, type CollectionEntry } from "astro:content";
import { readingTime, calculateWordCountFromHtml } from "@/core/utils";

export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog");
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllProjects(): Promise<CollectionEntry<"projects">[]> {
  const projects = await getCollection("projects");
  return projects;
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts();
  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1);
    });
    return acc;
  }, new Map<string, number>());
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<"blog">[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.tags?.includes(tag));
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<"blog">[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getRecentProjects(
  count: number,
): Promise<CollectionEntry<"projects">[]> {
  const projects = await getAllProjects();
  return projects.slice(0, count);
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags();
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag);
    });
}

export function getPostReadingTime(post: CollectionEntry<"blog">): string {
  const wordCount = calculateWordCountFromHtml(post.body);
  return readingTime(wordCount);
}

export function groupPostsByYear(
  posts: CollectionEntry<"blog">[],
): Record<string, CollectionEntry<"blog">[]> {
  return posts.reduce(
    (acc, post) => {
      const year = post.data.date.getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, CollectionEntry<"blog">[]>,
  );
}
