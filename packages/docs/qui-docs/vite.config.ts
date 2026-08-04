import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"

import {
  frontmatterHmrPlugin,
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
  reactDemoPlugin,
} from "@qualcomm-ui/mdx-vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

const quiDocsConfigFile = "./src/qui-docs.config.ts"

export default defineConfig({
  define: {
    global: "globalThis",
  },
  plugins: [
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [...getRehypePlugins({configFile: quiDocsConfigFile})],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    quiDocsPlugin({configFile: quiDocsConfigFile}),
    frontmatterHmrPlugin(),
    reactDemoPlugin({
      demoPattern: "./src/routes/debug+/**/demos/*.tsx",
      transformTailwindStyles: true,
    }),
  ],
  resolve: {
    alias: {
      "~components": resolve(__dirname, "./src/components"),
      "~utils": resolve(__dirname, "./src/utils"),
    },
    tsconfigPaths: true,
  },
  server: {
    port: 3500,
  },
})
