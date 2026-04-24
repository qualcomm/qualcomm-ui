import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {defineConfig} from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import {
  frontmatterHmrPlugin,
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
  reactDemoPlugin,
} from "@qualcomm-ui/mdx-vite"

export default defineConfig({
  define: {
    global: "globalThis",
  },
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins()],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    tsconfigPaths({
      projects: ["./tsconfig.lib.json"],
    }),
    quiDocsPlugin(),
    frontmatterHmrPlugin(),
    reactDemoPlugin({
      demoPattern: "./src/routes/debug+/**/demos/*.tsx",
      transformTailwindStyles: true,
    }),
  ],
  server: {
    port: 3500,
  },
})
