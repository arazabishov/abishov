import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";

export default defineConfig({
  site: "https://abishov.com",
  integrations: [sitemap(), react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
