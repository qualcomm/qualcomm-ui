import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"
import babel from "vite-plugin-babel"

import {
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
} from "@qualcomm-ui/mdx-vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  /**
   * Pre-bundle deps the static scanner can't see (react/compiler-runtime is
   * injected by babel), so a late re-optimization can't crash the page mid-load.
   */
  optimizeDeps: {
    include: [
      "react/compiler-runtime",
      "@tanstack/react-query",
      "@floating-ui/dom",
      "lodash-es",
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
    babel({
      babelConfig: {
        plugins: ["babel-plugin-react-compiler"],
        presets: ["@babel/preset-typescript"], // if you use TypeScript
      },
      filter: /\.[jt]sx?$/,
    }),
    quiDocsPlugin(),
  ],
  resolve: {
    /**
     * Route table imports through a local shim so this app can test the React
     * Compiler-compatible table hook without changing docs examples. The table
     * source imports pagination internally, so pagination must also resolve to
     * source. Internal table dependencies also resolve to dist so Vite does not
     * mix source and built component modules, which can create duplicate React
     * contexts or component implementations.
     */
    alias: [
      {
        find: "@qualcomm-ui/react/table",
        replacement: resolve(__dirname, "./src/shims/react-table.ts"),
      },
      {
        find: "@qualcomm-ui/react-table-original",
        replacement: resolve(
          __dirname,
          "../../frameworks/react/dist/table/index.js",
        ),
      },
      {
        find: "@qualcomm-ui/react/pagination",
        replacement: resolve(
          __dirname,
          "../../frameworks/react/dist/pagination/index.js",
        ),
      },
      {
        find: "@qualcomm-ui/react/inline-icon-button",
        replacement: resolve(
          __dirname,
          "../../frameworks/react/dist/inline-icon-button/index.js",
        ),
      },
    ],
    tsconfigPaths: true,
  },
})
