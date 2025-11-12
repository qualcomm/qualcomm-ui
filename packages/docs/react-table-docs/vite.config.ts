import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import {
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
  reactDemoPlugin,
} from "@qualcomm-ui/mdx-vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = resolve(__dirname, ".")

export default defineConfig({
  optimizeDeps: {
    include: [
      "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge",
      "@atlaskit/pragmatic-drag-and-drop/combine",
      "@atlaskit/pragmatic-drag-and-drop/element/adapter",
      "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview",
      "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview",
      "@faker-js/faker",
      "@floating-ui/react",
      "@mdx-js/react",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "dayjs",
      "fuzzysort",
      "jotai",
      "lodash-es",
      "lucide-react",
      "react-device-detect",
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
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@atlaskit/pragmatic-drag-and-drop",
        replacement: resolve(
          root,
          "./node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point",
        ),
      },
      {
        find: "@atlaskit/pragmatic-drag-and-drop-hitbox",
        replacement: resolve(
          root,
          "./node_modules/@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm",
        ),
      },
    ],
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3200,
    warmup: {
      clientFiles: ["./src/root.tsx", "./src/components/**/*.tsx"],
    },
  },
})
