import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { type AstroExpressiveCodeOptions } from "astro-expressive-code";

// Languages that should not show line numbers (terminal/shell languages).
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
  // Disable automatic prefers-color-scheme detection; we control theme via data-theme attribute.
  useDarkModeMediaQuery: false,
  // Maps expressive-code themes to our data-theme attribute for theme synchronization.
  themeCssSelector: (theme: { name: string }) => {
    // ["github", "light"] or ["github", "dark"].
    const parts = theme.name.split("-");

    // Default to "light" if no "-" found.
    const mode = parts.length > 1 ? parts[1] : "light";

    // Return selector like [data-theme="light"] or [data-theme="dark"].
    return `[data-theme="${mode}"]`;
  },
  defaultProps: {
    // Enable soft-wrapping of long lines instead of horizontal scrolling.
    wrap: true,
    // Auto-collapse code blocks that exceed a certain height.
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
    uiFontFamily: "var(--font-sans)",
    frames: {
      editorActiveTabBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
      editorTabBarBackground: "transparent",
      frameBoxShadowCssValue: "none",
      terminalBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
      terminalTitlebarBackground: "transparent",
    },
    lineNumbers: {
      foreground: "var(--muted-foreground)",
    },
  },
};

export default defineConfig({
  // Used for generating absolute URLs in RSS feed and sitemap.
  site: "https://abishov.com",
  // Prefetch links on hover for faster navigation.
  prefetch: true,
  // Experimental features
  experimental: {
    // Fallbacks from Tailwind CSS defaults: https://tailwindcss.com/docs/font-family
    fonts: [
      {
        provider: fontProviders.fontsource(),
        cssVariable: "--font-geist",
        weights: ["100 900"],
        name: "Geist",
        fallbacks: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      {
        provider: fontProviders.fontsource(),
        cssVariable: "--font-geist-mono",
        weights: ["100 900"],
        name: "Geist Mono",
        fallbacks: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    ],
  },
  // expressiveCode must be before any other markdown integration.
  integrations: [expressiveCode(expressiveCodeConfig), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Rehype plugins transform HTML after markdown is parsed.
    rehypePlugins: [
      // Opens external links in new tab with security attributes.
      [
        rehypeExternalLinks,
        {
          // Opens link in a new tab instead of navigating away.
          target: "_blank",
          rel: [
            // Tells search engines not to pass SEO value to external site.
            "nofollow",
            // Hides referrer info from the destination site.
            "noreferrer",
            // Prevents new page from accessing window.opener (security).
            "noopener",
          ],
        },
      ],
    ],
  },
});
