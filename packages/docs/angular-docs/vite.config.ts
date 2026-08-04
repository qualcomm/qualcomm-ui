import mdx from "@mdx-js/rollup"
import {reactRouter} from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import {access, readFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig, type Plugin} from "vite"

import {
  angularDemoPlugin,
  frontmatterHmrPlugin,
  getRehypePlugins,
  getRemarkPlugins,
  quiDocsPlugin,
} from "@qualcomm-ui/mdx-vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

const demoElementsJsonPath = resolve(
  __dirname,
  "./angular-demo-module/generated/demo-elements.json",
)

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

let demoElementsJson = {}
if (
  await access(demoElementsJsonPath)
    .then(() => true)
    .catch(() => false)
) {
  demoElementsJson = JSON.parse(
    await readFile(demoElementsJsonPath, "utf-8").catch(() => "{}"),
  )
}

export default defineConfig({
  clearScreen: false,
  optimizeDeps: {
    include: [
      "@faker-js/faker",
      "@mdx-js/react",
      "@shikijs/langs/angular-ts",
      "@shikijs/langs/angular-html",
      "@shikijs/langs/shell",
      "@shikijs/langs/json",
      "@shikijs/langs/tsx",
      "@shikijs/langs/typescript",
      "@shikijs/themes/slack-dark",
      "@shikijs/themes/github-light-high-contrast",
      "arktype",
      "fuzzysort",
      "jotai",
      "lodash-es",
      "lucide-react",
      "react-device-detect",
      "react-shiki/core",
      "react-transition-group",
      "shiki",
    ],
  },
  plugins: [
    preserveRouteMdxSymlinks(),
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      rehypePlugins: [
        ...getRehypePlugins({
          rehypeShikiOptions: {langAlias: {angular2html: "angular-html"}},
        }),
      ],
      remarkPlugins: [...getRemarkPlugins()],
    }),
    reactRouter(),
    quiDocsPlugin(),
    frontmatterHmrPlugin(),
    angularDemoPlugin({
      demoPattern: [
        // these paths must also be accounted for in
        // angular-demo-module/angular-demo.component.ts
        "./src/routes/components+/**/demos/**/*.ts",
        "./src/routes/pitfalls+/**/demos/**/*.ts",
        "./src/routes/patterns+/**/demos/**/*.ts",
        "./src/routes/theming+/**/demos/**/*.ts",
      ],
      initialHtml: demoElementsJson,
      routesDir: "src/routes",
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
    port: 4300,
    warmup: {
      clientFiles: ["./src/root.tsx", "./src/components/**/*.tsx"],
    },
  },
})
