import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://psicologaioanafrale.netlify.app",
  integrations: [tailwind()],
  output: "server",
  adapter: netlify(),
  build: {
    inlineStylesheets: "auto",
  },
});
