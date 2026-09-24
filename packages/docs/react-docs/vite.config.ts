import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig, type Plugin} from "vite"

import {
  frontmatterHmrPlugin,
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
  reactDemoPlugin,
} from "@qualcomm-ui/mdx-vite"
import {
  resolveSemanticSearchPaths,
  semanticSearchDevPlugin,
} from "@qualcomm-ui/react-router-utils/node"

import quiDocsConfig from "./qui-docs.config.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

function preserveRouteMdxSymlinks(): Plugin {
  return {
    enforce: "pre",
    name: "preserve-route-mdx-symlinks",
    resolveId(source) {
      const [id, query] = source.split("?")
      if (!id.includes("/src/routes/") || !id.endsWith(".mdx")) {
        return
      }

      // React Router tracks route chunks by the symlinked route path.
      // Preserve only route MDX symlinks so pnpm package symlinks still resolve
      // normally.
      const routeId = id.startsWith("/src/routes/")
        ? resolve(__dirname, `.${id}`)
        : id

      return query ? `${routeId}?${query}` : routeId
    },
  }
}

export default defineConfig({
  clearScreen: false,
  optimizeDeps: {
    include: [
      "@faker-js/faker",
      "@floating-ui/react",
      "@hookform/resolvers/arktype",
      "@internationalized/number",
      "@mdx-js/react",
      "@shikijs/langs/angular-ts",
      "@shikijs/langs/angular-html",
      "@shikijs/langs/shell",
      "@shikijs/langs/json",
      "@shikijs/langs/tsx",
      "@shikijs/langs/typescript",
      "@shikijs/themes/slack-dark",
      "@shikijs/themes/github-light-high-contrast",
      "@tanstack/react-form",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "arktype",
      "fuzzysort",
      "jotai",
      "lodash-es",
      "lucide-react",
      "react-device-detect",
      "react-hook-form",
      "react-shiki/core",
      "react-simple-code-editor",
      "react-transition-group",
      "shiki",
    ],
  },
  plugins: [
    preserveRouteMdxSymlinks(),
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins()],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    quiDocsPlugin(),
    frontmatterHmrPlugin(),
    semanticSearchDevPlugin({
      outputDirectory: resolve(__dirname, "generated/semantic-search"),
      sectionsPath: resolveSemanticSearchPaths(quiDocsConfig.knowledge)
        .sectionsPath,
    }),
    reactDemoPlugin({
      demoPattern: [
        "./src/routes/components+/**/demos/**/*.ts",
        "./src/routes/components+/**/demos/**/*.tsx",
        "./src/routes/polymorphic-components+/demos/**/*.ts",
        "./src/routes/polymorphic-components+/demos/**/*.tsx",
        "./src/routes/patterns+/**/demos/**/*.ts",
        "./src/routes/patterns+/**/demos/**/*.tsx",
        "./src/routes/theming+/**/demos/**/*.ts",
        "./src/routes/theming+/**/demos/**/*.tsx",
      ],
      transformLine: (line) => {
        if (
          line.trim().startsWith("// group:") ||
          line.trim().startsWith("/* eslint-disable")
        ) {
          return null
        }
        return line
      },
      transformTailwindStyles: true,
    }),
  ],
  resolve: {
    alias: {
      // Shared MDX resolves provider imports from packages/docs/shared.
      // Use this docs app's MDX runtime while preserving route symlinks above.
      "@mdx-js/react": resolve(__dirname, "./node_modules/@mdx-js/react"),
      "~components": resolve(__dirname, "./src/components"),
      "~utils": resolve(__dirname, "./src/utils"),
    },
    tsconfigPaths: true,
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3100,
    warmup: {
      clientFiles: [
        "./src/root.tsx",
        "./src/components/**/*.tsx",
        "./src/routes/**/demos/**/*.tsx",
        "./src/routes/**/*.ts",
      ],
    },
  },
})
