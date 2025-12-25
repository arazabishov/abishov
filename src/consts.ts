import type { IconMap, Site, SocialLink } from "./types";

export const SITE: Site = {
  title: "Araz Abishov",
  description: "Bits and bytes about open source, Android and Rust.",
  href: "https://abishov.com",
  author: "Araz Abishov",
  locale: "en-US",
  featuredCount: 2,
  postsPerPage: 5,
};

export const NAV_LINKS: SocialLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/bio" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/arazabishov" },
  { label: "Twitter", href: "https://twitter.com/arazabishov" },
  { label: "RSS", href: "/rss.xml" },
];

export const ICON_MAP: IconMap = {
  GitHub: "lucide:github",
  Twitter: "lucide:twitter",
  RSS: "lucide:rss",
};
