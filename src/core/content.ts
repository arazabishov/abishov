import { getCollection, type CollectionEntry } from "astro:content";

export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog");
  return posts.filter((post) => !post.data.draft).sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());
}

export async function getAllProjects(): Promise<CollectionEntry<"projects">[]> {
  return await getCollection("projects");
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts();
  const projects = await getAllProjects();
  const tags = new Map<string, number>();

  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    });
  });

  projects.forEach((project) => {
    project.data.tags?.forEach((tag) => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    });
  });

  return tags;
}

export async function getPostsByTag(tag: string): Promise<CollectionEntry<"blog">[]> {
  return (await getAllPosts()).filter((post) => post.data.tags?.includes(tag));
}

export async function getProjectsByTag(tag: string): Promise<CollectionEntry<"projects">[]> {
  return (await getAllProjects()).filter((project) => project.data.tags?.includes(tag));
}

export async function getRecentPosts(count: number): Promise<CollectionEntry<"blog">[]> {
  return (await getAllPosts()).slice(0, count);
}

export async function getRecentProjects(count: number): Promise<CollectionEntry<"projects">[]> {
  return (await getAllProjects()).slice(0, count);
}

export async function getSortedTags(): Promise<{ tag: string; count: number }[]> {
  const tagCounts = await getAllTags();
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag);
    });
}

export function groupPostsByYear(posts: CollectionEntry<"blog">[]): Record<string, CollectionEntry<"blog">[]> {
  return posts.reduce(
    (acc, post) => {
      const year = post.data.created.getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(post);
      return acc;
    },
    {} as Record<string, CollectionEntry<"blog">[]>,
  );
}
