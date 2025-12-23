import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import rehypeExternalLinks from "rehype-external-links";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://abishov.com",
  integrations: [
    expressiveCode({
      themes: ["github-light", "github-dark"],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.name.split("-")[1]}"]`,
      defaultProps: {
        wrap: true,
        collapseStyle: "collapsible-auto",
        overridesByLang: {
          "ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh":
            {
              showLineNumbers: false,
            },
        },
      },
      styleOverrides: {
        codeFontSize: "0.75rem",
        borderColor: "var(--border)",
        codeFontFamily: "var(--font-mono)",
        codeBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
        frames: {
          editorActiveTabForeground: "var(--muted-foreground)",
          editorActiveTabBackground:
            "color-mix(in oklab, var(--muted) 25%, transparent)",
          editorActiveTabIndicatorBottomColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorTabBorderRadius: "0",
          editorTabBarBackground: "transparent",
          editorTabBarBorderBottomColor: "transparent",
          frameBoxShadowCssValue: "none",
          terminalBackground:
            "color-mix(in oklab, var(--muted) 25%, transparent)",
          terminalTitlebarBackground: "transparent",
          terminalTitlebarBorderBottomColor: "transparent",
          terminalTitlebarForeground: "var(--muted-foreground)",
        },
      },
    }),
    sitemap(),
    react(),
    icon(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow", "noopener", "noreferrer"],
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
