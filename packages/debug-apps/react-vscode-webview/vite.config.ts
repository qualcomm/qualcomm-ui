import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

export default defineConfig({
  base: "./",
  build: {
    cssCodeSplit: false,
    modulePreload: false,
    outDir: "dist/webview",
    rolldownOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith(".css"))
            ? "webview.css"
            : "assets/[name]-[hash][extname]",
        entryFileNames: "webview.js",
      },
    },
  },
  plugins: [react()],
  resolve: {tsconfigPaths: true},
  server: {port: 3410, strictPort: true},
})
