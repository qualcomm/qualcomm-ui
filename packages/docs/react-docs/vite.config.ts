import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {defineConfig} from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import {
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
  reactDemoPlugin,
} from "@qualcomm-ui/mdx-vite"

export default defineConfig({
  clearScreen: false,
  optimizeDeps: {
    include: [
      "@faker-js/faker",
      "@floating-ui/react",
      "@hookform/resolvers/arktype",
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
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins()],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    tsconfigPaths(),
    quiDocsPlugin(),
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
      lazyLoadDevModules: false,
      transformLine: (line) => {
        if (
          line.trim().startsWith("// group:") ||
          line.trim().startsWith("/* eslint-disable")
        ) {
          return null
        }
        return line
      },
    }),
  ],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3100,
    warmup: {
      clientFiles: ["./src/root.tsx", "./src/components/**/*.tsx"],
    },
  },
})
