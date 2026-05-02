// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-og-image",
    "nuxt-llms",
    "@nuxtjs/mcp-toolkit",
    "@nuxtjs/seo",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
    highlight: {
      theme: "dracula",
      preload: ["lua", "luau", "sh"],
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    preset: "github_pages",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  icon: {
    provider: "iconify",
  },

  llms: {
    domain: "https://docs-template.nuxt.dev/",
    title: "Nuxt Docs Template",
    description:
      "A template for building documentation with Nuxt UI and Nuxt Content.",
    full: {
      title: "Nuxt Docs Template - Full Documentation",
      description: "This is the full documentation for the Nuxt Docs Template.",
    },
    sections: [
      {
        title: "Getting Started",
        contentCollection: "docs",
        contentFilters: [
          { field: "path", operator: "LIKE", value: "/getting-started%" },
        ],
      },
      {
        title: "Essentials",
        contentCollection: "docs",
        contentFilters: [
          { field: "path", operator: "LIKE", value: "/essentials%" },
        ],
      },
    ],
  },
  ssr: false,
  mcp: {
    name: "Docs template",
  },

  app: {
    baseURL: "/light-reflector-docs/",
  },
});
