import {defineConfig, type Plugin} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

import {dependenciesToExternal} from "@qualcomm-ui/vite"

import {getNavFileJsonSchema} from "./src/docs-plugin/config/config-schema.js"

function navFileJsonSchemaPlugin(): Plugin {
  return {
    generateBundle() {
      this.emitFile({
        fileName: "schemas/nav.schema.json",
        source: `${JSON.stringify(getNavFileJsonSchema(), null, 2)}\n`,
        type: "asset",
      })
    },
    name: "nav-file-json-schema",
  }
}

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        cli: "./src/cli.ts",
        index: "./src/index.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        ...(await dependenciesToExternal()),
        /^@qualcomm-ui\//,
        /^node/,
      ],
      output: {
        entryFileNames: "[name].js",
        minify: true,
      },
      platform: "node",
    },
    sourcemap: true,
  },
  plugins: [
    navFileJsonSchemaPlugin(),
    viteStaticCopy({
      targets: [
        ...["docs-plugin", "angular-demo-plugin", "react-demo-plugin"].map(
          (plugin) => ({
            dest: "",
            rename: {stripBase: 1},
            src: `src/${plugin}/virtual.d.ts`,
          }),
        ),
      ],
    }),
  ],
})
