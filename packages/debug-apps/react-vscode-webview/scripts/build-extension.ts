import {build} from "esbuild"

await build({
  bundle: true,
  entryPoints: ["src/extension/extension.ts"],
  external: ["vscode"],
  format: "cjs",
  outfile: "dist/extension.cjs",
  platform: "node",
  target: "node20",
})
