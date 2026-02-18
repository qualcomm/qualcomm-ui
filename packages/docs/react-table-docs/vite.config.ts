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
  optimizeDeps: {
    include: [
      "@faker-js/faker",
      "@floating-ui/react",
      "@mdx-js/react",
      "@shikijs/langs/angular-ts",
      "@shikijs/langs/angular-html",
      "@shikijs/langs/shell",
      "@shikijs/langs/json",
      "@shikijs/langs/tsx",
      "@shikijs/langs/typescript",
      "@shikijs/themes/slack-dark",
      "@shikijs/themes/github-light-high-contrast",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "dayjs",
      "fuzzysort",
      "jotai",
      "lodash-es",
      "lucide-react",
      "react-device-detect",
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
      demoPattern: "src/routes/**/*/demos/*.tsx",
      transformTailwindStyles: true,
    }),
  ],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3200,
    warmup: {
      clientFiles: ["./src/root.tsx", "./src/components/**/*.tsx"],
    },
  },
})
