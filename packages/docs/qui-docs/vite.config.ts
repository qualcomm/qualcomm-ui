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
  define: {
    global: "globalThis",
  },
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...(await getRehypePlugins())],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    tsconfigPaths(),
    quiDocsPlugin(),
    reactDemoPlugin({
      demoPattern: "./src/routes/debug+/**/demos/*.tsx",
      transformTailwindStyles: true,
    }),
  ],
  server: {
    port: 3110,
  },
})
