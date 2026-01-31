# abishov.com

[![CI](https://github.com/arazabishov/abishov/actions/workflows/ci.yml/badge.svg)](https://github.com/arazabishov/abishov/actions/workflows/ci.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fabishov.com)](https://abishov.com)

Personal blog built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed on [Cloudflare Pages](https://pages.cloudflare.com).

Theme inspired by [astro-erudite](https://github.com/jktrn/astro-erudite), heavily rewritten to simplify the project:

- Removed React dependencies in favor of pure Astro components with [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- No MDX support
- No subposts or side navigation for in-post sections
- No adjacent post navigation
- Replaced authors section with projects

## Commands

```sh
npm run dev       # Start dev server
npm run build     # Type-check and build
npm run preview   # Preview production build
npm run format    # Format with Prettier
npm run lint      # Lint with ESLint
```
