import { defineConfig } from "astro/config";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import rehypeExternalLinks from "rehype-external-links";
import remarkEmoji from "remark-emoji";
import tailwindcss from "@tailwindcss/vite";
import { expressiveCodeConfig } from "./ec.config";

export default defineConfig({
  site: "https://abishov.com",
  prefetch: true,
  integrations: [
    expressiveCode(expressiveCodeConfig),
    react(),
    sitemap(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow", "noreferrer", "noopener"],
        },
      ],
      rehypeHeadingIds,
    ],
    remarkPlugins: [remarkEmoji],
  },
});
