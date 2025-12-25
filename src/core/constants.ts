// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export type Site = {
  title: string;
  description: string;
  href: string;
  author: string;
  locale: string;
  featuredCount: number;
  postsPerPage: number;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type IconMap = {
  [key: string]: string;
};

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
  { label: "About", href: "/about" },
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
