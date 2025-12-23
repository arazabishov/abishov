import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { Site } from "../core/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  return rss({
    title: Site.title,
    description: Site.description,
    site: context.site!,
    items: posts.map((post) => ({
      ...post.data,
      link: `/${post.id}/`,
    })),
  });
}
