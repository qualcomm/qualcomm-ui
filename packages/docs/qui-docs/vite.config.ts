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

import {copyMarkdown} from "./scripts/markdown-utils"

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins()],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    {
      buildStart: async () => {
        copyMarkdown()
      },
      name: "qui-copy-files",
    },
    reactRouter(),
    tsconfigPaths(),
    quiDocsPlugin(),
    reactDemoPlugin({
      demoPattern: "src/routes/debug+/*/demos/*.tsx",
      routesDir: "src/routes",
    }),
  ],
  server: {
    port: 3110,
  },
})
