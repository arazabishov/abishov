import { defineConfig } from "astro/config";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import expressiveCode, {
  type AstroExpressiveCodeOptions,
} from "astro-expressive-code";
import rehypeExternalLinks from "rehype-external-links";
import remarkEmoji from "remark-emoji";
import tailwindcss from "@tailwindcss/vite";

// Languages that should not show line numbers (terminal/shell languages)
const terminalLanguages = [
  "ansi",
  "bat",
  "bash",
  "batch",
  "cmd",
  "console",
  "powershell",
  "ps",
  "ps1",
  "psd1",
  "psm1",
  "sh",
  "shell",
  "shellscript",
  "shellsession",
  "text",
  "zsh",
];

const expressiveCodeConfig: AstroExpressiveCodeOptions = {
  themes: ["github-light", "github-dark"],
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme: { name: string }) => {
    // ["github", "light"] or ["github", "dark"]
    const parts = theme.name.split("-");

    // default to "light" if no "-" found
    const mode = parts.length > 1 ? parts[1] : "light";

    // return selector like [data-theme="light"] or [data-theme="dark"]
    return `[data-theme="${mode}"]`;
  },
  defaultProps: {
    wrap: true,
    collapseStyle: "collapsible-auto",
    overridesByLang: {
      [terminalLanguages.join(",")]: {
        showLineNumbers: false,
      },
    },
  },
  styleOverrides: {
    borderColor: "var(--border)",
    codeFontSize: "0.75rem",
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
      terminalBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
      terminalTitlebarBackground: "transparent",
      terminalTitlebarBorderBottomColor: "transparent",
      terminalTitlebarForeground: "var(--muted-foreground)",
    },
    lineNumbers: {
      foreground: "var(--muted-foreground)",
    },
    uiFontFamily: "var(--font-sans)",
  },
};

export default defineConfig({
  site: "https://abishov.com",
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
